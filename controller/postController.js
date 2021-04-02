const { body,validationResult } = require('express-validator');
//var User = require('../models/user');
var Post = require('../models/post'); 


exports.index = function(req,res) {
    Post.find({}, function(err, list_post) {
        res.render("index", {title: "Members only", post_list : list_post, signup:false, login: false, joined: false });        
    })    
}

exports.show_post_with_id = function(req,res) {
    Post.findOne({_id: req.params.id})
    .populate('author')
    .exec(function(err, post){
        if(err) { return next(err); }
        res.render("displayPost",{post: post});
    });
}

exports.delete_post_with_id = function(req,res) {
    Post.findByIdAndDelete({_id: req.params.id}, function(err){
        if(err) {return nect(err); }
        
        Post.find({})
        .populate('author')
        .exec(function (err, list_post) {
            if (err) { return next(err); }
            //Successful, so render
        res.render('adminPage',{title: 'Admin Page', post_list: list_post});
      });

    })
}

exports.create_post_get = function(req,res) {
    res.render('createPost',{title: "Create New Post"});
}

exports.create_post_post = function(req,res) {
    res.redirect("/");
}


exports.delete_post = function(req, res) {
    console.log(req.params.id);
    Post.findByIdAndDelete(req.params.id, function(err,) {
        if(err) {return next(err); }
        console.log(req.params.id);
    })

    Post.find({})
      .populate('author')
      .exec(function (err, list_post) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('adminPage',{title: 'post after login', post_list: list_post});
      });
}


