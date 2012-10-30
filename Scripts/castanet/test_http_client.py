#!/usr/bin/env python
# encoding: utf-8
"""
test_http_client.py

Created by dan mackinlay on 2011-05-06.
Copyright (c) 2011 __MyCompanyName__. All rights reserved.
"""
from gevent import monkey; monkey.patch_all()
import unittest
import sys
import os.path
import subprocess
import urllib2
from time import sleep, time
from gevent.queue import Queue, Full, Empty
import gevent.hub
from proxy_osc import SimplerOSCRequestHandler, SimplerOSCServer
from OSC import OSCServer, OSCRequestHandler, getUrlStr
import json

def get_castanet_proxy_path():
    import main
    return main.__file__    
    
class test_http_client(unittest.TestCase):
    def setUp(self):
        self.local_http_address = ('', 8088)
        self.remote_osc_address = ('127.0.0.1', 5055)
        castanet_proxy_path = get_castanet_proxy_path()
        print 'castanet_proxy_path', castanet_proxy_path
        self.castanet_proxy = subprocess.Popen(['python', castanet_proxy_path])
        self.osc_endpoint = self._get_osc_test_server()
        self.testQueue = Queue(maxsize=1000)
        #these all take time to initialise.
        sleep(0.5)
    
    def tearDown(self):        
        self.castanet_proxy.kill()
        self.osc_endpoint.close()
        gevent.hub.shutdown()
    
    def _get_osc_test_server(self, port=None):
        def intercepting_handler(addr, tags, data, source):
            msg_string = "%s [%s] %s" % (addr, tags, str(data))
            sys.stdout.write(
                "OSCServer Got: '%s' from %s\n" % (
                    msg_string, getUrlStr(source)
            ))
            self.testQueue.put(data)
        port = port or self.remote_osc_address[1]
        s = OSCServer(('localhost', port))
        s.addMsgHandler('default', intercepting_handler)

        return s
    
    def _getOscResponse(self):
        self.osc_endpoint.handle_request()
        full_response = self.testQueue.get()
        return full_response
        
    def _sendHttpData(self, path, data=None):
        """If data is supplied, this will be a POST, otherwise GET. Because
        that's how the ancient old urllib2 rolls."""
        http_address = "http://%s:%d%s" % (
          '127.0.0.1',
          self.local_http_address[1],
          path
        )
        print 'http_address', http_address
        return urllib2.urlopen(http_address, data)
        
    def testHttpProxy(self):
        test_vars = (
          ('POST', '/sequence/3/note/4', '{"a": "b", "c": 2}'),
          ('POST', '/sequence/3/note/4', '["ee", "ff", "GG", 555.3, 7.1]')
        )
        
        for query in test_vars:
            verb, path, data = query # we don't really support multiple verb atm
            self._sendHttpData('/forward' + path, data)
            resp_verb, resp_path, resp_data = self._getOscResponse()
            # import pdb; pdb.set_trace()
            self.assertEquals(query, (resp_verb, resp_path, resp_data))

    def testHttpTime(self):
        #Note python uses seconds, JS, ms
        request_now = time()*1000.
        resp = json.load(
            self._sendHttpData('/timestamp/' + str(request_now))
        )
        response_now = time()*1000.
        #these tests are only valid because we know bother server and
        # client times. In general, these values could be anything.
        self.assertTrue(resp["proxy_time"]>request_now,
          "%f is not greater than %f" %(resp["proxy_time"], request_now))
        self.assertTrue((resp["proxy_time"]-request_now)<1,
          "%f is much greater than %f" %(resp["proxy_time"], request_now)
        )
        self.assertTrue((resp["request_lag"]>0),
          "%f is negative" % resp["request_lag"])
        
if __name__=='__main__':
    unittest.main()