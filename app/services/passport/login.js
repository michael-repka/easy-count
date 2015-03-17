var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

module.exports = {
    login: function(passport, db) {
        passport.use('login', new LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                // check in mongo if a user with username exists or not
                db.users.find({ 'username' :  username },
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log error & redirect back
                        if (!user){
                            console.log('User Not Found with username '+username);
                            return done(null, false,
                                req.flash('message', 'User Not found.'));
                        }
                        // User exists but wrong password, log the error
                        if (!isValidPassword(user[0], password)){
                            console.log('Invalid Password');
                            return done(null, false,
                                req.flash('message', 'Invalid Password'));
                        }
console.log("User "+ user[0]);
                        // User and password both match, return user from
                        // done method which will be treated like success
                        return done(null, user[0]);
                    }
                );
            }));
    }

};