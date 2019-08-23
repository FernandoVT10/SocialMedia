const express = require("express");
const router = express.Router();
const getUsers = require("../getUsers");
const jwtAuthentication = require("../jwtAuthentication");
const fs = require("fs");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

router.get("/getPublications/:limit/:offset/", jwtAuthentication, (req, res) => {
    const userId = req.userId;
    const limit = parseInt(req.params.limit || 0);
    const offset = parseInt(req.params.offset || 0);

    // get following id

    db.collection("Followers").find({FollowerId: userId}, (err, followers) => {
        if(followers) {
            const usersIds = followers.map(follower => follower.UserId);
            usersIds.push(userId);

            db.collection("Publications")
            .find({UserId: {$in: usersIds}})
            .limit(limit)
            .skip(offset)
            .sort({Date: -1}, (err, docs) => {
                if(!res) {
                    res.json([]);
                } else {
                    getUsers(docs, "publications", req.userId).then(publications => {
                        res.json(publications);
                    });
                }
            });
        }
    });
});

router.get("/getProfilePublications/:userId/:limit/:offset/", jwtAuthentication, (req, res) => {
    const userId = req.params.userId;
    const limit = parseInt(req.params.limit || 0);
    const offset = parseInt(req.params.offset || 0);

    db.collection("Publications").find({UserId: userId})
    .limit(limit)
    .skip(offset)
    .sort({Date: -1}, (err, docs) => {
        if(!res) {
            res.json([]);
        } else {
            getUsers(docs, "publications", req.userId).then(publications => {
                res.json(publications);
            });
        }
    });
});

router.post("/addPublication/", jwtAuthentication, (req, res) => {
    if(req.files.imageFile && req.body.content) {
        const imageFile = req.files.imageFile;
        const content = req.body.content;

        if(imageFile.mimetype === "image/png"
        || imageFile.mimetype === "image/jpg" 
        || imageFile.mimetype === "image/jpeg") {
            const image_name = Date.now() + imageFile.name;

            imageFile.mv(`${__dirname}/../../public/img/publications/${image_name}`, err => {
                if(!err) {
                    const newPublication = {
                        UserId: req.userId,
                        Image: image_name,
                        Content: content,
                        Date: new Date(Date.now())
                    };

                    try {
                        db.collection("Publications").insert(newPublication);

                        res.json({
                           success: "The publication has been added successfully" 
                        });
                    } catch(e) {
                        console.log(err.message);
                    }
                } else {
                    res.sendStatus(500);
                }
            });
        }
    } else {
        res.sendStatus(403)
    }
});

router.delete("/deletePublication/", jwtAuthentication, (req, res) => {
    if(req.body.publicationId) {
        const publicationId = mongojs.ObjectId(req.body.publicationId);

        db.collection("Publications")
        .findOne({_id: publicationId, UserId: req.userId}, (err, publicationData) => {
            if(publicationData) {
                // Delete image
                fs.unlinkSync(`${__dirname}/../../public/img/publications/${publicationData.Image}`);
                
                // Delete publication
                db.collection("Publications")
                .remove({_id: publicationId, UserId: req.userId}, (err, status) => {
                    if(!err) {
                        // Delete likes if "PublicationId" is equal to "String(publicationId)"
                        db.collection("Likes")
                        .remove({PublicationId: String(publicationId)}, (err, status) => {
                            // Delete comments if "PublicationId" is equal to "String(publicationId)"
                            db.collection("Comments")
                            .remove({PublicationId: String(publicationId)}, (err, status) => {
                                if(!err) {
                                    res.json({
                                        success: "The post has been deleted successfuly"
                                    });
                                }
                            });
                        });
                    } else {
                        res.sendStatus(403);
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

module.exports = router;