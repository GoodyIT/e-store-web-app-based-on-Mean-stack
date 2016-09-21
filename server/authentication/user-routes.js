var express = require('express');
var passport = require('passport');
var User = require('../models').User;
var verify = require('./verify');
var multer = require('multer');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/public/images/users/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + "-" + datetimestamp + "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]);
    }
});

var upload = multer({ storage: storage }).single('file');

router.get('/', verify.admin, function (req, res, next) {
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

	upload(req, res, function (err) {
		if (err) {
			return res.status(500).json({
				state: false,
				error: err
			});
		}

		var pic = req.file.filename;
		
		User.register(
			new User({ username: req.body.username }),
			req.body.password,
			function (err, user) {
				if (err) {
					return res.status(500).json({
						state: false,
						error: err.name,
						message: err.message
					});
				}

				user.firstname = req.body.firstname;
				user.lastname = req.body.lastname;
				user.imageUrl = "images/users/" + pic;
					
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

});

router.post('/login', function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return res.status(401).json({
				state: false,
				error: err,
				message: err.message
			});
		}
		if (!user) {
			if (info.name === 'IncorrectUsernameError') {
                res.status(401).json({
                    state: false,
                    error: 'user_not_found',
                    message: 'Incorrect Username'
                });
            }
            else if (info.name === 'IncorrectPasswordError') {
                res.status(401).json({
                    state: false,
                    error: 'invalid_password',
                    message: 'Incorrect Password'
                });
            }
            else {
                res.status(401).json({
                    state: false,
                    error: err,
					message: info.message
                });
            }
            return;
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
				_id: user._id,
				admin: true
			});

			res.json({
				state: true,
				token: token,
				userData: {
					id: user._id,
					firstName: user.firstname,
					lastName: user.lastname,
					imageUrl: user.imageUrl,
					isAdmin: user.admin
				}
			});

		});
	})(req, res, next);

});

router.get('/logout', verify.user, function (req, res) {
	req.logOut();
	res.json({
		state: true,
		message: 'logged out succesfully'
    });
});

// verify that incoming token is valid
router.get('/token', verify.token);

module.exports = router;