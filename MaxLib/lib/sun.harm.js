inlets=2;
var _notebag = {};

function _to_array(ar) {
    var ar_ar = [];
    for (var i=0; i<ar.length; i ++ ) {
        ar_ar[i] = ar[i]
    }
    return(ar_ar);
};

function list() {
    var ar = _to_array(arguments);
    if (inlet===0) {
      _maintain_notebag(ar);
    } // else if (inlet===1) {
     //      _choose_note(ar);
     //    } else if (inlet===1) {
     //      _reset_seed(ar);
     //    }
};

function _maintain_notebag(list) {
  post("notebag!");
  post("\n");
  post(list);
  post("\n");
};