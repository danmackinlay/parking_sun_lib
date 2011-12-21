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
  return this.seed_ * PseudoRandom.ONE_OVER_M;
};


//////// Max Initialisation

inlets = 1;


//////// Initialise JS state
var _notebag = -1;
var _numbag={};
_numbag.width = new Array;
_numbag.val = new Array;
var _denombag = {};
_denombag.width = new Array;
_denombag.val = new Array;
var _rng = new PseudoRandom();
var _chordnotes = 0;
var _heldratios = {};
var _heldnotes = {};
var _octave_range = [0,0];
var _all_candidates;


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
function list() {
    var ar = arrayfromargs(arguments);
    _maintain_notebag(ar);
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
  _generate_pitch_set();
};
function chordnotes(num) {
  _chordnotes = num;
}

/////// internal logic

function _handle_bag_poking(which_bag, ar) {
  //break bag refernce into pieces:
  var selector = ar[0];
  ar = ar.slice(1);
  if (selector==='width') {
    _maintain_ratiobag_width(ar, _numbag);
    _maintain_ratiobag_width(ar, _denombag);
  } else if (selector==='val') {
    _maintain_ratiobag_val(ar, _numbag);
    _maintain_ratiobag_val(ar, _denombag);
  } else {
    throw("unknown selector " + selector);
  }
}
function _maintain_notebag(list) {
  //At the moment, this is not a bag, but a single root note.
  if (list[1]>0) {
    _notebag = list[0];
  } else if (list[0] === _notebag) {
    _notebag = -1;
  };
};

function _maintain_ratiobag_width(list, bag) {
  bag.width[list[0]] = list[1];
};

function _maintain_ratiobag_val(list, bag) {
  bag.val[list[0]] = list[1];
};

function _generate_pitch_set () {
  
};

