var express = require('express');
var app = express();

var userController  = require('../controller/userController');
var postController = require('../controller/postController');
var router = express.Router();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const mongoose = require("mongoose");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');



passport.use(
    
    new LocalStrategy((email, password, done) => {
      console.log("1")
      User.findOne({ email: email }, (err, user) => {
        console.log("user.findOne")
        if (err) {
          console.log("err");
          return done(err);
        }
        if (!user) {
          console.log("incorrect username")
          return done(null, false, { errors: ["Incorrect username"] });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            console.log("great job")
            return done(null, user);
          } else {
            console.log("incorrect password")
            // passwords do not match!
            return done(null, false, { errors: ["Incorrect password"] });
          }
        });
      });
    })
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  
  app.use(passport.initialize());
  app.use(passport.session());



router.get('/', postController.index);
router.get('/log-in',userController.login_get);
router.post(
    '/log-in',
    passport.authenticate("local", {
          successRedirect: "/join-club",
          failureRedirect: "/log-in"  
    })
    )


router.get('/join-club', userController.join_club_get);
router.post('/join-club', userController.join_club_post);

router.get("/sign-up", userController.signup_get);
router.post("/sign-up", userController.signup_post);

router.get('/logout', userController.logout);

router.get('/create-post', postController.create_post_get);
router.post('/create-post', postController.create_post_post);

router.get('/post/:id', postController.show_post_with_id);
router.post('/post/:id', postController.delete_post_with_id);

module.exports = router; 
