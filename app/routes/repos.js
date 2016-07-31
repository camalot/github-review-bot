var express = require('express'),
		bot = require('../bot'),
		debug = require('debug')('reviewbot:comment'),
    router = express.Router(),
		loginRoute = '/login';

var requireLoggedIn = function () {
	return require('connect-ensure-login').ensureLoggedIn(loginRoute);
};

	// app.get('/profile',
	//   require('connect-ensure-login').ensureLoggedIn(),
	//   function(req, res){
	//     res.render('profile', { user: req.user });
	//   });

/* GET home page. */
router.get('/', requireLoggedIn(), function (req, res) {
		bot.isUserInOrganization(req.user, function(allowed) {
			if(allowed) {
				bot.getAllRepositories(function(result) {
					res.render('repos', { repos: result, user: req.user });
				});
			} else {
				console.log("not Authorized");
				var err = new Error('Not Authorized.');
		    err.status = 403;
				return err;
			}
		})
});

router.get('/:repo', requireLoggedIn(), function (req, res) {
	var output = [];
	bot.getRepository(req.params.repo, function(result) {
		res.render('repo-edit', { repo: result, user: req.user });
	});
});

router.post('/enforce/:repo', requireLoggedIn(), function(req, res) {
		console.log("attempting to enforce: " + req.params.repo);
		var reviewsNeeded = parseInt(req.body.reviewsNeeded || config.reviewsNeeded, 0);
		bot.enforce(req.params.repo, reviewsNeeded ,function(err,result) {
			console.log("err: " + err);
			console.log("result: " + result);
			if(!err){
				res.redirect('/repos/');
			}
		});
});

router.get('/unenforce/:repo', requireLoggedIn(), function(req, res) {
		bot.unenforce(req.params.repo,function(err,result) {
			if(!err){
				res.redirect('/repos/' + req.params.repo);
			} else {
				res.redirect('/error');
			}
		});
});

module.exports = router;