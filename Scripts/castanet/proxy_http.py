#!/usr/bin/env python
# encoding: utf-8
"""
proxy_http.py

Created by dan mackinlay on 2011-05-09.
Copyright (c) 2011 __MyCompanyName__. All rights reserved.
"""
from gevent import monkey; monkey.patch_all()
from gevent.queue import Queue, Full, Empty
from bottle import Bottle, static_file, route, run, debug, request, response
from os.path import dirname, realpath, abspath, join
import sys
import time

debug(True)

HERE = dirname(__file__)

class HttpProxy(object):
    def __init__(self,
            local_http_address,
            remote_osc_address,
            json_to_osc_q,
            osc_to_json_q=None,
            web_app_dir=None,
            bridge=None,
            *args, **kwargs):
        
        self.local_http_address = local_http_address
        self.remote_osc_address = remote_osc_address
        self.bridge = bridge
        
        web_app = Bottle()
        
        if web_app_dir is None:
            web_app_dir = join(HERE, 'exampleapp')
        
        web_app_dir = abspath(realpath(web_app_dir))
        
        #Don't really need this thanks to closure, but helps for debugging
        self.web_app_dir = web_app_dir
        
        @web_app.route('/timestamp/')
        def timestamp():
            """return the proxy's idea of the time. Poor man's local NTP."""
            response.headers['Content-Type'] = 'application/json;charset=utf-8'
            return ''.join(['{"proxy_time":', str(time.time()*1000.), '}'])
            
        @web_app.route('/timestamp/:request_time')
        def timestamp(request_time):
            """return the proxy's idea of the time, and the supposed client
            time. poor man's NTP, minus one source of jitter. We return the
            supplied request time for ease of callback-management"""
            request_time = float(request_time)
            now = time.time()*1000.0
            response.headers['Content-Type'] = 'application/json;charset=utf-8'
            return ''.join([
              '{"proxy_time":',    str(now), ",",
               '"request_time":',  str(request_time), ",",
               '"request_lag":',   str(now-request_time),
            '}'])
        
        @web_app.route('/static/:path#.*#')
        def serve_static(path):
            """This is where we serve static files from to avoid single origin
            policy problems"""
            return static_file(path, root=web_app_dir)
        
        @web_app.route('/forward/:path#.*#', method=('GET', 'POST', 'DELETE', 'PUT'))
        def pump_data(path):
            """Data that gets forwarded to the OSC server (and longpolled
             back?)"""
            json_to_osc_q.put([
              request.method,
              '/'+path,
              request.body.read()
            ])
            response.headers['Content-Type'] = 'application/json;charset=utf-8'
            return ['{"status": "OK"}']
        
        self.http_server = web_app
        print 'Serving HTTP on http://%s:%d/static/index.html' % (
          local_http_address[0] or '127.0.0.1',
          local_http_address[1]
        )
        #except that no request will truly be serviced until serve_forever is fired
    
    def serve_forever(self):
        run(
            self.http_server,
            host=self.local_http_address[0],
            port=self.local_http_address[1],
            server='gevent'
        )
        