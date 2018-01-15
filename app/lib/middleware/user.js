"use strict";

module.exports = (req, res, next) => {
	console.log("user middle ware");
	res.locals.user = req.user;
	console.log(res.locals.user);
	next();
};
