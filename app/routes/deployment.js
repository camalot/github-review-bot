"use strict";
const express = require("express");
const bot = require("../bot");
const githubApi = require("../github");
const config = require("./deployment.config.js");
const debug = require("debug")("reviewbot:deployment");
const router = express.Router();
const loginRoute = "/login";
const Promise = require("promise");

const utils = require("../lib/utils");


router.post("/:ref", _handleDeploymentEvent);

function _handleDeploymentEvent(req, res) {
	var ref = req.params.ref;
	var deployment = req.body.deployment;
}

module.exports = router;
