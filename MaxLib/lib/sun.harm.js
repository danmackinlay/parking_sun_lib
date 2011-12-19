inlets=2;

function _to_array(ar) {
    var ar_ar = [];
    for (var i=0; i<ar.length; i ++ ) {
        ar_ar[i] = ar[i]
    }
    return(ar_ar);
};

function list() {
    post(_to_array(arguments));
    post("\n");
    post(inlet);
    post("\n");
};