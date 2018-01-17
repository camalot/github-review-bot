"use strict";

const xconfig = require("../config");
const merge = require("merge");

let config = {
	nonmanaged: {
		route: "/nonmanaged"
	}
};

module.exports = merge(xconfig, config);
