var inlets = 2;
var autowatch = 1;
var pitch_bag = [];
var loudness_bag = [];
var numerator_bag = [];
var denominator_bag = [];
var ratio_bag = [];
var max_bag_size = 5;

function bang() {
  outlet(0, get_elem(pitch_bag));
}

function list(a) {
  switch (inlet) {
    case 1:
      capture_pitch(arguments);
      break;
  }
}

function capture_pitch (cooked) {
  var pitch = cooked[0];
  var freq = cooked[1];
  var loudness = cooked[2];
  pitch_bag.push(pitch);
  while (pitch_bag.length>max_bag_size) {
    pitch_bag.shift();
  }
}

function get_elem(lst) {
  var lgth = lst.length;
  if (lgth) {
    return lst[Math.floor(Math.random()*lgth)];
  }
}
