const express = require("express");
const router = express.Router();
const getUsers = require("../getUsers");
const getUserData = require("../getUserData");
const jwtAuthentication = require("../jwtAuthentication");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

router.get("/getComments/:publicationId/:limit/:offset/", jwtAuthentication, (req, res) => {
    const publicationId = req.params.publicationId;
    const limit = parseInt(req.params.limit || 0);
    const offset = parseInt(req.params.offset || 0);
    
    db.collection("Comments")
    .find({PublicationId: publicationId})
    .limit(limit)
    .skip(offset, (err, docs) => {
        if(!docs) {
            res.json([]);
        } else {
            getUsers(docs, "comments", req.userId).then(comments => {
                res.json(comments);
            });
        }
    });
});

router.post("/addComment/", jwtAuthentication, (req, res) => {
    if(req.body.publicationId && req.body.message) {
        const publicationId = req.body.publicationId;
        const message = req.body.message;

        // check if the publication exists
        db.collection("Publications")
        .findOne({_id: mongojs.ObjectId(publicationId)}, (err, publicationData) => {
            if(publicationData) {
                const newComment = {
                    UserId: req.userId,
                    PublicationId: publicationId,
                    Message: message,
                    Date: new Date(Date.now())
                };
                try {
                    db.collection("Comments").insert(newComment, (err, commentData) => {
                        getUserData(req.userId).then(userData => {
                            commentData.isFromTheUser = true;

                            res.json({
                                comment: commentData,
                                user: userData
                            });
                        });
                    });
                } catch(e) {
                    console.log(err.message);
                }
            } else {
                res.sendStatus(403);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.delete("/deleteComment/", jwtAuthentication, (req, res) => {
    if(req.body.commentId) {
        const commentId = mongojs.ObjectId(req.body.commentId);

        db.collection("Comments")
        .remove({_id: commentId, UserId: req.userId}, (err, status) => {
            if(status.deletedCount) {
                res.json({
                    success: "The comment has been deleted successfully"
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