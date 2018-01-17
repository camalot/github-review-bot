"use strict";
const express = require("express");
const bot = require("../bot");
const github = require("../github");
const debug = require("debug")("reviewbot:audit");
const router = express.Router();
const config = require("./audit.config.js");
const loginRoute = "/login";
const Promise = require("promise");
const utils = require("../lib/utils");


/* GET home page. */
router.get("/", utils.auth.isLoggedIn, function(req, res, next) {
	github.auth.isUserInOrganization(req.user).then(
		function(allowed) {
			if (!allowed) {
				console.log("not Authorized");
				var err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}
			github.users.getAll("2fa_disabled").then(
				result => {
					res.render("audit", { users: result, title: "User Audit" });
				},
				err => {
					return next(err);
				}
			);
		},
		function(err) {
			return next(err);
		}
	);
});

module.exports = router;
