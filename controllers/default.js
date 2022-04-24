exports.install = function () {
  ROUTE("GET /", view_index);
};

async function view_index() {
  var actualities = await NOSQL("actualities").find().promise();
  this.view("index", actualities);
}
