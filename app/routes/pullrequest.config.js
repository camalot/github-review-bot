"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	pullrequest: {
		route: "/pullrequest"
	}
};

module.exports = merge(xconfig, config);
