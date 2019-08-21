const mongojs = require("mongojs");
const db = mongojs("socialmedia");

function getUsers(objects, type, currentUserId) {
    const promises = [];

    objects.forEach(object => {
        const userId = mongojs.ObjectId(object.UserId);

        const promise = new Promise(resolve => {
            db.collection("Users").findOne({_id: userId}, (err, user) => {
                const userObject = {
                    Id: user._id,
                    Username: user.Username,
                    Image: user.Image
                }

                // if the user ID is equal to the current user ID
                // we add the parameter "ifFromUser" to the object
                if(String(user._id) === currentUserId) {
                    object.isFromTheUser = true;
                } else {
                    object.isFromTheUser = false;
                }

                if(type === "comments") {
                    resolve(
                        {
                            comment: object,
                            user: userObject
                        }
                    );
                } else if(type === "publications") {
                    // check if the user like it this publication
                    db.collection("Likes")
                    .findOne({UserId: currentUserId, PublicationId: String(object._id)},
                    (err, likeData) => {
                        if(likeData) {
                            object.liked = true;
                        } else {
                            object.liked = false;
                        }

                        db.collection("Likes")
                        .count({PublicationId: String(object._id)}, (err, likesCount) => {
                            object.likes = likesCount;
                            resolve(
                                {
                                    publication: object,
                                    user: userObject
                                }
                            );
                        });
                    });
                }
            });
        });

        promises.push(promise);
    });

    return Promise.all(promises);
}

module.exports = getUsers;