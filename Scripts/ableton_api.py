from OSC import OSCServer, OSCClient, OSCMessage

class LiveRawAPI(object):
    """
    This is close to live's API objects as possible
    Of course, they are designed to be manipulated from a patcher,
    not real code, so a bit more wrapping is in order.
    To keep everything minimal, this is done in a subclass.
    """
    _incoming = None
    _handled = True
    
    def __init__(self,
            there_host="localhost",
            there_port=7400,
            here_host="localhost",
            here_port=7401,
            *args, **kwargs):
        super(LiveRawAPI, self).__init__(*args, **kwargs)
        self.oscserver = OSCServer((here_host, here_port))
        self.oscclient = OSCClient()
        self.oscclient.connect((there_host, there_port))
        self.oscserver.addMsgHandler('/response', self._handle_response)

    def raw_query(self, *args):
        """Posts a query, waits for a response. Returns it.
        Note that state is fragile here, so you'd better be sure that there 
        will be a response, or it will hang waiting."""

        self.oscclient.send(OSCMessage('/query', args))
        return self.handle_request()
    
    def raw_call(self, *args):
        """Posts a call, returns nothing.
        Note that state is fragile here, so you'd better be sure that there 
        will be no response, or you won't know what returned what."""
        self.oscclient.send(OSCMessage('/query', ['path', 'getpath']))
    
    def _handle_response(self, path, tags, args, source):
        """private callback to handle OSC responses. Sets state."""
        print "callback", path, args, source
        self._incoming = args
        self._handled = False
    
    def handle_request(self):
        """hack to handle asynchronous calls:
        1 Loop until something has been returned and tacked onto the class.
        2 Return it and reset."""
        while self._handled:
            self.oscserver.handle_request()
        self._handled = False
        _incoming = self._incoming
        self._incoming = None
        return _incoming
        
    def close(self):
        self.oscserver.close()

    ### more structured access involves navigating places with the path object
    def goto(self, *args):
        resp = self.raw_query('path', 'goto', *args)
        prefix, path = resp[1], resp[2:]
        #sanity check that we are getting the right message
        assert prefix=='path'
        self.path = path
    
    def path(self, *args):
        return self.goto(*args)

    def getchildren(self):
        resp = self.raw_query('path', 'getchildren')
        return resp[1:]

    def getcount(self):
        resp = self.raw_query('path', 'getcount')
        return resp[1:]

class LivePresetManager(object):
    """a bunch of settings for the api device and its antecedents"""
    path = None
    api = None
    
    def __init__(self, api, *args, **kwargs):
        super(LivePresetManager, self).__init__(*args, **kwargs)
        self.api = api
        self.path = []
    

api = LiveRawAPI()
preset_mgr = LivePresetManager(api)

# api.query('path', 'getpath')
# api.oscserver.handle_request()
