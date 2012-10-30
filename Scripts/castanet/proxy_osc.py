#!/usr/bin/python
"""
Handle incoming OSC requests by forwarding them as HTTP requests
Well, eventually. that functionality is not impleented yet, but here are some helpers along that route
"""
from gevent import monkey; monkey.patch_all()
import gevent
from pprint import pprint
from gevent.queue import Queue, Full, Empty
from OSC import OSCClient, OSCServer, OSCRequestHandler, decodeOSC, OSCMessage, OSCBundle, decodeOSC, OSCString, OSCBlob, OSCTimeTag, OSCArgument

class SimplerOSCRequestHandler(OSCRequestHandler):
    """pyOSC's OSCRequestHandler is too clever by half, unbundling bundles,
    stripping time tags, waiting, sleeping, doing all manner of obsequious
    useless interference. Pshaw. We don't want this little process to do
    anything but proxy its requests forward to be handled by others more
    competent than itself."""
    def __init__(self, message_wrangler=None, *args, **kwargs):
        super(SimplerOSCRequestHandler).__init__(*args, **kwargs)
        if message_wrangler is None:
            def message_wrangler(*args, **kwargs):
                pass
        self.message_wrangler = message_wrangler
        
    def handle(self):
        """Handle incoming OSCMessage
        """
        decoded = decodeOSC(self.packet)
        self.message_wrangler(decoded)
        # replies = handle_osc_request(decoded)

class SimplerOSCServer(OSCServer):
    """An OSC server stripped of excessive malarkey such as breaking up
    bundles or delaying timestamped ones, or dispatching addresses.
    We want to leave all that as-is and proxy it on to the *real* server.
    
    To do that, every incoming OSC bundle should be pushed onto a queue and
    left there."""
    RequestHandlerClass = SimplerOSCRequestHandler

def handle_osc_request(msg_parts):
    print "handling OSC request"
    pprint(msg_parts)
    osc_to_json_q.put(msg_parts)

class OscProxyClient(object):
    def __init__(self,
            remote_osc_address,
            json_to_osc_q,
            osc_command_name,
            bridge=None,
            *args, **kwargs):
        self.remote_osc_address = remote_osc_address
        self.json_to_osc_q = json_to_osc_q
        self.osc_client = OSCClient()
        self.osc_client.connect(remote_osc_address)
        self.osc_command_name = osc_command_name
        self.bridge = bridge
    
    def serve_forever(self):
        for msg in self.json_to_osc_q:
            osc_msg = OSCMessage(self.osc_command_name)
            osc_msg.append(msg[0]) #HTTP verb
            osc_msg.append(msg[1]) #HTTP path
            osc_msg.append(msg[2]) #content
            self.osc_client.send(osc_msg)
    
    def close(self):
        self.osc_client.close()
