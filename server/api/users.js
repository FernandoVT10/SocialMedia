const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../jwtSecretKey");
const jwtAuthentication = require("../jwtAuthentication");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.post("/register/", (req, res, next) => {
    if(req.body) {
        const { username, email, password } = req.body;

        // check if the variables are null
        if(username && email && password) {
            
            // check if the variables are valid
            // username characters: 4, max 20
            // password characters: 6 or more
            if(username.length >= 4 && username.length <= 30
            && validateEmail(email) && password.length >= 6) {
                db.collection("Users")
                .findOne({$or: [ {Username: username}, {Email: email}] }, (err, userData) => {
                    if(userData) {

                        // check if the email or username match
                        if(userData.Username === username) {
                            res.json({
                                error: "The username already exists"
                            });
                        } else if(userData.Email === email) {
                            res.json({
                                error: "The email already exists"
                            });
                        }
                    } else {
                        // encrypt password
                        bcrypt.hash(password, 10, (err, hash) => {
                            if(!err) {
                                const newUser = {
                                    Username: username,
                                    Email: email,
                                    Password: hash,
                                    Image: "test.png"
                                };

                                //insert user
                                try {
                                    db.collection("Users").insert(newUser);

                                    res.json({
                                       success: "The user has been added successfully" 
                                    });
                                } catch(e) {
                                    console.log(err.message);
                                }
                            } else {
                                console.log(err.message);
                            }
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
});

router.post("/login/", (req, res) => {
    const { username, password } = req.body;

    // check if the variables are null
    if(username && password) {
        // find user with username
        db.collection("Users").findOne({Username: username}, (err, userData) => {
            if(userData) {
                // compare password encrypted with password
                bcrypt.compare(password, userData.Password, (err, verifyState) => {
                    console.log(userData);
                    if(!err) {
                        if(verifyState) {
                            // create and send token
                            // the token expire in 365 days
                            jwt.sign({userId: userData._id},jwtSecretKey,
                            {expiresIn: "365d"}, (err, token) => {
                                res.json({
                                    success: "You have successfuly logged in",
                                    token
                                });
                            });
                        } else {
                            res.json({
                                error: "The username or password not match"
                            });
                        }
                    } else {
                        console.log(err.message);
                    }
                });
            } else {
                res.json({
                    error: "The user not exists"
                });
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.get("/getProfile/:username", jwtAuthentication, (req, res) => {
    const username = req.params.username;

    db.collection("Users").findOne({Username: username}, (err, userData) => {
        if(userData) {
            const userId = String(userData._id);
            
            db.collection("Followers").count({FollowerId: userId}, (err, following) => {
                userData.following = following;

                db.collection("Followers").count({UserId: userId}, (err, followers) => {
                    userData.followers = followers;
                    
                    db.collection("Followers")
                    .findOne({UserId: userId, FollowerId: req.userId},
                    (err, followingStatus) => {
                        if(followingStatus) {
                            userData.followingStatus = true;
                        } else {
                            userData.followingStatus = false;
                        }

                        // delete provide data
                        delete userData.Password;
                        delete userData.Email;

                        res.json(userData);
                    });
                });
            });
        } else {
            res.json({
                error: "The profile not exists"
            });
        }
    });
});

router.get("/getUserByToken/", jwtAuthentication, (req, res) => {
    const userId = mongojs.ObjectId(req.userId);

    db.collection("Users").findOne({_id: userId}, (err, userData) => {
        if(userData) {
            res.json(userData);
        } else {
            res.sendStatus(403);
        }
    });
});

router.get("/getUsers/:limit/:offset", (req, res) => {
    const limit = parseInt(req.params.limit || 0);
    const offset = parseInt(req.params.offset || 0);

    db.collection("Users")
    .find()
    .limit(limit)
    .skip(offset, (err, usersData) => {
        if(usersData) {
            const users = usersData.map(user => ({username: user.Username, image: user.Image}));
            res.json(users);
        } else {
            res.json([]);
        }
    });
});

router.get("/searchUsers/:search/:limit/:offset", (req, res) => {
    const search = req.params.search;
    const limit = parseInt(req.params.limit || 0);
    const offset = parseInt(req.params.offset || 0);
    console.log("a");

    db.collection("Users")
    .find({Username: {$regex: search}})
    .limit(limit)
    .skip(offset, (err, usersData) => {
        if(usersData) {
            const users = usersData.map(user => ({username: user.Username, image: user.Image}));
            res.json(users);
        } else {
            res.json([]);
        }
    });
});

module.exports = router;