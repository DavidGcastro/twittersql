// setting up the node-postgres driver
var pg = require('pg');
var postgresUrl = 'postgres://localhost/twitterdb';
var client = new pg.Client(postgresUrl);

// connecting to the `postgres` server
client.connect(function (err) {
    if (err) console.log(err)
    else console.log("connected to db")
});

// make the client available as a Node module
module.exports = client;
