autowatch = 1;
outlets = 4;

var productid = 2;

var anag = new Array();
var btn = new Array();

var rules = new Array(1,1,1,1,1,1,1,1);
var ctlchange = -1;
var tracknum = -1;
var trackmode = 0;

function loadbang(){
    makemap();
}

function makemap(){
//makes it easier to use the controls if we use the ID, rather than cc#
if(productid == 2){
anag[23] = 0;
anag[22] = 1;
anag[15] = 2;
anag[14] = 3;
anag[5] = 4;
anag[7] = 5;
anag[6] = 6;
anag[4] = 7;
//knobs
anag[17] = 8;
anag[16] = 9;
anag[9] = 10;
anag[8] = 11;
anag[19] = 12;
anag[18] = 13;
anag[11] = 14;
anag[10] = 15;
anag[21] = 16;
anag[20] = 17;
anag[13] = 18;
anag[12] = 19;
}
/*
if(productid == 3){ //block
//knobs
anag[3] = 0;
anag[2] = 1;
anag[1] = 2;
anag[0] = 3;
anag[5] = 4;
anag[4] = 5;
anag[6] = 6;
anag[7] = 7;
//sliders
anag[9] = 8;
anag[8] = 9;
}
*/


if(productid == 3){ //block
//knobs
anag[3] = 8;
anag[2] = 9;
anag[1] = 10;
anag[0] = 11;
anag[5] = 12;
anag[4] = 13;
anag[6] = 14;
anag[7] = 15;
//sliders
anag[9] = 20;
anag[8] = 21;

//fcn buttons
btn[69] = 0;
btn[70] = 1;
btn[66] = 2;
btn[67] = 3;
btn[71] = 4;
btn[64] = 5;
btn[68] = 6;

}

}

function row(v){
    tracknum = v-1;
}

function bang(){
    ctlchange = -1;
    outlet(2,"free");
}

function list(){
    var a = arrayfromargs(arguments);
    var ctlnum = anag[a[0]];
    var cv = a[1];
    
    if(trackmode){
		if(ctlnum < 8){ //sliders, ignore on block
			var val = 1+Math.floor(cv/16);
			rules[ctlnum] = val;
			//post("\nslider",ctlnum,val,rules);
			outlet(0,"rules", rules);
		}
		 if(ctlnum >= 8 && ctlnum <20){ //knobs
			if(ctlnum!=ctlchange){
				outlet(2,"path", "live_set", "tracks", tracknum, "devices", 1, "parameters",ctlnum-7);
			}
			outlet(1,cv);
		}
		if(ctlnum >=20 && ctlnum <22){ //block sliders, set to send
			//path live_set visible_tracks 0 mixer_device sends 0
			outlet(2,"path", "live_set", "tracks", tracknum, "mixer_device ","sends",ctlnum-20);
			outlet(1,cv/127.);
		}
		
	}else{ //globalmode
		//post("\ntest",a,"-",ctlnum,tracknum);
		if(productid==2){ //ohm
			if(ctlnum == tracknum){
				outlet(3,cv/127); //volume
			}
			if(ctlnum>=8 && ctlnum<12){
				if((ctlnum-8) == tracknum){ //bottom left row of knobs, control timing on tracks 1-4
					outlet(0,"curve",cv); //curve
				}
			}
			if(ctlnum>=12 && ctlnum<16){
				if((ctlnum-12) == tracknum){ //bottom left row of knobs, control timing on tracks 1-4
					outlet(0,"random",cv); //random
				}
			}
			if(ctlnum>=16 && ctlnum<20){
				if((ctlnum-16) == tracknum){ //bottom left row of knobs, control timing on tracks 1-4
					var timing = Math.floor(cv/8.5); 
					outlet(0,"timing",timing); //timing
				}
			}
		}
		if(productid==3){ //block
			if((ctlnum-8) == tracknum){
				outlet(3,cv/127); //volume
			}
		}
	}
    ctlchange = ctlnum;
}

function product(v){
    productid = v;
    makemap();
}

function mode(v){ //global = 0,track = 1
	trackmode = v;
}