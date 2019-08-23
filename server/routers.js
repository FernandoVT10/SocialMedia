const publications = require("./api/publications");
const users = require("./api/users");
const comments = require("./api/comments");
const likes = require("./api/likes");
const validToken = require("./api/validToken");
const followers = require("./api/followers");
const configuration = require("./api/configuration");

module.exports = app => {
    app.use("/api/publications/", publications);
    app.use("/api/users/", users);
    app.use("/api/comments/", comments);
    app.use("/api/likes/", likes);
    app.use("/api/followers/", followers);
    app.use("/api/configuration", configuration);

    app.use("/api/", validToken);
};