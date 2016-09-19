'use strict';

/**
 * this function handle http response 
 * it takes http res object and return 
 * function than can be used as callback
 * for MongoDB Querys or Cache Data requests
 * and it will take care of response to the client 
 */
function handleResponse(res, doBefore) {
	// return method to be used as callback
	return function (error, data) {
		var isInDev = (process.env.NODE_ENV === 'development' ? true : false);

		var response = {
			state: false,
			error: {},
			message: '',
			data: {}
		}

		if (error) {
			console.log(error);
			response.error = (isInDev ? error : {});
			response.message = (isInDev ? error.message : 'INTERNAL SERVER ERROR');
			sendResponse(res, 500, response, doBefore);
		}
		else if (!data || data.length < 1) {
			response.message = 'Not found!';
			sendResponse(res, 404, response, doBefore);
		}
		else {
			response.state = true;
			response.data = data;
			sendResponse(res, 200, response, doBefore);
		}
	};

}

function sendResponse(res, status, response, doBefore){
	if(doBefore){
		// do task before sending response 
		doBefore(function(){
			res.status(status).json(response);
		});
	}
	else {
		res.status(status).json(response);
	}
}

module.exports = handleResponse;