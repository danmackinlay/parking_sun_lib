#!/usr/bin/env python
# encoding: utf-8
"""
http_osc_bridge.py

Created by dan mackinlay on 2011-05-06.
Copyright (c) 2011 __MyCompanyName__. All rights reserved.
"""
from gevent import monkey; monkey.patch_all()
import gevent
from proxy_osc import OscProxyClient
from gevent.queue import Queue, Full, Empty
from proxy_http import HttpProxy

class HttpOscProxy(object):
    def __init__(self,
            local_http_address=('', 8088),
            remote_osc_address=('localhost', 5055),
            web_app_dir=None,
            osc_command_name='/castanet',
        ):
        
        osc_to_json_q = Queue(maxsize=1000)
        json_to_osc_q = Queue(maxsize=1000)
        
        self.http_proxy_server = HttpProxy(
            osc_to_json_q=osc_to_json_q,
            json_to_osc_q=json_to_osc_q,
            local_http_address=local_http_address,
            remote_osc_address=remote_osc_address,
            web_app_dir=web_app_dir,
            bridge=self
        )
        self.osc_proxy_client = OscProxyClient(
            json_to_osc_q=json_to_osc_q,
            remote_osc_address=remote_osc_address,
            osc_command_name=osc_command_name,
            bridge=self
        )
        self.osc_to_json_q = osc_to_json_q
        self.json_to_osc_q = json_to_osc_q
    
    def go(self):
        #fails to switch if we spawn it naked:
        h = gevent.spawn(self.http_proxy_server.serve_forever)
        #but now we can *go*.
        self.osc_proxy_client.serve_forever()
        
def spawn_http_proxy(
          local_http_address=('', 8088),
          remote_osc_address=('localhost', 5055),
          web_app_dir=None,
          osc_command_name=None,
        ):
    
    proxy = HttpOscProxy(
      local_http_address=local_http_address,
      remote_osc_address=remote_osc_address,
      web_app_dir=web_app_dir,
      osc_command_name=osc_command_name,
    )
    return proxy
