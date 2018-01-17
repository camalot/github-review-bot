'use strict';
let result = {
	github: {
		// if the organization is a user account, and not an organization, set this to true
		manageUserRepos:
			(process.env.GRB_ISUSER_ACCOUNT || "false").toLowerCase().trim() ===
			"true",
		// the github organization
		organization: process.env.GRB_ORGANIZATION,
		// the username for the bot
		username: process.env.GRB_BOT_USERNAME,
		// the github user access token
		token: process.env.GRB_ACCESS_TOKEN,
		// the webhook secret used to generate the x-hub sha
		webhookSecret: process.env.GRB_WEBHOOK_SECRET,
		// oAuth client id
		authClientID: process.env.GRB_AUTH_CLIENT_ID,
		// oAuth client secret
		authClientSecret: process.env.GRB_AUTH_CLIENT_SECRET
	}
};


if (!result.github.organization) {
	throw new Error(
		"Configuration: Missing configuration value for 'github.organization'"
	);
}

if (!result.github.username) {
	throw new Error(
		"Configuration: Missing configuration value for 'github.username'"
	);
}

if (!result.github.token) {
	throw new Error(
		"Configuration: Missing configuration value for 'github.token'"
	);
}

if (!result.github.webhookSecret) {
	throw new Error(
		"Configuration: Missing configuration value for 'github.webhookSecret'"
	);
}

module.exports = result;
