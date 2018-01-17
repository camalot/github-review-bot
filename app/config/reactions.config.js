
"use strict";

let result = {
	// reactions are disabled because they do not issue an event one one is added/removed.
	enableReactions: false,
	// the reactions that will identify as "looks good"
	lgtmReactions: ["+1", "heart", "hooray"],
	// the reactions that will identify as "needs work"
	needsWorkReactions: ["-1", "confused"],
	// regex for "looks good"
	// do not use /g it causes failures on successful matches
	lgtmRegex: /(:\+1:|(?:\blgtm\b|\blooks good(?:\sto me!?)?\b)|:shipit:|👍)/i,
	// regex for "needs work"
	// do not use /g it causes failures on successful matches
	needsWorkRegex: /(\bneeds (?:some )?work\b|:-1:|👎)/i
};

module.exports = result;
