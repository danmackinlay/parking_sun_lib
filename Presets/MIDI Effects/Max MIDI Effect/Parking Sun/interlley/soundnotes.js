var noteson = {};

function list()
{
    var a = arrayfromargs(arguments);
    post("received list " + a + "\n");
    myval = a;
    bang();
}

