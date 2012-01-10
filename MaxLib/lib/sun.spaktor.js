var api;

function bang() {
  //init
  api = new LiveAPI();
  api.path = "this_device";
  post("I am", api.id, api.info);
  post();
  post("My parent", api.get("canonical_parent"));
  post();
  api.goto("this_device canonical_parent");
  post("My parent2", api.id, api.info);
  post();
}

// function 