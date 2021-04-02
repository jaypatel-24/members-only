const { body,validationResult } = require('express-validator');
var express = require('express');
var app = express();

var User = require('../models/user');
var Post = require('../models/post');







// //use local variable anywhere in app
// app.use(function(req, res, next) {
//   res.locals.currentUser = req.user;
//   next();
// });




 //login GET 
exports.login_get = function(req,res) {
    res.render('login_form',{title : "login form", errors: [] });
}

//login POST
exports.login_post =  function(req,res) {
  
}

  

// exports.login_post  = function(req,res) {
//   const {email, password} = req.body;
  

//   User.findOne({email: email}, function(err, user) {
//     if(err) {return next(err); }
    
//     if(user.password == password) {

//       Post.find({})
//       .populate('author')
//       .exec(function(err, list_post) {
//         if(err) { return next(err); }
//         res.render("afterLoginPage",{title: "club member", post_list: list_post, membershipStatus: user.membershipStatus, id: user._id });
//       })
      
//     } else {
//       res.render("log-in",{title: "please login", errors: ["incorrect credentials"]});
//     }

//   })
// }
  
 

exports.logout = function(req,res) {
  req.logout();
  res.redirect('/');
}


//signup GET
exports.signup_get = function(req,res) {
    res.render("sign-up-form",{title: "sign-up form", errors: [] });
}

//signup POST
exports.signup_post = function(req,res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("sign-up-form", { title: "signup form", errors: errors.array() });
    return;
  } 
    
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err) {return next(err); }
    
        // otherwise, store hashedPassword in DB
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          membershipStatus: "outsider",
          secretToken: ""
        });
          
        user.save(err => {
          if (err) { return next(err); };

          Post.find().exec(function (err, list_post) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('index', { title: 'Posts', post_list: list_post, signup:true, login: false, joined: true });
          });
        });
      });


//     //remove when use uppper part 
//     const user = new User({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: req.body.password,
//       membershipStatus: "outsider",
//       secretToken: ""
//     });
      
//     user.save(err => {
//       if (err) { return next(err); };

//       postModel.find().exec(function (err, list_post) {
//         if (err) { return next(err); }
//         //Successful, so render
//         res.render('index', { title: 'Posts', post_list: list_post, signup:true, login: false, joined: true });
//       });
// })

}


exports.join_club_get = function(req,res) {
  res.render('join-club', {title: "Join club"});
  // if(req.body.secretKey == req.body.user_secretKey) {
  //   res.render('index',{title: 'post after login',  membershipStatus:"outsider" });
  // } else {
  //   res.render('join-club',{title: 'Join Club'});
  // }
}

exports.join_club_post = function(req,res) {
  
  User.findOneAndUpdate({_id: req.body.id}, function(err,result) {
    if(err) return next(err);
    result.membershipStatus = "insider";
  })

  if(req.body.secretKey == "ADMIN") {
    Post.find({})
      .populate('author')
      .exec(function (err, list_post) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('adminPage',{title: 'post after login', post_list: list_post});
      });
    
  } else if(req.body.secretKey == "INSIDER"){
    Post.find({},function(err,result){
      if(err) {return next(err); }
      //success
      res.render('afterLoginPage',{title: 'Join Club', post_list: result});
    }) 
    
  } 
}

