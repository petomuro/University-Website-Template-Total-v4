exports.install = function () {
    ROUTE("GET /", view_index);
};

async function view_index() {
    var about = await NOSQL("about").find().promise();
    var trailers = await NOSQL("trailers").find().promise();
    var actualities = await NOSQL("actualities").find().promise();

    this.view("index", [about, trailers, actualities]);
}
