/*
assumes that default notes have been converted into IDs 
(e.g. press button 13, and this expects to see "12")
*/

autowatch = 1;
var productid = 2;
var dir = 0; //forward
var dirmax = 3; //#items in direction menu
var rownum = -1;
var enable = 1;
var assigning = 0;
var assigncount = 0;
var blinkthis = 0;

//ohm uses 1-64 buttons, block uses 1-56, with the bottom row acting as the "slider" buttons on the ohm64
var maxgrid = 64; 
var idoffset = 66; //for detection of slider button  on ohm vs. bottom row of grid on block

function list(){ //ID and velocity
    var a = arrayfromargs(arguments);
    var id = a[0];
    var veloc = a[1];
    if(enable){
        if(veloc>0 && id<maxgrid){ //note on from grid
            var x = Math.floor(id%8);
            var y = Math.floor(id/8);
            var muteval = x+1;
            //post("\n?",x,y,muteval,rownum);
           if(y==rownum) outlet(0,"script","send","mute["+muteval+"]","bang");
        }
    }
        
    if(id>maxgrid){ //look for slider buttons to toggle "Assign"
        //post("\nsbtns",id,rownum,id-idoffset);
        if((id-idoffset)==rownum){ //"66" is id of slider button 1, "rownum" starts at 0
            if(a[1]) {
                assigning = 1-assigning;
                outlet(0,"script","send","assign",assigning);
                outlet(0,"script","send","listen",assigning);
                assigncount = 0;
                blinkthis = id; //for a routine to blink the led
                if(assigning==0) {
                    blinkthis = 0;
                    outlet(0,"script","send","blink",blinkthis);
                }
                //post("\nassigning",assigning,blinkthis);            
            }else{
                //outlet(0,"script","send","assign",0);
            }
        }
    }

    //grid notes while assigning: first note is learned, 2nd note is the step to assign which will turn assigning off and assign the learned note to selected step
    if(veloc==0 && id<maxgrid && assigning){ 
        //post("\nassign",id,veloc);
        //outlet(0,"script","send","assign",0);
        //var learned = id;
        outlet(0,"script","send","listen",0); //note is learned
        outlet(0,"script","send","blink",blinkthis); //start blink
        assigncount++;
        if(assigncount==2){
            var x = Math.floor(id%8);
            var y = Math.floor(id/8);
            var thestep = x+1;
            if(y==rownum) outlet(0,"script","send","step",thestep);
            outlet(0,"script","send","assign",0);
            assigning = 0;
            assigncount = 0;
            blinkthis = 0;
            outlet(0,"script","send","blink",blinkthis); //start blink
        }
    }

    //post("\nfbtn",id,veloc>0 , (id>73 && id<80) , assigning);
    //F-buttons while in Track Mode
    if(veloc>0 && (id>73 && id<80) && assigning){ 
        
        switch(id){
        case 74: //f4
        outlet(0,"script","send","shifts","up");
        break;
        
        case 77: //f1
        outlet(0,"script","send","shifts","down");
        break;
        
        case 78: //f2
        outlet(0,"script","send","shifts","left");
        break;
        
        case 79: //f3
        outlet(0,"script","send","shifts","right");
        break;
        
        case 75: //f5
        dir++;
        if(dir>dirmax) dir = 0;
        outlet(0,"script","send","style",dir);
        break;
        }
    }
}

function msg_int(v){
    enable = v;
}

function row(v){
    rownum = v-1;
}

function product(v){
    productid = v;
    if(productid==2){
        maxgrid = 64; 
        idoffset = 66; 
    }
    if(productid==3){
        maxgrid = 55; 
        idoffset = 56; 
    }
    //post ("\nproduct",productid,maxgrid,idoffset);
}