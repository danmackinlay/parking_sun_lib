//////////////// Library functions
/////// PRNG
// Based on PseudoRandom, by Google. Apache License 2.0
var PseudoRandom = function(opt_seed) {
  this.seed_ = opt_seed ||
               PseudoRandom.seedUniquifier_ + Date.now();
};
PseudoRandom.seedUniquifier_ = 0;
PseudoRandom.A = 48271;
PseudoRandom.M = 2147483647;
PseudoRandom.Q = 44488;
PseudoRandom.R = 3399;
PseudoRandom.ONE_OVER_M = 1.0 / PseudoRandom.M;
PseudoRandom.prototype.random = function() {
  var hi = this.seed_ / PseudoRandom.Q;
  var lo = this.seed_ % PseudoRandom.Q;
  var test = PseudoRandom.A * lo -
             PseudoRandom.R * hi;
             
  if (test > 0) {
    this.seed_ = test;
  } else {
    this.seed_ = test + PseudoRandom.M;
  }
  // % stops foolishness with shoddy RNG overflows
  return (this.seed_ * PseudoRandom.ONE_OVER_M) % 1.0;
};


//////// Max Initialisation
inlets = 1;


//////// Initialise JS state
var _basenote = 69;
var _basefreq = 440;
var _numbag = {};
_numbag.width = new Array;
_numbag.val = new Array;
var _denombag = {};
_denombag.width = new Array;
_denombag.val = new Array;
var _rng = new PseudoRandom();
var _chordnotes = 0;
var _ratio_set = [];
var _held_note_set = [];
var _octave_range = [0,0];
var _all_candidates;
var _notetrig = true;
var _chordtrig = false;

//we choose a bag size so we can set default contents
var bagsize = 3;
if (jsarguments.length >=2) {
  bagsize = jsarguments[1];
}

for (var i=0; i < bagsize; i++) {
  _numbag.width[i] = 0;
  _numbag.val[i] = 1;
  _denombag.width[i] = 0;
  _denombag.val[i] = 1;
}

/////// handling messages
// number lists are presumed to be MIDI notes
function base(note) {
  _maintain_basenote(note);
  if (_notetrig) { bang();};
}
// numerator val or width lists
function num() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_numbag, ar);
}
// denominator val or width lists
function denom() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_denombag, ar);
}
// scale ranges
function up(dist) {};
function down(dist) {};
//PRNG seeding
function seed(seed) {
  _rng.seed_ = seed;
  //first result after reseed is rubbish.
  _rng.random();
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

/////// internal logic

function _handle_bag_poking(which_bag, ar) {
  //break bag refernce into pieces:
  var selector = ar[0];
  ar = ar.slice(1);
  if (selector==='width') {
    _maintain_ratiobag_width(ar, which_bag);
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

function _maintain_ratiobag_width(list, bag) {
  bag.width[list[0]] = list[1];
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
  
  num_cdf = _cdf(_numbag.width);
  denom_cdf = _cdf(_denombag.width);
  
  if (num_cdf === null || denom_cdf === null) {
    // generate empty note array if our weights are 0
    post("exploded- no width array");
    post();
    return [];
  }
  for (var i=0; i < _chordnotes; i++) {
    num = _numbag.val[_index_cdf(num_cdf, _rng.random())];
    denom = _numbag.val[_index_cdf(denom_cdf, _rng.random())];
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
  var note_set = {};
  var note_list = ratio_set.map(function(xy) {
    return Math.floor(_ftom((xy[0]/xy[1]) * _basefreq) + 0.5);
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
  post("play", note);
  outlet(0, [note, 64]);
  _held_note_set[note] = true;
}
function _stop_note(note) {
  //if the given note is playing, stop it.
  post("stop", note);
  outlet(0, [note, 0]);
  delete _held_note_set[note];
}
function _mtof(f) {
  return 440 * Math.exp(0.057762265 * (f - 69));
}
function _ftom(m) {
  return 69 + (1/.057762265) * Math.log(m/440);
}