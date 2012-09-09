inlets = 1;
outlets = 4;

var PROPS = ["name", "active", "min", "max", "def", "value"];
var DEACTIVE_PARAMS = ["Device On"]
var randomizer;

// global functions /////////////////

//function loadbang(){this.autowatch = 1;}

function init(){
    if(randomizer != undefined){randomizer.dispose();}
    randomizer = new DeviceRandomizer();
    outlet(3, "bang");
}

function set_data(arg){
    if(randomizer != undefined){
        if(randomizer.ignore_set_data){randomizer.ignore_set_data = false;return;}
        try{
            randomizer.set_data(eval(arg));
        }catch(e){}
    }
}

function set_target_device(idx){
    randomizer.set_target_device(idx);
    randomizer.save();
}

function minimize(){
    randomizer.minimize();
}

function maximize(){
    randomizer.maximize();
}

function defaultize(){
    randomizer.defaultize();
}

function randomize(){
    randomizer.randomize();
}

function set_min(){
    randomizer.set_min();
    randomizer.save();
}

function set_max(){
    randomizer.set_max();
    randomizer.save();
}

function set_def(){
    randomizer.set_def();
    randomizer.save();
}

function clear(){
    randomizer.clear();
    randomizer.save();
}

function select_cell(col, row, val){
    if(col == PROPS.indexOf("active")){
        if(randomizer.target_device == undefined){return;}
        randomizer.target_device.params[row].toggle_active();
        randomizer.save();
    }
}

// class definition //////////////

/* DeviceRandomizer */

var DeviceRandomizer = function(){
    this.ui            = new UIManager(this);
    this.device_api    = api("this_device");
    this.track_api     = api(this.device_api, "canonical_parent", devices_observer, "devices");
    this.devices       = undefined;
    this.target_device = undefined;
    
    this.init_devices();
    this.ui.init_params_cellblock();
    this.set_target_device(0);
}
DeviceRandomizer.prototype = {
    init_devices: function(){
        this.devices = Array();
        for(var i = 0;i < this.track_api.getcount("devices");i++){
            var di = new Device(this.track_api.path + " devices " + i)
            if(di.id != this.device_api.id){
                this.devices.push(di);
            }
        }
        this.ui.update_devices_umenu(this.selected_device_index());
    },
    update_devices: function(ids){
        var save_flg = false;
        var new_devices = Array();
        for each(var id in ids){
            if(id == this.device_api.id){continue;}
            var device = undefined;
            for each(var d in this.devices){
                if(d.id == id){device = d;}
            }
            if(device == undefined){device = new Device(id);save_flg = true;}
            new_devices.push(device);
        }
        for each(var d in this.devices){
            var device = undefined;
            for each(var nd in new_devices){
                if(d.id == nd.id){device = d;}
            }
            if(device == undefined){d.dispose();save_flg = true;}
        }
        this.devices = new_devices;
        var index = this.selected_device_index();
        if(index == undefined){
            this.set_target_device(0);
        }
        this.ui.update_devices_umenu(this.selected_device_index());
        if(save_flg){this.save();}
    },
    set_target_device: function(idx){
        this.target_device = this.devices[idx];
        this.ui.update_params_cellblock();
    },
    selected_device_index: function(){
        if(this.target_device == undefined){return undefined}
        for(var i = 0;i < this.devices.length;i++){
            if(this.devices[i].id == this.target_device.id){return i;}
        }
        return undefined;
    },
    minimize: function(){
        if(this.target_device == undefined){return;}
        this.target_device.minimize_params();
    },
    maximize: function(){
        if(this.target_device == undefined){return;}
        this.target_device.maximize_params();
    },
    defaultize: function(){
        if(this.target_device == undefined){return;}
        this.target_device.defaultize_params();
    },
    randomize: function(){
        if(this.target_device == undefined){return;}
        this.target_device.randomize_params();
    },
    set_min: function(){
        if(this.target_device == undefined){return;}
        this.target_device.set_min();
    },
    set_max: function(){
        if(this.target_device == undefined){return;}
        this.target_device.set_max();
    },
    set_def: function(){
        if(this.target_device == undefined){return;}
        this.target_device.set_def();
    },
    clear: function(){
        if(this.target_device == undefined){return;}
        this.target_device.clear();
    },
    dispose: function(){
        this.track_api.property = undefined;
        for each(var device in this.devices){device.dispose();}
    },
    to_data: function(){
        var devices_data = Array();
        for each(var device in this.devices){devices_data.push(device.to_data());}
        return [this.selected_device_index(), devices_data];
    },
    set_data: function(data){
        if(data == undefined){return;}
        var devices_data = data[1];
        if(devices_data != undefined){
            for(var i = 0;i < this.devices.length;i++){
                this.devices[i].set_data(devices_data[i]);
            }
        }
        var selected_device_index = data[0];
        if(selected_device_index != undefined){
            this.set_target_device(selected_device_index);
            this.ui.update_devices_umenu(this.selected_device_index());
        }
    },
    save: function(){
        this.ignore_set_data = true;
        outlet(3, randomizer.to_data().toSource());
    }
}

devices_observer.local = 1;
function devices_observer(args){
    if(args[0] != "devices"){return;}
    randomizer.update_devices(select_num_from_array(args));
}

/* Device */

var Device = function(path){
    this.device_api = api(path, device_name_observer, "name");
    this.id         = this.device_api.id;
    this.path       = this.device_api.path;
    this.name       = this.device_api.get("name");
    this.params     = Array();
    for(var i = 0;i < this.device_api.getcount("parameters");i++){
        this.params.push(new DeviceParam(this.device_api.path + " parameters " + i, i));
    }
}
Device.prototype = {
    onchange_name: function(name){
        this.name = name;
        randomizer.ui.update_devices_umenu(randomizer.selected_device_index());
    },
    minimize_params: function(){
        for each(var param in this.params){param.minimize();}
    },
    maximize_params: function(){
        for each(var param in this.params){param.maximize();}
    },
    defaultize_params: function(){
        for each(var param in this.params){param.defaultize();}
    },
    randomize_params: function(){
        for each(var param in this.params){param.randomize();}
    },
    set_min: function(){
        for each(var param in this.params){param.set_min();}
    },
    set_max: function(){
        for each(var param in this.params){param.set_max();}
    },
    set_def: function(){
        for each(var param in this.params){param.set_def();}
    },
    clear: function(){
        for each(var param in this.params){param.clear();}
    },
    dispose: function(){
        for each(var param in this.params){param.dispose();}
    },
    to_data: function(){
        var params_data = Array();
        for each(var param in this.params){params_data.push(param.to_data());}
        return [params_data]
    },
    set_data: function(data){
        if(data == undefined){return;}
        var params_data = data[0];
        if(params_data != undefined){
            for(var i = 0;i < this.params.length;i++){
                this.params[i].set_data(params_data[i]);
            }
        }
    }
}

device_name_observer.local = 1;
function device_name_observer(args){
    if(randomizer != undefined && args[0] != "name"){return;}
    for each(var device in randomizer.devices){
        if(device.id == this.id){
            device.onchange_name(args[1]);
            return;
        }
    }
}

/* DeviceParam */

var DeviceParam = function(path, idx){
    this.param_api = api(path, param_observer, "value");
    this.index     = idx;
    this.id        = this.param_api.id;
    this.path      = this.param_api.path;
    this.name      = this.param_api.get("name");
    this.min       = this.param_api.get("min");
    this.max       = this.param_api.get("max");
    this.def       = this.param_api.get("default_value");
    this.quantized = this.param_api.get("is_quantized");
    this.value     = this.param_api.get("value");
    this.name      = this.param_api.get("name");
    this.active    = DEACTIVE_PARAMS.indexOf(String(this.name)) == -1 ? "ON" : "OFF";
}
DeviceParam.prototype = {
    onchange_value: function(value){
        this.value = value;
        if(randomizer.target_device != undefined && randomizer.target_device.id == api(this.param_api, "canonical_parent").id){
            randomizer.ui.update_param_cell(this, "value");
        }
    },
    toggle_active: function(){
        this.active = this.active == "ON" ? "OFF" : "ON";
        randomizer.ui.update_param_cell(this, "active");
    },
    minimize: function(){
        if(this.active != "ON"){return;}
        this.param_api.set("value", this.min);
    },
    maximize: function(){
        if(this.active != "ON"){return;}
        this.param_api.set("value", this.max);
    },
    defaultize: function(){
        if(this.active != "ON"){return;}
        this.param_api.set("value", this.def);
    },
    randomize: function(){
        if(this.active != "ON"){return;}
        if(this.min == this.max){return;}
        this.param_api.set("value", this.gen_value());
    },
    set_min: function(){
        this.min = this.value;
        randomizer.ui.update_param_cell(this, "min");
    },
    set_max: function(){
        this.max = this.value;
        randomizer.ui.update_param_cell(this, "max");
    },
    set_def: function(){
        this.def = this.value;
        randomizer.ui.update_param_cell(this, "def");
    },
    clear: function(){
        this.min = this.param_api.get("min");
        this.max = this.param_api.get("max");
        this.def = this.param_api.get("default_value");
        randomizer.ui.update_param_cell(this, "min");
        randomizer.ui.update_param_cell(this, "max");
        randomizer.ui.update_param_cell(this, "def");
    },
    gen_value: function(){
        var min = this.min;
        var max = this.max;
        if(min > max){
            min = this.max;
            max = this.min;
        }
        var v = Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min);
        if(this.quantized == 1){
            v = Math.round(v);
        }else{
            v = Math.round(v * 100) / 100;
        }
        return v;
    },
    dispose: function(){
        this.param_api.property = undefined;
    },
    to_data: function(){
        return [this.min, this.max, this.def, this.active == "ON" ? 1 : 0];
    },
    set_data: function(data){
        if(data == undefined){return;}
        if(data != undefined){
            this.min = data[0];
            this.max = data[1];
            this.def = data[2];
            this.active = data[3] == 1 ? "ON" : "OFF";
            if(randomizer.target_device != undefined && randomizer.target_device.id == api(this.param_api, "canonical_parent").id){
                randomizer.ui.update_param_cell(this, "active");
            }
        }
    }
}
param_observer.local = 1;
function param_observer(args){
    if(randomizer != undefined && args[0] != "value"){return;}
    for each(var device in randomizer.devices){
        for each(var param in device.params){
            if(param.id == this.id){
                param.onchange_value(args[1]);
                return;
            }
        }
    }
}

/* UIManager */

var UIManager = function(randomizer){
    this.randomizer = randomizer;
}
UIManager.prototype = {
    update_devices_umenu: function(index){
        outlet(0, "clear");
        for each(var info in this.randomizer.devices){outlet(0, "append", info.name);}
        if(index != undefined){outlet(0, "set", index);}
    },
    init_params_cellblock: function(){
        outlet(1, "clear", "all");
        outlet(1, "fontsize", 9);
        outlet(1, "cols", PROPS.length);
        outlet(1, "rows", 0);
        outlet(1, "rowhead", 0);
        outlet(1, "colhead", 0);
        outlet(1, "vscroll", 1);
        outlet(1, "hscroll", 0);
        outlet(1, "rowheight", 13);
        outlet(1, "colwidth", 50);
        outlet(1, "just", 2);
        outlet(1, "col", 0, "just", 0);
        outlet(1, "col", 0, "width", 80);
        this.init_header_cellblock();
    },
    init_header_cellblock: function(){
        outlet(2, "selmode", 0);
        outlet(2, "clear", "all");
        outlet(2, "fontsize", 9);
        outlet(2, "cols", PROPS.length);
        outlet(2, "rows", 1);
        outlet(2, "rowhead", 0);
        outlet(2, "colhead", 1);
        outlet(2, "vscroll", 0);
        outlet(2, "hscroll", 0);
        outlet(2, "rowheight", 13);
        outlet(2, "colwidth", 50);
        outlet(2, "just", 1);
        outlet(2, "col", 0, "width", 80);
        for(var i = 0;i < PROPS.length;i++){
            outlet(2, "set", i, 0, PROPS[i]);
        }
    },
    update_params_cellblock: function(){
        var params = this.randomizer.target_device == undefined ? Array() : this.randomizer.target_device.params;
        outlet(1, "clear", "all");
        outlet(1, "rows", params.length);
        for(var i = 0;i < params.length;i++){
            for(var j = 0;j < PROPS.length;j++){
                this.update_param_cell(params[i], PROPS[j]);
            }
        }
    },
    update_param_cell: function(param, prop){
        var value = param[prop];
        outlet(1, "set", PROPS.indexOf(prop), param.index, value);
        if(prop == "active"){
            outlet(1, "cell", PROPS.indexOf(prop), param.index, "frgb", value == "ON" ? [67, 54, 254] : [254, 67, 54]);
        }
    }
}

// utility functions //////////

function select_num_from_array(arr){
    var ret = Array();
    for(var i = 0;i < arr.length;i++){
        if(String(arr[i]).match(/^\d+$/)){ret.push(arr[i]);}
    }
    return ret;
}

api.local = 1;
function api(){
    var path = "";
    for(var i = 0;i < api.arguments.length;i++){
        var e = api.arguments[i];
        if(e instanceof Function){
            var callback = e;
            var property = api.arguments[i + 1];
            break;
        }else{
            path += e.path == undefined ? e : e.path;
            if(i + 1 != api.arguments.length){path += " ";}
        }
    }
    path = path.replace(/"/g, '');
    if(path.match(/^[\s\d]+$/)){
        path = "id " + path;
    }
    if(callback){
        var ret = new LiveAPI(callback, path);
        ret.property = property;
    }else{
        var ret = new LiveAPI(null, path);
    }
    return ret;
}

p.local = 1;
function p(){
    for(var i = 0;i < p.arguments.length;i++){post(p.arguments[i]);}
    post();
}
