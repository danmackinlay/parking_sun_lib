from OSC import OSCServer, OSCClient, OSCMessage
maxserver = OSCServer(("localhost", 7401))
def osc_callback(path, tags, args, source):
    print "callback", path, args
maxserver.addMsgHandler('/response', osc_callback)
maxclient = OSCClient()
maxclient.connect(("localhost", 7400))
maxclient.send(OSCMessage('/query', [1, 'path', 'getpath']))
maxserver.handle_request()