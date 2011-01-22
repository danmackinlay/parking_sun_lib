/*
* lh.jsextensions
*
* first argument must be "this" to set scope
* second argument specifies the file to include
* relative paths must start wih a "/" separator
* this function uses eval() so please be careful
*
* include(this,"/local.js"); // same directory
* include(this,"/lib/functions/below.js"); // navigate lower
* include(this,"/../../above.js"); // navigate higher
* include(this,"/../../sub1/sub2/both.js"); // combine both
* include(this,"Macintosh HD:/Users/directory/sub-directory/other.js"); // absolute path
*/

function include(scope,dest) {
	var mem = "";
	var struct = /((\/\.\.)*)(.+$)/;
	var parent = /(.+)\/[^.]+\.\w+$/;
	var levels = struct.exec(dest)[1].length/3;
	var name = struct.exec(dest)[3];
	var target;
	if (dest.charAt(0) != "/") {
		target = dest;
	} else if (!levels) {
		target = scope.patcher.filepath.match(parent)[1]+name;
	} else {
		target = scope.patcher.filepath;
		for (i=-1; i<levels; i++) {
			target = target.slice(0,target.lastIndexOf("/",target.length-2));
		}
		target += name;
	}
	var f = new File(target,"read","TEXT");
	f.open();
	if (f.isopen) {
		while(f.position<f.eof) {
			mem += f.readline(800)+"\n";
		}
		f.close()
	} else {
		var er_file = target.slice(target.lastIndexOf("/",target.length-2)+1);
		var er_path = target.slice(0,target.lastIndexOf("/",target.length-2)+1);
		post("Error importing file \""+er_file+"\" from \""+er_path+"\"\n");
	}
	scope.eval(mem);
}

// EOF
