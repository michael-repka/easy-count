var http = require('http'),
    httpProxy = require('http-proxy'),
    mongoDB = require('./app/services/db.js');

//DB connect

var db = mongoDB.connect("thunderblink","thunder123123","localhost","27017","thunderblink",["users"]);
var result = "";
db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
    if( err || !saved ) {
        console.log("User not saved");
        result = "Not Saved!"
    }
    else {
        console.log("User saved");
        result = "Saved!"
    }
});
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({target:'http://thunderblink.local:9000'}).listen(8000);

//
// Create your target server
//
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('result is '+result+'!' + '\n');
    res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
    res.end();
}).listen(9000);