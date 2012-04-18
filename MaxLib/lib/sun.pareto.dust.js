/* 
gradually interpolate between chords in the MIDI domain

TODO:

* Document params.
* variable note velocity (exp distributed? power law?) 

  * some kind of joint distribution?

* support a flush command
* exponential and linear decays
*/

//////// Max Initialisation
inlets = 1;

//////// library functions
var lib;

//////// Declare global JS vars
var _rng;
// what notes are converging
var _held_notebag = {};
var _intensity;
var _vel_exp;
var _mean_vel;
var _length_exp;
var _mean_length;

var delayed_start = new Task(function () {outlet(0, "alive", "bang")}, this);
delayed_start.interval = 50;
delayed_start.execute();

function loadbang() {
  //Init global vars in this function to ease debugging.
  //You might need to retrigger init by sending a loadbang msg.
  
  //////// library functions
  lib = {}
  
  sun_include(lib, "sun.library.js");
  _rng = new lib.PseudoRandom();
  
  if (jsarguments.length>1) {
    if (jsarguments[1]==="pressure") {
      tweak_prefix = "midipressure";
    }
  }
};
/////// handling messages
//PRNG seeding
function seed(seed) {
  _rng = new lib.PseudoRandom(seed);
};
function intensity(val) {
  _response = val;
};
function midinote(pitch, vel) {
  if (vel) {
    _held_notebag[String(pitch)] = vel/127;
  } else {
    delete _held_notebag[String(pitch)];
  }
};
function _pareto_quantile(y, a, b){}
function _exp_quantile(y, a){}
function _note_quantile(y){}g
function _next_note() {}


