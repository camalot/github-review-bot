"use strict";

const express = require("express");
const passport = require("passport");
const path = require("path");
const logger = require("morgan");
const xhub = require("express-x-hub");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

const config = require("../config");
const routes = require("./routes/index");
const pullrequest = require("./routes/pullrequest");
const repository = require("./routes/repository");
const comment = require("./routes/comment");
const repos = require("./routes/repos");
const audit = require("./routes/audit");
const login = require("./routes/login");
const managed = require("./routes/managed");
const nonmanaged = require("./routes/nonmanaged");



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
require("./lib/hbs/xif");
require("./lib/hbs/sections");
app.use(favicon(path.join(__dirname, "assets/images", "favicon16.png")));

app.use(session({ secret: "uremwuflwmgfitnmeif" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport")(passport);
app.use(require("./lib/middleware/user"));


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		secret: config.github.webhookSecret,
		resave: false,
		saveUninitialized: true
	})
);
app.use(cookieParser());

app.use("/assets", express.static(path.join(__dirname, "assets")));
// app.use(express.static(path.join(__dirname, "node_modules/mdi")));

app.use(
	"/assets/material-design-lite",
	express.static("node_modules/material-design-lite")
);

if (config.github.webhookSecret) {
	app.use(xhub({ algorithm: "sha1", secret: config.github.webhookSecret }));
}


// app.use(
// 	require("node-sass-middleware")({
// 		src: path.join(__dirname, "public"),
// 		dest: path.join(__dirname, "public"),
// 		indentedSyntax: true,
// 		sourceMap: true
// 	})
// );


app.use("/", routes);
app.use("/pullrequest", pullrequest);
app.use("/repository", repository);
app.use("/comment", comment);
app.use("/managed", managed);
app.use("/nonmanaged", nonmanaged);
app.use("/repos", repos);
app.use("/audit", audit);

if (config.github.authClientID && config.github.authClientSecret) {
	app.use("/login", login);
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error("Page Not Found");
	err.status = 404;
	res.status(404);
	res.locals.message = err.message;
	res.render("404", { title: err.status });
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error", { title: "Error: " + err.status });
});

module.exports = app;
