/* 
Live loop-point wrangling for Live, a la certain Spative Spinstruments
products.

TODO:

* (optionally?) reset previous loop point state upon the playing clip being
  changed.
* remember all loop points for all clips
* ...and persist across sessions?
* support Track method jump_in_running_session_clip
* check that clip is either armed or midi

*/
var track;
var track_id;
var track_path;
var current_clip;
var current_clip_slot_path;
var current_clip_slot;
var clip_meta = {};
var notional_start = 0;
var notional_end = 16;
var inited = false;
var _looplen = 16;
var _looppos = 0;
var looping = false;

/*
This rigmarole makes sure that this JS plays nicely with both autowatch and
the LiveAPI, by having it output a bang shortly after it wakes. this can be
used to cause the object to initialise itself.

Some kind of flag setting on a Global might do the trick too. But whatever.
*/

var delayed_start = new Task(function () {outlet(0, "alive", "bang")}, this);
delayed_start.interval = 50;
delayed_start.execute();

function bang() {
  inited = true;
  init();
}
function init() {
  /* set up liveapi to point at the correct clip etc.
  return false if this fails (e.g. because there is nothing playing), else
  return true.
  */
  var playing_idx;
  var playing_id;
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
  if (playing_idx < 0) {
    post("no clip playing!");
    _display_loop(0);
    return false;
  }
  
  // check out this indexing bullshit: every second entry in the array is the
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
  return true;
}
function loop(state) {
  var here;
  var active;
  if (inited===false) {post("loop called before init"); return ;};
  active = init();
  if (active===false) {post("failed to find playing loop."); return ;};
  here = current_clip.get("playing_position");
  current_clip.set('looping', state);
  //TODO: get global quantization for this calc
  notional_end = Math.floor(here)+1;
  notional_start = notional_end - looplen;
  _display_loop(state);
  _update_loop();
  post();
}
function looplen(val) {
  //could this be handled more gracefully? w/ two loop len vars?
  _looplen = Math.max(Math.floor(val*4 + 0.5)/4, notional_end-notional_start);
  _update_loop();
}
function looppos(val) {
  _looppos = val;
  _update_loop();
}
function _update_loop() {
  var notional_loop_len = notional_end - notional_start;
  var actual_loop_start = Math.floor(
    ((notional_loop_len - _looplen) * _looppos + actual_loop_start)
     * 4 + 0.5);
  var actual_loop_end = actual_loop_start + _looplen;
  if (inited===false) {post("_update_loop called before init"); return ;};
  
  current_clip.set("loop_start", actual_loop_start);
  current_clip.set("loop_end", actual_loop_end);
};
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