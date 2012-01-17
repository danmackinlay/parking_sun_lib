/* 
Live loop-point wrangling for Live, a la certain Spative Spinstruments
products.

TODO:

* (optionally?) reset previous loop point state upon the playing clip being
  changed.
* remember all loop points for all clips
* ...and persist across sessions?
* support Track method jump_in_running_session_clip
* check that clip is either warped or midi
* create a function to set clip params then check that the setting "took" by
  getting them again. This should catch, e.g. illegal loop points, or whatever
  it is that explodes the loop.
* When looping, either or both of _looplen and _looppos need to be set in teh
  UI to allow cause the loop to be in a nice place relative to the play
  cursor.
* UI can be set with a delay using Task constructor arguemnts - see
  https://github.com/rec/swirly/blob/master/js/test_tasker.js
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
var _looplen = 8;
var _hiddenlen = 8;
var _looppos = 0;
var _looping = false;
var _looplentask = new Task(function(){}, this);
var _hiddenlentask = new Task(function(){}, this);
var _looppostask = new Task(function(){}, this);

/*
This rigmarole makes sure that this JS plays nicely with both autowatch and
the LiveAPI, by having it output a bang shortly after it wakes. This can be
used to cause the object to initialise itself.

Some kind of flag setting on a Global might do the trick too. But whatever.
*/

var delayed_start = new Task(function () {outlet(0, "alive", "bang")}, this);
delayed_start.interval = 50;
delayed_start.execute();

function bang() {
  inited = true;
  init();
};
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
};
function loop(state) {
  var here;
  var active;
  var offset = 0;
  if (inited===false) {post("loop called before init"); return ;};
  active = init();
  if (active===false) {post("failed to find playing loop."); return ;};
  here = current_clip.get("playing_position");
  post("LOOPERIZING");
  post();
  current_clip.set('looping', state);
  //TODO: get global quantization for this calc
  if (state==1) {
    notional_end = Math.floor(here)+1;
    notional_start = notional_end - _hiddenlen;
    if (notional_start<0) {
      offset = Math.ceil(-notional_start/4)*4;
    }
    notional_start = notional_start + offset;
    notional_end = notional_end + offset;
  
    post(here, offset, notional_start, notional_end);
    post();
  };
  _display_loop(state);
  _update_loop();
  post();
};
function looplen(val) {
  _looplen = Math.min(val, _hiddenlen);
  if (val>_looplen) {_update_looplen_ui(val);};
  _update_loop();
};
function _update_looplen_ui(val) {
  if (_looplen !== val) {
    if (hasOwnProperty(_looplentask, 'cancel')) {
      _looplentask.cancel();
    }
    _looplentask = new Task(
      function(v) {
        outlet(0, "set", "looplen", v);
      }, this, val).schedule(100);
  };
}
function hiddenlen(val) {
  _hiddenlen = val;
  //Arse - this will double-call _update_loop. Need a controller here.
  looplen(Math.min(val, _looplen));
  _update_loop();
};
function looppos(val) {
  _looppos = val;
  _update_loop();
};
function _update_loop() {
  var actual_loop_start;
  var actual_loop_end;
  
  if (inited===false) {post("_update_loop called before init"); return ;};
  if (_looping===0) {post("_update_loop called when not looping"); return ;};
  
  actual_loop_start = Math.floor(
    ((_hiddenlen - _looplen) * _looppos + notional_start)
     * 4 + 0.5)/4;
  actual_loop_end = actual_loop_start + _looplen;
  post("CLIP PARTY");
  post("notional_start", notional_start, "notional_end", notional_end);
  post( "_looppos", _looppos, "_looplen", _looplen, "actual_loop_start", actual_loop_start, "actual_loop_end", actual_loop_end);
  post();
  
  post(current_clip.set('loop_start', actual_loop_start));
  post(current_clip.set('loop_end', actual_loop_end));
  post();
};
function _display_loop(state) {
  _looping = state;
  outlet(0, "loop", "set", state);
};

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