var express = require("express");

var app = express();


const  PORT = "port";

app.use(express.static(__dirname + "/auth"));

app.set(PORT, process.argv[2] || process.env.APP_PORT || 3000);

app.listen(app.get(PORT) , function(){
    console.info("App Server started on " + app.get(PORT));
});