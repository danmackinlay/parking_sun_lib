/* maintain a list of agents who drunkenly walk to preserve distribution of
impulses according to prescribed density and incoming held note velcity, in
in the mean */

//////// Max Initialisation
inlets = 1;

//////// library functions
var lib;

//////// Declare global JS vars
var _rng;
var _ideal_notebag;
var _held_notebag;
var _response;
var _range;
var _intensity;

function loadbang() {
  //Init global vars in this function to ease debugging.
  //You might need to retrigger init by sending a loadbang msg.
  
  //////// library functions
  lib = {}
  
  sun_include(lib, "sun.library.js");
  _rng = new lib.PseudoRandom();
  
  //////// assign initial values to JS vars
  _ideal_notebag = {};
  _held_notebag = {};
  _intensity = 10;
  _response = 0.5;
  _range = 0.1;
};
/////// handling messages
// number lists are presumed to be MIDI notes

//PRNG seeding
function seed(seed) {
  _rng = new lib.PseudoRandom(seed);
};
function response(val) {
  _response = val;
};
function range(val) {
  _range = val;
};
function intensity(val) {
  _intensity = val;
};
function list(pitch, vel) {
  if (vel) {
    _ideal_notebag[pitch] = vel/127;
  } else {
    delete _ideal_notebag[pitch];
  }
};
//iterate the drunken walk for each note
function bang() {
  
};
/////// internal logic


