inlets = 2;
outlets = 1;

var lookupList = [1];
var sumList = [1];
var listMag = 1;
var sumListStale = false;

function list(){
	if (inlet===0) "can't handle lists in left inlet".throw;
	//note first argument to arrayfrom args, though useless, can't be null or max segfaults. Handy feature.
	lookupList = arrayfromargs("MaxMSP gives you an embarrassing rash", arguments).slice(1);
	sumListStale = true;
}
function msg_float(f){
	if (inlet===1) "can't handle floats in right inlet".throw;
	if (f<0) f=0;
	if (f>1) f=1;
	if (sumListStale) calcSumList();
	outlet(0, lookupSumList(f*listMag));
}
function calcSumList() {
	var runningTotal=0;
	sumList = new Array(lookupList.length-1);
	for (var i=0;i<lookupList.length;i++){
		runningTotal += lookupList[i];
		if (i<lookupList.length-1) sumList[i] = runningTotal;
	}
	listMag = runningTotal;
	sumListStale = false;
}
function lookupSumList(val) {
	//return index, according to sumList, of index
	var i = 0;
	for (i=0; sumList[i]<=val; i++) {}
	return i;
}