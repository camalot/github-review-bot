"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	login: {
		route: "/login"
	}
};

module.exports = merge(xconfig, config);
