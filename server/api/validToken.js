const express = require("express");
const router = express.Router();
const jwtAuthentication = require("../jwtAuthentication");

router.get("/validToken/", jwtAuthentication, (req, res) => res.sendStatus(200));

module.exports = router;