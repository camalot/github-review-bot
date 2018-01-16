"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	comment: {
		route: "/comment"
	}
};

module.exports = merge(xconfig, config);
