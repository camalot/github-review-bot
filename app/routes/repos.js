"use strict";
const express = require("express");
const bot = require("../bot");
const github = require("../github");
const debug = require("debug")("reviewbot:repos");
const router = express.Router();
const loginRoute = "/login";
const Promise = require("promise");
const async = require("async");

let requireLoggedIn = () => {
	return require("connect-ensure-login").ensureLoggedIn(loginRoute);
};

/* GET home page. */
router.get("/", requireLoggedIn(), (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then(
		allowed => {
			if (!allowed) {
				console.log("not Authorized");
				let err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}

			github.repos.getAll().then(
				result => {
					res.render("repos", {
						repos: result,
						owner: req.user
					});
				},
				err => {
					return next(err);
				}
			);
		},
		err => {
			return next(err);
		}
	);
});

router.get("/:repo", requireLoggedIn(), (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then(
		allowed => {
			if (!allowed) {
				let err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}
			let output = [];
			github.repos.get(req.params.repo).then(
				result => {
					res.render("repo-edit", {
						repo: result,
						user: req.user
					});
				},
				err => {
					return next(err);
				}
			);
		},
		err => {
			return next(err);
		}
	);
});

router.post("/enforce/:repo", requireLoggedIn(), (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then(
		allowed => {
			if (!allowed) {
				let err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}
			console.log("attempting to enforce: " + req.params.repo);
			var reviewsNeeded = parseInt(
				req.body.reviewsNeeded || config.reviewsNeeded,
				0
			);
			bot.enforce(req.params.repo, reviewsNeeded).then(
				result => {
					res.redirect("/repos/");
				},
				err => {
					return next(err);
				}
			);
		},
		err => {
			return next(err);
		}
	);
});

router.get("/unenforce/:repo", requireLoggedIn(), (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then(
		allowed => {
			if (!allowed) {
				let err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}

			bot.unenforce(req.params.repo).then(
				result => {
					res.redirect("/repos/" + req.params.repo);
				},
				err => {
					return next(err);
				}
			);
		},
		err => {
			return next(err);
		}
	);
});

router.get("/setup", (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then(
		allowed => {
			if (!allowed) {
				let err = new Error("Not Authorized.");
				err.status = 403;
				return next(err);
			}
			github.repos.getAll().then(
				results => {
					async.each(
						results,
						(repo, next) => {
							console.log("enforcing: " + repo.name);
							bot.enforce(repo.name, config.reviewsNeeded).then(
								data => {
									next();
								},
								err => {
									return next(err);
								}
							);
						},
						err => {
							// done
							if (err) {
								return next(err);
							}
							res.redirect("/repos/");
						}
					);
				},
				err => {
					return next(err);
				}
			);
		},
		err => {
			return next(err);
		}
	);
	// get all repos
	// make sure the bot in setup on all
});

module.exports = router;
