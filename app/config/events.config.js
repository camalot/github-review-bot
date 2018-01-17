"use strict";

let result = {
	enableRepositoryHook: true,
	repositoryHookEvents: ["repository"],
	repositoryHookActions: ["created"],

	// the events to hook to when attaching the bot to the repository
	pullRequestEvents: [
		"pull_request",
		"issue_comment",
		"pull_request_review_comment",
		"pull_request_review"
	]
};

module.exports = result;


