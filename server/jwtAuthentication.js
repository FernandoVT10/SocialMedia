const jwt = require("jsonwebtoken");
const jwtSecretKey = require("./jwtSecretKey");

module.exports = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        jwt.verify(token, jwtSecretKey, (err, userData) => {
            if(err) {
                res.sendStatus(403);
            } else {
                req.userId = userData.userId;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};