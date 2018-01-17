"use strict";
const config = require('../../../config');
module.exports = (req, res, next) => {
	res.locals.GRB = config.GRB;
	next();
};
