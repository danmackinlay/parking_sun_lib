inlets = 2;
outlets = 2;
autowatch = 1;

var api;

// actual work done here
function anything(){
	var method, args, resp;
	if (inlet!==0) {return;};
	method = messagename;
	args = arrayfromargs(arguments);
	post(method, args, "\n");
	if (args.length>0) {
		try{
			resp = api[method].apply(api, args);
			outlet(0, resp);
		} catch(err) {
			outlet(1, err.message);
		}	
	} else {
		resp = api[method];
		outlet(0, resp);
	};
}

//the next 3 functions are  to work around Max's half-baked init schemes
function bang(){
	if (inlet!==1) {return;};
	init();
}

function init(){
	post("inited");
	api = new LiveAPI();
}

function save() {
    embedmessage("init");
}
