const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const saltRounds = 10;

require('dotenv').config();

//Schemas
const User = require('../schemas/user.js');
const BlogPost = require('../schemas/blogPost.js');

const store = require('./util/mongostore.js');

// no need for body parser here because exporting router to main file
// so req.body is perfectly fine

const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        User.findOne({ username: username }, function(err, user) {
            // user will have a value of null if no user is found
            if(user) {
                res.send({ success: false, message: "Error Registering Account"});
            }
            else {
                const user = new User({
                    username,
                    email,
                    password: hash,
                    posts: [],
                });
        
                user.save().then(() => {
                    req.session.user = username;
                    req.session.save();
                    res.send({ success: true, message: "Account Successfully Registered", sessID: req.session.id});
                    console.log('new user registered');
                    console.log(req.session);
                });
            }
        });


    })
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({ username : username }, function(err, user) {
        if(!user) {
            res.send({ success: false, message: "Username or Password Incorrect" });
        }
        else {
            bcrypt.compare(password, user.password, function(err, result) {
                if(result) {
                    req.session.user = username;
                    req.session.save();
                    res.send({ success: true, message: "Successfully Logged In", sessID: req.session.id });
                }
                else {
                    res.send({ success: false, message: "Username or Password Incorrect" })
                }
            })
        }
    })
})

router.post('/logout', (req, res) => {
    const {sessId} = req.body;
    store.destroy(sessId, (error) => {
        if(error) {
            res.send({ success: false, message: "failed to destroy session" });
        }

        console.log(`user destroyed session ${sessId}`);
        res.send({ success: true, message: "session destroyed successfully" });
    });
})

router.get('/authenticate', (req, res) => {
    store.get(req.query.sessId, function(error, session) {
        if (error) {
            res.send({success: false, message: "not authenticated"});
            return;
        }
        if(session) {
            res.send({success: true, message: "authenticated", username: session.user});
        }
        else {
            res.send({success: false, message: "not authenticated"});
        }
    })
})

router.post('/createPost', (req, res) => {
    const { sessId, title, subheading, bodyText  } = req.body;

    if(!sessId || !title || !subheading || !bodyText) {
        res.send({success: false, message: "incomplete form"});
    }

    store.get(sessId, function(error, session) {
        if(error) {
            
            res.send({success: false, message: "not authenticated"});
        }

        if(session) {
            User.findOne({username : session.user}, function(err, user) {
                if(!user) {
                    res.send({success: false, message: "not authenticated"});
                }
                else {
                    const blogPost = new BlogPost({
                        username: user.username,
                        title: title,
                        subheading: subheading,
                        bodyText: bodyText,
                    })
                    // save blog post and on callback add the id of this post to the user that created it
                    blogPost.save().then((thisPost) => {
                        let posts = [...user.posts].concat(thisPost._id);
                        User.findOneAndUpdate({ username : user.username }, { 'posts': posts }, { upsert: false },  function(err, doc) {
                            console.log("blog post saved and user updated");
                            res.send({ success: true, message: "blog post saved" });
                        })
                    });
                }
            })
        }
        else {
            res.send({success: false, message: "not authenticated"})
        }
    })
})

router.get('/getPost', (req, res) => {
    let pq = req.query.post;
    BlogPost.findOne({ _id: pq }, function(err, post) {
        if(!post) {
            res.send({ success: false, message: "post not found" });
        }
        else {
            res.send({ success: true, message: "post found", title: post.title, subheading: post.subheading, bodyText: post.bodyText });
        }
    })
})

module.exports = router;