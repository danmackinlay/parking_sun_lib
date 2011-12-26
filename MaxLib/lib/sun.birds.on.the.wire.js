/* 
Maintain a list of agents who drunkenly walk to preserve distribution of
impulses according to prescribed density and incoming held note velocity,
in the mean
*/

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
  var sources = {}; //where we are
  var targets = {}; //where we aim
  var dests = {};   //where we go
  //calculate probs.
  //If reponse = 1, always go the correct way.
  //If response = 0, wander uniformly.
  var prob_right = (1 + _response)/3;
  var prob_wrong = (1 - prob_right)/2;
  var probs = [prob_right, prob_wrong, prob_wrong];
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
    var curr_source = Math.round(sources[note]/_range);
    var curr_target = Math.round(targets[note]/_range);
    var curr_dest;
    var lower = Math.max(curr_source-1, 0);
    var higher = Math.min(curr_source+1, 1/_range); //rounding probs?
    var r;
    if (curr_source>curr_dest) {
      priority_dests = [lower, curr_source, higher];
    } else if (curr_dest>curr_source) {
      priority_dests = [higher, curr_source, lower];
    } else {
      priority_dests = [curr_source, higher, lower];
    }
    r = _rng.random();
    if (r<prob_right) {
      curr_dest = priority_dests[0];
    } else if (r>prob_right+prob_wrong) {
      curr_dest = priority_dests[1];
    } else {
      curr_dest = priority_dests[2];
    }
    dests[note] = curr_dest * _range;
  }
  _update_outs(dests);
};

/////// internal logic

function _update_outs(dests) {
  var notes_to_stop = [];
  var notes_to_tweak = {};
  
  for (var note in dests) {
    if (!_held_notebag.hasOwnProperty(note)) {
      notes_to_tweak[note] = dests[note];
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
  for (note in notes_to_tweak) {
    _tweak_note(note, notes_to_tweak[note]);
  }
  // that is all
};

function _tweak_note(note, val) {
  _held_notebag[note] = val;
  outlet(0, Number(note), Number(val));
}
function _stop_note(note) {
  delete _held_notebag[note];
  outlet(0, Number(note), 0);
}
