from OSC import OSCServer, OSCClient, OSCMessage

class LiveRawAPI(object):
    """
    This is close to live's API objects as possible
    Of course, they are designed to be manipulated from a patcher,
    not real code, so a bit more wrapping is in order.
    """
    _incoming = None
    _handled = True
    
    def __init__(self,
            there_host="localhost",
            there_port=7400,
            here_host="localhost",
            here_port=7401):
        self.oscserver = OSCServer((here_host, here_port))
        self.oscclient = OSCClient()
        self.oscclient.connect((there_host, there_port))
        self.oscserver.addMsgHandler('/response', self._handle_response)

    def raw_query(self, *args):
        self.oscclient.send(OSCMessage('/query', ['path', 'getpath']))
        return self.handle_request()
        
    def _handle_response(self, path, tags, args, source):
        print "callback", path, args, source
        self._incoming = args
        self._handled = False
    
    def handle_request(self):
        while self._handled:
            self.oscserver.handle_request()
        self._handled = False
        return self._incoming
        
    def close(self):
        self.oscserver.close()


api = LiveRawAPI()

# api.query('path', 'getpath')
# api.oscserver.handle_request()
