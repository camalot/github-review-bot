"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	audit: {
		route: "/audit"
	}
};

module.exports = merge(xconfig, config);
