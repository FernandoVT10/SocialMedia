const express = require("express");
const router = express.Router();
const jwtAuthentication = require("../jwtAuthentication");
const fs = require("fs");
const bcrypt = require("bcrypt");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

router.post("/changePhoto/", jwtAuthentication, (req, res) => {
    if(req.files.image) {
        const image = req.files.image;
        const image_name = Date.now() + image.name;
        const userId = mongojs.ObjectId(req.userId);
    
        db.collection("Users").findOne({_id: userId}, (err, userData) => {
            if(userData) {
                // check if the image is from the test
                // if we don't delete it
                if(userData.Image !== "test.png") {
                    fs.unlinkSync(`${__dirname}/../../public/img/users/${userData.Image}`);
                }

                // we add the image
                image.mv(`${__dirname}/../../public/img/users/${image_name}`, err => {
                    if(!err) {
                        // update the server
                        db.collection("Users")
                        .update({_id: userId}, {$set: {Image: image_name}}, () => {
                            res.json({
                                success: "The image has been changed successfully"
                            });
                        });
                    } else {
                        res.sendStatus(500);
                    }
                });
            } else {
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.post("/changeUsername/", jwtAuthentication, (req, res) => {
    if(req.body.username) {
        const userId = mongojs.ObjectId(req.userId);
        const username = req.body.username;

        db.collection("Users").findOne({Username: username}, (err, userData) => {
            if(!userData) {
                db.collection("Users")
                .update({_id: userId}, {$set: {Username: username}}, () => {
                    res.json({
                        success: "The username has been updated successfully"
                    });
                });
            } else {
                res.json({
                    error: "The username already exists"
                });
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.post("/changePassword/", jwtAuthentication, (req, res) => {
    if(req.body.currentPassword && req.body.newPassword) {
        const userId = mongojs.ObjectId(req.userId);
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        db.collection("Users").findOne({_id: userId}, (err, userData) => {
            if(userData) {
                bcrypt.compare(currentPassword, userData.Password, (err, verifyState) => {
                    if(verifyState) {
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if(!err) {
                                db.collection("Users")
                                .update({_id: userId}, {$set: {Password: hash}}, () => {
                                    res.json({
                                        success: "The password has been updated successfully"
                                    });
                                });
                            } else {
                                res.sendStatus(500);
                            }
                        });
                    } else {
                        res.json({
                            error: "The password is incorrect"
                        })
                    }
                });
            } else {
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.get("/isMyProfile/:username", jwtAuthentication, (req, res) => {
    const userId = mongojs.ObjectId(req.userId);
    const username = req.params.username;

    db.collection("Users").findOne({_id: userId, Username: username}, (err, userData) => {
        if(userData) {
            res.json(true);
        } else {
            res.json(false);
        }
    });
});

module.exports = router;