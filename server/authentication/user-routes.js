var express = require('express');
var passport = require('passport');
var User = require('../models').User;
var verify = require('./verify');

var router = express.Router();

router.get('/', verify.verifyUser, verify.verifyAdmin, function (req, res, next) {
	User.find({}, function (err, users) {
		if (err) {
            return next(err);
        }
        else {
            res.json({
				state: true,
				data: users
			});
        }
	});
});

router.post('/register', function (req, res, next) {

	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		function (err, user) {
			if (err) {
				err.status = 500;
				return next(err);
			}

			if(req.body.firstname)
				user.firstname = req.body.firstname;
			if(req.body.lastname)
				user.lastname = req.body.lastname;
			if(req.body.email)
				user.email = req.body.email;

			user.save(function (err, user) {
				passport.authenticate('local')(req, res, function () {
					return res.json({
						state: true,
						message: 'Registration Successful!'
					});
				});
			});

		}
	);

});

router.post('/login', function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			var error = new Error(info);
			error.status = 401;
			return next(error);
		}

		// login the user
		req.logIn(user, function (err) {
			if (err) {
				err.status = 500;
				return next(error);
			}

			// get token and send it
			var token = verify.getToken({
				username: user.username,
				_id: user._id
			});

			res.json({
				state: true,
				token: token,
				userData: {
					id: user._id,
					firstName: user.firstname,
					lastName: user.lastname,
					isAdmin: user.admin
				}
			});

		});
	})(req, res, next);

});

router.get('/logout', function (req, res) {
	req.logOut();
	res.json({
		state: true,
		message: 'logged out succesfully'
    });
});

module.exports = router;