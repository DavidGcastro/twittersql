'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require("../db");


module.exports = function makeRouterWithSockets(io) {
    // a reusable function
    function respondWithAllTweets(req, res, next) {
        client.query('SELECT * FROM tweets  INNER JOIN users on users.id = tweets.user_id', function (err, result) {
            if (err) return next(err); // pass errors to Express
            var tweets = result.rows;
            res.render('index', {
                title: 'Twitter.js',
                tweets: tweets,
                showForm: true
            });
        });

    }

    // here we basically treet the root view and tweets view as identical
    router.get('/', respondWithAllTweets);
    router.get('/tweets', respondWithAllTweets);

    // single-user page
    router.get('/users/:username', function (req, res, next) {
        let userName = req.params.username.toUpperCase();
        client.query("SELECT users.name, tweets.content FROM tweets JOIN users ON tweets.user_id=users.id WHERE UPPER(name) = $1", [userName], function (err, result) {
            if (err) return next(err);
            var userTweets = result.rows;
            res.render('index', {
                title: 'Twitter.js',
                tweets: userTweets,
                showForm: true
            });
        })
    });

    // single-tweet page
    router.get('/tweets/:id', function (req, res, next) {
        let id = req.params.id;
        client.query("SELECT tweets.content FROM tweets WHERE tweets.id = $1", [id], function (err, result) {
            if (err) return next(err);
            var ids = result.rows;
            res.render('index', {
                title: 'Twitter.js',
                tweets: ids,
                showForm: true
            });
        })

    });

    // create a new tweet
    router.post('/tweets', function (req, res, next) {
        let post = req.body;
        let name = post.name;
        let postcontent = post.content;
        //check if this name exists already
        client.query("SELECT * FROM USERS WHERE name = $1", [name], function (err, result) {
            if (result.rows.length === 0) {
                //do something here if user doesnt exist
                console.log(result)
            } else {
                //still need to do this
                let userID = result.rows[0].id;
                client.query("INSERT INTO tweets VALUES(user_id, content) VALUES($1, $2)", [userID, postcontent], function (err, result) {
                    if (err) return next(err)
                    else {

                    }
                })

            }


        })



    });

    // // replaced this hard-coded route with general static routing in app.js
    // router.get('/stylesheets/style.css', function(req, res, next){
    //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
    // });

    return router;
}
