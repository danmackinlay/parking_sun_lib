var inlets = 2;
var outlets = 2;
var autowatch = 1;
var freq_bag = [];
var loudness_bag = [];
var numerator_bag = [];
var denominator_bag = [];
var ratio_bag = [];
var max_bag_size = 5;

function bang() {
  outlet(0, get_elem(loudness_bag));
  outlet(0, get_elem(freq_bag));
}

function list(a) {
  switch (inlet) {
    case 1:
      capture_pitch(arguments);
      break;
  }
}

function capture_pitch (cooked) {
  var freq = cooked[0];
  var loudness = 100. + (cooked[1])*1.27; // convert loudness to velocity
  freq_bag.push(freq);
  loudness_bag.push(loudness);
  while (freq_bag.length>max_bag_size) {
    freq_bag.shift();
    loudness_bag.shift();
  }
}

function get_elem(lst) {
  var lgth = lst.length;
  if (lgth) {
    return lst[Math.floor(Math.random()*lgth)];
  }
}
