const mongojs = require("mongojs");
const db = mongojs("socialmedia");

module.exports = currentUserId => {
    const userId = mongojs.ObjectId(currentUserId);
    return new Promise(resolve => {
        db.collection("Users").findOne({_id: userId}, (err, user) => {
            resolve({
                Id: user._id,
                Username: user.Username,
                Image: user.Image
            });
        });
    });
}