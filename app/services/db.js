module.exports = {
    connect: function (user, pass, host, port, db, collections) {
        var mongojs = require("mongojs");
        var databaseUrl = user+":"+pass+"@"+host+":"+port+"/"+db; // "username:password@example.com/mydb"
        var connection = mongojs(databaseUrl);
        for (var i in collections) {
            connection[collections[i]] = connection.collection(collections[i]);
        }

        return connection;
    }
};

