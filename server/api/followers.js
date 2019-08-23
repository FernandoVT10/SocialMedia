const express = require("express");
const router = express.Router();
const jwtAuthentication = require("../jwtAuthentication");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

router.post("/follow/", jwtAuthentication, (req, res) => {
    if(req.body.username) {
        const username = req.body.username;

        // check if the user exists
        db.collection("Users").findOne({Username: username}, (err, userData) => {
            if(userData) {
                // check if it is not the same user

                if(String(userData._id) === req.userId) {
                    res.sendStatus(403);
                    return;
                }

                const userId = userData._id;

                db.collection("Followers")
                .remove({UserId: String(userId), FollowerId: req.userId}, (err, status) => {
                    if(!status.deletedCount) {
                        const newFollower = {
                            UserId: String(userId),
                            FollowerId: req.userId
                        };

                        try {
                            db.collection("Followers").insert(newFollower);

                            res.json({
                                success: "The follower has been added successfully" 
                            });
                        } catch(e) {
                            console.log(err.message);
                        }
                    } else {
                        res.json({
                            success: "The follower has been deleted successfully"
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            }
        });
    }
});

module.exports = router;