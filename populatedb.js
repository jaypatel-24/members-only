#! /usr/bin/env node

console.log('This script populates some posts to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var express = require('express');
var app = express();
var async = require('async')

var Post = require('./models/post')
var User = require('./models/user')

var time = require('express-timestamp')
app.use(time.init)


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var posts = []
var users = []


function postCreate(title, timestamp, text, author, cb) {
  postdetail = {title:title , timestamp:timestamp, text: text, author: author }

  var post = new Post(postdetail);
       
  post.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post)
  }  );
}

function userCreate(firstName, lastName, email, password, membershipStatus, secretToken, cb) {
    userdetail = {firstName: firstName ,lastName: lastName, email: email, password: password, membershipStatus: membershipStatus }
  
    var user = new User(userdetail);
         
    user.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New User: ' + user);
      users.push(user)
      cb(null, user)
    }  );
  }
  

  function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('Arjun', 'Mali', 'arjunMali@gmail.com','jaypatel','outsider','', callback);
        },
        function(callback) {
          userCreate('Jay', 'Patel', 'friend.jay24@gmail.com','jaypatel','admin','', callback);
        },
        function(callback) {
          userCreate('Jeet', 'Patel', 'friend.jeet24@gmail.com','jaypatel','insider','', callback);
        },  
        function(callback) {
          userCreate('Priti', 'Zinta', 'pritizinta@gmail.com','jaypatel','outsider','', callback);
        }
        ],
        // optional callback
        cb);
}  


function createPosts(cb) {
    async.parallel([
        function(callback) {
          postCreate('Cafe Uphoria', new Date(), 'This cafe is the best cafe in terms of provinding service. This cafe is little cosatly but worth going to it', users[0], callback);
        },
        function(callback) {
            postCreate('About MS Dhoni', new Date(), 'He is the only captain which is known for his intelligence and calm behaviour. Miss you MSD', users[1], callback);
        },
        function(callback) {
            postCreate('Hard Work', new Date(), 'No matther what will be the future, keep putting your efforts and let destiny decide your fate', users[2], callback);
        },
        function(callback) {
            postCreate('Inspire', new Date(), 'The Best Way To Get Started Is To Quit Talking And Begin Doing', users[3], callback);
        },

        function(callback) {
            postCreate('Nature and Maths', new Date(), 'The laws of nature are but the mathematical thoughts of God.', users[1], callback);
        }

        ],
        // optional callback
        cb);
}



async.series([
    createUsers,
    createPosts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Users: '+ users);
        console.log('Posts: '+ posts);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



