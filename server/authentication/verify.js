var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function (user) {
	return jwt.sign(user, config.SECRET_KEY, { expiresIn: 3600 });
};

exports.auth = function (req, res, next) {

	// check headers for token
	var token = req.headers['x-access-token'];

	if (token) {
		// verify using the secret key
		jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
			if (err) {
				req.userError = true;
			}
			else {
				// if everything is good, add user data to the req for future use.
				req.userData = decoded;
			}
			return next();
		});
	}
	else {
		next();
	}
};

exports.token = function (req, res, next) {
	if (req.userError) {
		return res.status(401).json({
			state: false,
			error: 'bad-token'
		});
	} 
	else {
		return res.status(200).json({
			state: true
		});
	}
};

exports.user = function (req, res, next) {
	if (req.userData) {
		next();
	}
	else {
		return res.status(401).json({
			state: false,
			error: 'no-token'
		});
	}
};

exports.admin = function (req, res, next) {
	if (req.userData && req.userData.admin) {
		next();
	}
	else {
		return res.status(403).json({
			state: false,
			error: 'not-admin'
		});
	}
};