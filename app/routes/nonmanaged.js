'use strict';
const express = require('express');
const bot = require('../bot');
const github = require('../github');
const debug = require('debug')('reviewbot:nonmanaged');
const router = express.Router();
const config = require("./nonmanaged.config.js");
const loginRoute = '/login';
const Promise = require('promise');
const _ = require('lodash');
const async = require('async');

const utils = require("../lib/utils");


let _render = (req, res, data) => {
	let dataObject = {
		repos: data,
		user: req.user
	};
	res.render('nonmanaged', dataObject);
};

router.get('/', utils.auth.isLoggedIn, (req, res, next) => {
	github.auth.isUserInOrganization(req.user).then((allowed) => {
		if (!allowed) {
			console.log("not Authorized");
			let err = new Error('Not Authorized.');
			err.status = 403;
			next(err);
		}
		let managedList = [];
		github.repos.getAll().then((repos) => {
			try {
				async.each(repos, (item, nextRepo) => {
					// each
					github.webhooks.getAll(item).then((data) => {
						let repo = data.repo;
						let hooks = data.hooks;

						github.webhooks.filterBotHooks(repo.name, hooks).then((filteredHooks) => {
							let hasHook = filteredHooks.length > 0;
							if(!hasHook && managedList.filter((t) => { return t.repo.name === repo.name; }).length === 0 ) {
								managedList.push({
									repo: repo
								});
							}
							nextRepo();
						}, (err) => {
							if(err) {
								console.error(err);
								nextRepo(err);
							}
						});

					}, (err) => {
						console.error(err);
						next(err);
					});
				}, (err) => {
					// done repos.each
					if (err) {
						console.error(err);
						next(err);
					}
					let sorted = _.orderBy(managedList, [(o) => {
						return o.repo.name.toLowerCase();
					}], ['asc']);
					_render(req, res, sorted);

				});
			} catch (ex) {
				console.error(ex);
				next(err);
			}
		}, (err) => {
			console.error(err);
			next(err);
		});

	}, (err) => {
		console.error(err);
		next(err);
	});
});


module.exports = router;
