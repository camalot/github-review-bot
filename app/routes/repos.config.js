"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	repos: {
		route: "/repos"
	}
};

module.exports = merge(xconfig, config);
