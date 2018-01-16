"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	managed: {
		route: "/managed"
	}
};

module.exports = merge(xconfig, config);
