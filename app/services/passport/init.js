var ObjectId = require("mongojs").ObjectId;
module.exports = {
    init : function(passport, db, login, signup){

        // Passport needs to be able to serialize and deserialize users to support persistent login sessions
        passport.serializeUser(function(user, done) {
            console.log('serializing user: ');console.log(user);
            done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
            db.users.find({"_id":ObjectId(id)}, function(err, user) {
                console.log('deserializing user:',user);
                done(err, user);
            });
        });

        // Setting up Passport Strategies for Login and SignUp/Registration
        login.login(passport, db);
        signup.signup(passport, db);

    }
};