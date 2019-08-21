const publications = require("./api/publications");
const users = require("./api/users");
const comments = require("./api/comments");
const likes = require("./api/likes");

module.exports = app => {
    app.use("/api/publications/", publications);
    app.use("/api/users/", users);
    app.use("/api/comments/", comments);
    app.use("/api/likes/", likes);
};