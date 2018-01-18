'use strict';
/**
 * This will set create labels, and set defaults on the repo when created.
*/
const githubApi = require('../github');
const github = githubApi.service;
const debug = require('debug')('review:bot');
const config = require('../config');


function onRepositoryCreate(repo) {
	githubApi.repos.edit(repo.name || repo, config.repo_defaults );
	githubApi.issues.createLabels(repo.name || repo, config.repo_defaults.labels);
}

module.exports = {
	name: "repo-defaults",
	enabled: true,
	onRepositoryCreate: onRepositoryCreate
};
