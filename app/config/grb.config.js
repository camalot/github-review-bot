
'use strict';
const npmpackage = require("../../package.json");

let result = {
	GRB : {
		VERSION: npmpackage.version,
		TITLE: "Peer Review Bot",
		URL: npmpackage.homepage,
		BOTURL: process.env.GRB_BOT_URL
	}
};



if (!result.GRB.BOTURL) {
	throw new Error("Configuration: Missing configuration value for 'GRB.BOTURL'");
}

module.exports = result;
