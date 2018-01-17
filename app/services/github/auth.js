"use strict";
const githubApi = require("./github-api");
const github = githubApi.service;
const config = require("../../../config");
const Promise = require("promise");

/**
 * Private: Authenticate next request
 */
function authenticate() {
	if (!config.github.token) {
		throw Error("Fatal: No access token configured!");
	}

	github.authenticate({
		type: "basic",
		username: config.github.username,
		password: config.github.token
	});
}

let isUserInOrganization = function(user) {
	return new Promise((resolve, reject) => {
		if(user == null) {
			reject(false);
		}
		authenticate();

		// need to check if user can manage the repos...
		if (config.github.manageUserRepos) {
			return resolve( user.username === config.github.organization );
		}

		github.orgs.getOrgMembership(
			{
				org: config.github.organization,
				username: user.username
			},
			(err, result) => {
				if (err) {
					resolve(false);
				} else {
					resolve(true);
				}
			}
		);
	});
};

let isXHubValid = req => {
	return new Promise((resolve, reject) => {
		if (
			!req.isXHub ||
			config.github.webhookSecret == "" ||
			config.github.webhookSecret == null
		) {
			resolve(true);
		}
		console.log("xhub validated: " + req.isXHubValid());
		resolve(req.isXHubValid());
	});
};

module.exports = {
	authenticate: authenticate,
	isUserInOrganization: isUserInOrganization,
	isXHubValid: isXHubValid
};
