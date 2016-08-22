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
				var err = new Error('You are not authenticated!');
				err.status = 401;
                return next(err);
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
		var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
	}

};

exports.verifyAdmin = function (req, res, next) {
	if (!req.userData.admin) {
		var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
	}

	next();
};