const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../jwtSecretKey");

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

module.exports = router;