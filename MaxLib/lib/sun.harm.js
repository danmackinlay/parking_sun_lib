//////// Max Initialisation
inlets = 1;

//////// library functions
lib = {}
include(lib, "sun.library.js");

//////// Initialise JS state
var _basenote = 69;
var _basefreq = 440;
var _numbag = {};
_numbag.weights = new Array;
_numbag.val = new Array;
var _denombag = {};
_denombag.weights = new Array;
_denombag.val = new Array;
var _rng = new lib.PseudoRandom();
var _chordnotes = 0;
var _ratio_set = [];
var _held_note_set = [];
var _octave_range = [0,0];
var _all_candidates;
var _notetrig = true;
var _chordtrig = false;
var _seedtrig = false;
var _octaves_up = 0;
var _octaves_down = 0;

//we choose a bag size so we can set default contents
var bagsize = 3;
if (jsarguments.length >=2) {
  bagsize = jsarguments[1];
}

for (var i=0; i < bagsize; i++) {
  _numbag.weights[i] = 0;
  _numbag.val[i] = 1;
  _denombag.weights[i] = 0;
  _denombag.val[i] = 1;
}

/////// handling messages
// number lists are presumed to be MIDI notes
function base(note) {
  _maintain_basenote(note);
  if (_notetrig) { bang();};
}
// numerator val or weights lists
function num() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_numbag, ar);
}
// denominator val or weights lists
function denom() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_denombag, ar);
}
// scale ranges
function up(dist) {
  _octaves_up = Math.floor(dist);
};
function down(dist) {
  _octaves_down = Math.floor(dist);
};
//PRNG seeding
function seed(seed) {
  _rng.seed_ = seed;
  //first result after reseed is rubbish.
  _rng.random();
  if (_seedtrig) { bang(); };
};

//actually generate a new pitch set
function bang() {
  var new_note_set;
  _ratio_set = _generate_ratio_set();
  new_note_set = _squash_ratio_set_to_midi(_ratio_set);
  _play_notes(new_note_set);
};
function chordnotes(num) {
  _chordnotes = num;
  if (_chordtrig) { bang();};
}
function chordtrig(bool) {
  if (bool) { _chordtrig = true; }
  else { _chordtrig = false; };
}
function notetrig(bool) {
  if (bool) { _notetrig = true; }
  else { _notetrig = false; };
}
function seedtrig(bool) {
  if (bool) { _seedtrig = true; }
  else { _seedtrig = false; };
}
function pause() {
  //transport stopped. halt all hung notes
  for (var note in _held_note_set) {
    _stop_note(note);
  };
}
function play() {
  //transport resumed. retrigger notes?
}
/////// internal logic

function _handle_bag_poking(which_bag, ar) {
  //break bag refernce into pieces:
  var selector = ar[0];
  ar = ar.slice(1);
  if (selector==='weight') {
    _maintain_ratiobag_weights(ar, which_bag);
  } else if (selector==='val') {
    _maintain_ratiobag_val(ar, which_bag);
  } else {
    throw("unknown selector " + selector);
  }
}
function _maintain_basenote(note) {
  _basenote = note;
  _basefreq = _mtof(_basenote);
};

function _maintain_ratiobag_weights(list, bag) {
  bag.weights[list[0]] = list[1];
};

function _maintain_ratiobag_val(list, bag) {
  bag.val[list[0]] = list[1];
};

function _generate_ratio_set() {
  var new_pitch_set = new Array;
  var num_cdf;
  var denom_cdf;
  var num;
  var denom;
  
  num_cdf = _cdf(_numbag.weights);
  denom_cdf = _cdf(_denombag.weights);
  
  if (num_cdf === null || denom_cdf === null) {
    // generate empty note array if our weights are 0
    post("bailed- no weights array");
    post();
    return [];
  }
  for (var i=0; i < _chordnotes; i++) {
    num = _numbag.val[_index_cdf(num_cdf, _rng.random())];
    denom = _denombag.val[_index_cdf(denom_cdf, _rng.random())];
    new_pitch_set.push([num, denom]);
  };
  return new_pitch_set;
};
function _cdf(weights) {
  //produce a normalised cdf of distribution weights
  var cdf = new Array;
  var accum = 0;
  var top;
  for (var i=0; i < bagsize; i++) {
    accum = accum + weights[i];
    cdf[i] = accum;
  }
  top = cdf[bagsize-1];
  if (top<=0) {
    //no weights! to avoid NaNs we return a null, which must be checked for.
    return null;
  } else {
    return cdf.map(function (x) { return x/top ;});
  }
};
function _index_cdf(cdf, f) {
  //If my calculations are correct, this is going to give me the index of the
  //first value greater than the lookup.
  var i;
  for (i=0; cdf[i]<f; i++) { };
  return i;
};
function _squash_ratio_set_to_midi(ratio_set) {
  //convert ratios to MIDI notes. May involve shrinking note list.
  //handling octave wrapping is easy in MIDI domain so we do it here
  var note_set = {};
  var note_list = ratio_set.map(function(xy) {
    var octavise = 0;
    octavise = 12 * _rng.randint(_octaves_down, _octaves_up + 1);
    var candidate_note = _real_modulo(
      Math.floor(_ftom((xy[0]/xy[1]) * _basefreq) + 0.5) - _basenote,
      12
    ) + _basenote + octavise;
    if (candidate_note>127) {
      candidate_note = candidate_note - 12 * Math.ceil((candidate_note-127)/12);
    } else if (candidate_note<0) {
      candidate_note = candidate_note - 12 * Math.floor(candidate_note/12);
    }
    return candidate_note;
  });
  note_list.forEach(function(val, idx) {
    note_set[val] = true;
  });
  return note_set;
};
function _play_notes(new_note_set) {
  var notes_to_stop = [];
  var notes_to_start = [];
  for (var note in new_note_set) {
    if (!_held_note_set.hasOwnProperty(note)) {
      notes_to_start.push(note);
    };
  };
  for (var note in _held_note_set) {
    if (!new_note_set.hasOwnProperty(note)) {
      notes_to_stop.push(note);
    };
  };
  notes_to_start.forEach(_start_note);
  notes_to_stop.forEach(_stop_note);
};

function _start_note(note) {
  //if the given note is not playing already, play it.
  outlet(0, +note, 100);
  _held_note_set[note] = 100;
}
function _stop_note(note) {
  //if the given note is playing, stop it.
  outlet(0, +note, 0);
  delete _held_note_set[note];
}
function _mtof(f) {
  return 440 * Math.exp(0.057762265 * (f - 69));
}
function _ftom(m) {
  return 69 + (1/.057762265) * Math.log(m/440);
}
function _real_modulo(a, b) {
  //cribbed from google closure library
  var r = a % b;
  // If r and b differ in sign, add b to wrap the result to the correct sign.
  return (r * b < 0) ? r + b : r;
};