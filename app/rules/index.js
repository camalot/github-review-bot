'use strict';

const normalizedPath = require("path").join(__dirname, "./");
let rules = [];
require("fs").readdirSync(normalizedPath).forEach((file) => {
	let configMatch = /.*?\.config\.js/i;
	if(file !== 'index.js' && file !== 'config.js' && !configMatch.test(file)) {
		console.log(file);
  	rules[rules.length] = require("./" + file);
	}
});

module.exports = rules;
