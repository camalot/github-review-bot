"use strict";

let result = {
	// the label that indicates the PR needs review
	labelNeedsReview: process.env.GRB_NEEDS_REVIEW_LABEL || 'needs-review',
	// the label that indicates that the PR has been reviewed.
	labelPeerReviewed: process.env.GRB_PEER_REVIEWED_LABEL || 'peer-reviewed',
	// the label that indicates that someone wants more work before approving
	labelNeedsWork: process.env.GRB_NEEDS_WORK_LABEL || 'needs-work',
	// the default number of reviews needed.
	reviewsNeeded: 3,
	// should the bot auto-merge the PR once reviewed?
	mergeOnReview: false,
	// pr's with this status will be monitored
	pullRequestsStatus: ['open'],
	// labels that if the bot sees it will not monitor the PR.
	excludeLabels: ['no-review'],
	// the initial comment by the bot, set below if not defined
	instructionsComment: '',
	// comment when the PR creator tries to approve their own PR.
	shameComment: ":bell: Shame! :bell: Shame!\nYou cannot vote to approve your own PR. 'A' for effort though.",
	filenameFilter: ''

};

// Setup Instructions Comment
if (result.instructionsComment === '') {
	var comment = 'Hi! I\'m your friendly Peer Review Bot. For this Pull Request to be labeled as "peer-reviewed", ' +
		'you\'ll need at least {reviewsNeeded} comments containing the magic phrase "LGTM" or ":+1:". ' +
		'\n\nIf someone replies with "Needs Work" or ":-1:", that same user will need to reply again with indicating ' +
		'they approve of the changes.';

	result.instructionsComment = comment;
}



module.exports = result;

