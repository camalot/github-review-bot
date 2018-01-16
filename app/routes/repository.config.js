"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	repository: {
		route: "/repository"
	}
};

module.exports = merge(xconfig, config);
