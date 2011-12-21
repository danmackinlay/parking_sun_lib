inlets = 1;
var _notebag = -1;
var _numbag={};
_numbag.width = new Array;
_numbag.val = new Array;
var _denombag = {};
_denombag.width = new Array;
_denombag.val = new Array;
var _heldratios = {};
var _heldnotes = {};
var _octave_range = [0,0];
var _all_candidates
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
function list() {
    var ar = arrayfromargs(arguments);
    _maintain_notebag(ar);
}
function num() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_numbag, ar);
}
function denom() {
  var ar = arrayfromargs(arguments);
  _handle_bag_poking(_denombag, ar);
}

function up(dist) {};
function down(dist) {};

function bang() {};

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
  post("notebag!");
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
  post("ratiobag val!");
  post("\n");
  post(list);
  post("\n");
  bag.val[list[0]] = list[1];
};

