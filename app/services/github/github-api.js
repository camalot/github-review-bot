'use strict';
const GitHubApi = require('github');
const debug = require('debug')('reviewbot:githubapi');
const config = require('../../../config');

var github = new GitHubApi({
  debug: false,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  timeout: 8000,
	version: '3.0.0',
	headers: {
		"Accept": "application/vnd.github.black-cat-preview+json; application/vnd.github.squirrel-girl-preview; */*"
	}
});

module.exports = {
	service: github
};
