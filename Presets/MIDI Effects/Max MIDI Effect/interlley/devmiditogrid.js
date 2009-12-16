var translator = "padkontrol";

var transfunctions={
  padkontrol: function(note) {
    var i = note - 48;
    var x = i % 4
    var y = Math.floor(i/4)
    post("grid  " + x + ", " + y + "\n");
    return [x, y]
  }
}

function msg_int(pitch)
{
    post("received  " + pitch + "\n");
    outlet(0, transfunctions[translator](pitch));
}
