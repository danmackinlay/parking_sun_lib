#!/bin/env python
from gevent import monkey; monkey.patch_all()
import argparse
from http_osc_bridge import spawn_http_proxy

if __name__=='__main__':
    parser = argparse.ArgumentParser(description='build an HTTP bridge to OSC-land')
    parser.add_argument('--http-host', default='',
        help='where do we listen?')
    parser.add_argument('--http-port', type=int,
        default=8088,
        help='local HTTP listening port')
    parser.add_argument('--web-app-dir',
        help='path to web app root dir - should contain an index.html if you'
            ' want the displayed link to make sense')
    parser.add_argument('--dest-osc-host', default='localhost',
        help='where do we listen?')
    parser.add_argument('--dest-osc-port', type=int,
        default=5055,
        help='remote OSC destination port')
    parser.add_argument('--osc-command-name',
        default='/castanet',
        help='remote OSC path to send to')
    # listening doesn't yet work:
    # parser.add_argument('--local-osc-host', default='localhost',
    #     help='where do we listen?')
    # parser.add_argument('--remote-osc-port', type=int,
    #     default=5056,
    #     help='local OSC listening port')
    param = parser.parse_args()
    
    spawn_http_proxy(
        local_http_address=(param.http_host, param.http_port),
        remote_osc_address=(param.dest_osc_host, param.dest_osc_port),
        web_app_dir=param.web_app_dir,
        osc_command_name=param.osc_command_name
    ).go()
