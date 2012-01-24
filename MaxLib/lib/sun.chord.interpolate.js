/* 
gradually interpolate between chords in the MIDI domain

TODO:

* reseedable RNG
* Document params.
* variable note velocity (exp distributed? power law?) 

  * some kind of joint distribution?
  
* when there are no notes in, fade to zero
* separate into two separate midi tools
* support a flush command
* exponential and linear decays
* work out why intensities oscillate around peak despite tolerance param
* preserve channel and poly pressure and bend messages for a given note
*/

//////// Max Initialisation
inlets = 1;

//////// library functions
var lib;

//////// Declare global JS vars
var _rng;
var _tolerance = 1/128;
//what to converge to
var _ideal_notebag = {};
// what notes are converging
var _held_notebag = {};
// how minute the probability distribution levels are.
var _range = 0.1;
//we can optionally mark polyphony pressure results separately
var tweak_prefix = "midinote";

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
function response(val) {
  _response = val;
};
function range(val) {
  _range = val;
};
// number lists are presumed to be MIDI notes
function list(pitch, vel) {
  if (vel) {
    _ideal_notebag[String(pitch)] = vel/127;
  } else {
    delete _ideal_notebag[String(pitch)];
  }
};
//iterate the drunken walk for each note
function bang() {
  // basic heartbeat function keeps the dist updating going on.
  var sources = {}; //where we are
  var targets = {}; //where we aim
  var dests = {};   //where we go
  //merge all notesets
  for (var note in _ideal_notebag) {
    sources[note] = 0;
    targets[note] = _ideal_notebag[note];
  }
  for (var note in _held_notebag) {
    sources[note] = _held_notebag[note];
    if (!targets[note]) {
      targets[note] = 0;
    }
  }
  
  //we should now have the same keys in sources and targets. So.
  for (var note in sources) {
    var priority_dests;
    var curr_source = sources[note];
    var curr_target = targets[note];
    var curr_dest = curr_target;
    var r;
    if ((curr_target - _tolerance) > curr_source) {
      curr_dest = Math.min(curr_source + _range, 1);
    } else if ((curr_target + _tolerance) < curr_source) {
      curr_dest = Math.max(curr_source - _range, 0);
    };
    dests[note] = curr_dest;
    //table-compatible density outlet
    outlet(0, "dist", Number(note), Math.floor(128*curr_dest));
  }
  _update_outs(dests);
};

/////// internal logic

function _update_outs(dests) {
  var notes_to_stop = [];
  var notes_to_start = {};
  var notes_to_tweak = {};
  
  for (var note in dests) {
    if (!_held_notebag.hasOwnProperty(note)) {
      notes_to_start[note] = dests[note];
    } else if (_held_notebag[note]!==dests[note]) {
      notes_to_tweak[note] = dests[note];
    };
  };
  for (var note in _held_notebag) {
    if (!dests[note]) {
       notes_to_stop.push(note);
    };
  };
  notes_to_stop.forEach(_stop_note);
  for (note in notes_to_start) {
    _start_note(note, notes_to_start[note]);
  }
  for (note in notes_to_tweak) {
    _tweak_note(note, notes_to_tweak[note]);
  }
  // that is all
};
function _start_note(note, val) {
  _held_notebag[note] = val;
  outlet(0, "midinote", Number(note), Number(val));
}
function _tweak_note(note, val) {
  _held_notebag[note] = val;
  outlet(0, tweak_prefix, Number(note), Number(val));
}
function _stop_note(note) {
  delete _held_notebag[note];
  outlet(0, "midinote", Number(note), 0);
}
