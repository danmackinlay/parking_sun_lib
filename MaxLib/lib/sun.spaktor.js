/* 
Live loop-point wrangling for Live, a la certain Spative Spinstruments
products.

TODO:

* (optionally?) reset previous loop point state upon the playing clip being
  changed.
* remember all loop points for all clips
* ...and persist across sessions?

*/
var track;
var track_id;
var track_path;
var current_clip;
var current_clip_slot_path;
var current_clip_slot;
var clip_meta = {};

function bang() {
  init();
}
function init() {
  var playing_idx;
  var playing_id;
  //init
  track = new LiveAPI(null, "this_device canonical_parent");
  track_id = track.id;
  // look at this stupidity: LiveAPI.path returns a string with *embedded
  // quotes*. I can't believe the world can continue under such a burden of
  // dumb.
  track_path = track.path.slice(1,-1);
  post("track", track_path, track_id);
  post();
  
  // playing_slot_index, fire_slot_index
  playing_idx = track.get("playing_slot_index");
  
  // check out this indexing bullshit - every second entry in the array is the
  // string "id". FFS.
  playing_id = track.get('clip_slots')[playing_idx*2+1];
  post("clipsy", "IDX", playing_idx, "ID", playing_id, "type", typeof(playing_id));
  post();
  current_clip_slot_path = track.path.slice(1,-1) + " clip_slots "+ track.id;
  current_clip_slot = new LiveAPI(null, current_clip_slot_path);
  current_clip = new LiveAPI(null, current_clip_slot_path+ " clip");
  post("trackb", current_clip.id, current_clip.type);
  post("CLIP", "length", current_clip.get("length"), "loop_start", current_clip.get("loop_start"), "loop_end", current_clip.get("loop_end"), "playing_position", current_clip.get("playing_position"));
  post();
  _display_loop(current_clip.get('looping'));
}
function loop(state) {
  init();
  current_clip.set('looping', state);
  _display_loop(state);
  post();
}
function _display_loop(state) {
  outlet(0, "loop", "set", state);
}

//Clip members
/*
js: property is_audio_clip bool
js: property is_midi_clip bool
js: property is_playing bool
js: property is_recording bool
js: property is_triggered bool
js: property length float
js: property loop_end float
js: property loop_start float
js: property looping bool
js: property muted bool
js: property name unicode
js: property pitch_coarse int
js: property pitch_fine float
js: property playing_position float
js: property signature_denominator int
js: property signature_numerator int
js: property warping bool
js: property will_record_on_start bool
js: function deselect_all_notes
js: function fire
js: function get_selected_notes
js: function move_playing_pos
js: function replace_selected_notes
js: function select_all_notes
js: function set_fire_button_state
js: function stop
*/