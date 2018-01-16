"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	deployment: {
		route: "/deployment"
	}
};

module.exports = merge(xconfig, config);
