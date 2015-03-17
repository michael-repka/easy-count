var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

module.exports = function(passport){

    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('layout.html', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/#/users',
        failureRedirect: '/#/',
        failureFlash : true
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res){
        res.render('layout.html',{message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/users',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    /* Check user Home Page */
    router.get('/checkuser', isAuthenticated, function(req, res){
        res.json({ user: req.user });
    });

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res){
        res.render('layout.html', { user: req.user });
    });

    /* GET Users Page */
    router.get('/users', isAuthenticated, function(req, res){
        res.render('layout.html', { user: req.user });
    });


    /* Handle Logout */
    router.get('/signout', function(req, res) {
        console.log("Got there...");
        req.logout();
        res.redirect('/');
    });

    return router;
}