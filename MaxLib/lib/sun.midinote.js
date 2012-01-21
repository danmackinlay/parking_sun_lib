/* 
Does what the "midinote" message to poly~ *should* do, which is
1. accept lists of (pitch, val). These are floats.
2. pass on all additional arguments
3. handle "poor man's aftertouch", sending successive onsets to the same pitch to the same destination.
*/

var _notes_data = {};
var _notes_polys = {};
var _polys_notes = {};
var _max_voices = 16;

function midinote(pitch, vel) {
  return _voice(arrayfromargs(arguments));
};
function list(pitch, vel) {
  return _voice(arrayfromargs(arguments));
};
function _voice(ar) {
  pitch = ar[0];
  vel = ar[1];
  if (vel===0) {
    if (_notes_polys.hasOwnProperty(String(pitch))) {
      //note off for an assigned voice
      var poly = _notes_polys[String(pitch)];
    
      delete _notes_polys[String(pitch)];
      delete _polys_notes[String(poly)];
      delete _notes_data[String(pitch)];
      
      ar.unshift(0);
      outlet(0, "target", (poly + 1));
      outlet.apply(this, ar);
      outlet(0, "target", 0);
    } //else, spurious note off. Ignore.
  } else {
    //note on.
    var poly;
    if (_notes_polys.hasOwnProperty(String(pitch))) {
      poly = _notes_polys[pitch];
    } else {
      poly = _next_free_poly();
    };
    if (poly>=0) {
      _notes_polys[String(pitch)] = poly;
      _polys_notes[String(poly)] = pitch;
      _notes_data[String(pitch)] = ar;
      ar.unshift(0);
      outlet(0, "target", (poly + 1));
      outlet.apply(this, ar);
      outlet(0, "target", 0);
    }
  }
}
function _next_free_poly() {
  var i = 0;
  for (i=0; (_polys_notes.hasOwnProperty(String(i)))&&(i<=_max_voices); i++) {
  }
  if (i<_max_voices) {
    return i;
  } else {
    return -1;
  };
  return i;
}