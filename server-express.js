var application_root = __dirname + '/app/services/angular/',
    express = require("express"),
    config = require('./app/services/config.js'),
    mongoDB = require('./app/services/db.js'),
    path = require("path"),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    passport = require('passport'),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash');

var main_config = config.main_config();

var app = express();
app.set('views', __dirname + '/app/services/angular/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

var db = mongoDB.connect(
    main_config.get('db:user'),
    main_config.get('db:pass'),
    main_config.get('db:host'),
    main_config.get('db:port'),
    main_config.get('db:db_name'),
    main_config.get('db:collections')
);

app.use(expressSession({secret: 'mySecretKey',resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());
app.use(express.static(application_root));
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Initialize Passport
var initPassport = require('./app/services/passport/init.js');
var login = require('./app/services/passport/login.js');
var signup = require('./app/services/passport/signup.js');
initPassport.init(passport, db, login, signup);

var routes = require('./app/services/routes.js')(passport);
app.use('/', routes);

app.get('/api', function (req, res) {
    res.send('Our Sample API is up...');
});

app.get('/', function (req, res) {
    res.render('layout.html');
});

app.get('/user/list', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as Cross           // Domain Request
    db.users.find({}, function(err, users) { // Query in MongoDB via Mongo JS Module
        if( err || !users || users.length == 0) {
            res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
            str='[';
            text = (err) ? err : "noitems";
            str = str + '{ "type" : "' + text + '"},' +'\n';
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
            str='[';
            users.forEach( function(user) {
                str = str + '{ "name" : "' + user.username + '","email" : "' + user.email + '"},' +'\n';
            });
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
            // Prepared the jSon Array here
        }
    });
});

app.post('/user/add', function (req, res){
    console.log("POST: ");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as
    // Cross Domain Request
    console.log(req.body);
    console.log(req.body.mydata);
    var jsonData = JSON.parse(req.body.mydata);

    db.users.save({email: jsonData.email, password: jsonData.password, username: jsonData.username},
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if( err || !saved ) res.end( "User not saved");
            else res.end( "User saved");
        });
});

app.get('/categories', function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as Cross           // Domain Request
    db.categories.find({}, function(err, categories) { // Query in MongoDB via Mongo JS Module
        if( err || !categories || categories.length == 0) {
            res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
            str='[';
            text = (err) ? err : "noitems";
            str = str + '{ "type" : "' + text + '"},' +'\n';
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'}); // Sending data via json
            str='[';
            categories.forEach( function(category) {
                str = str + '{ "id" : "' + category._id + '",' +
                '"title" : "' + category.title + '",' +
                '"description" : "' + category.description + '",'+
                '"parent" : "' + category.parent + '"},' +'\n';
            });
            str = str.trim();
            str = str.substring(0,str.length-1);
            str = str + ']';
            res.end( str);
            // Prepared the jSon Array here
        }
    });
});

app.post('/category/add', function (req, res){
    console.log("POST: ");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    // The above 2 lines are required for Cross Domain Communication(Allowing the methods that come as
    // Cross Domain Request
    console.log(req.body);
    console.log(req.body.mydata);
    var jsonData = JSON.parse(req.body.mydata);

    var category = {
        title: jsonData.title,
        description: jsonData.description
    };

    if (jsonData.parent) {
        category.parent = jsonData.parent;
    }

    db.categories.save(category,
        function(err, saved) { // Query in MongoDB via Mongo JS Module
            if( err || !saved ) {
                console.log(" Error ",err);
                res.end( "Category not saved");
            }
            else res.end( "Category saved");
        });
});



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('views/error.html', {
        message: err.message,
        error: err
    });
});
//}


app.listen(1212);

