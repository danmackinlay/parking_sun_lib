var api;

function bang() {
  //init
  api = new LiveAPI();
  api.path = "this_device";
  post("I am", api.id, api.info);
  post();
}

// function 