const express = require("express");
const router = express.Router();
const jwtAuthentication = require("../jwtAuthentication");

const mongojs = require("mongojs");
const db = mongojs("socialmedia");

router.post("/like/", jwtAuthentication, (req, res) => {
    if(req.body.publicationId) {
        const publicationId = mongojs.ObjectId(req.body.publicationId);
        const userId = req.userId;

        // check if the publication exists
        db.collection("Publications")
        .findOne({_id: publicationId}, (err, publicationData) => {
            if(publicationData) {

                db.collection("Likes")
                .remove({UserId: userId, PublicationId: String(publicationId)}, (err, status) => {
                        // if no line is deleted, we add the like
                    if(!status.deletedCount) {
                        const newLike = {
                            UserId: userId,
                            PublicationId: String(publicationId)
                        };

                        try {
                            db.collection("Likes").insert(newLike);

                            res.json({
                                success: "The like has been added successfully" 
                            });
                        } catch(e) {
                            console.log(err.message);
                        }
                    } else {
                        res.json({
                            success: "The like has been deleted successfully"
                        });
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