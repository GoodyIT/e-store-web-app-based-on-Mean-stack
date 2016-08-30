var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function (user) {
	return jwt.sign(user, config.SECRET_KEY, { expiresIn: 3600 });
};

exports.verifyUser = function verifyUser(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		// verify using the secret key
		jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
			if (err) {
                return res.status(401).json({
					state: false,
					error: 'bad-token'
				});
			}
			else {
				// if everything is good, add user data to the req for future use.
				req.userData = decoded;
				next();
			}
		});
	}
	else {
        // if there is no token return error
		return res.status(401).json({
			state: false,
			error: 'no-token'
		});
	}

};

exports.verifyAdmin = function (req, res, next) {
	if (!req.userData.admin) {
		return res.status(401).json({
			state: false,
			error: 'not-admin'
		});
	}

	next();
};