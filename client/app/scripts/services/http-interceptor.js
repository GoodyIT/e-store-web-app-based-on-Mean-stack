bluStore.factory('httpInterceptor', ['$q', '$rootScope', 'EVENTS', 'CONFIG', 'ERRORS', 'localStorageFactory', '$log',
	function ($q, $rootScope, EVENTS, CONFIG, ERRORS, localStorage, $log) {
		return {
			'request': function (config) {
				$log.info({ httpReq: config });
				// get token from the local storage and set to every request
				var userData = localStorage.getObject(CONFIG.TOKEN_STORE_KEY);
				if(userData){
					config.headers['x-access-token'] = userData.token;
				}
				
				return config;
			},

			'requestError': function (rejection) {
				$log.error({ httpReqError: rejection });
				return $q.reject(rejection);
			},

			'response': function (response) {
				$log.info({ httpRes: response });
				return response;
			},

			'responseError': function (rejection) {

				$log.error({ httpResError: rejection });

				if (rejection.data.error === ERRORS.BAD_TOKEN) {
					// fire Unauthorized User Event
					$rootScope.$broadcast(EVENTS.USER_REQUIRED);
				}
				else if(rejection.data.error === ERRORS.NO_TOKEN){
					// fire Unauthorized User Event
					$rootScope.$broadcast(EVENTS.USER_REQUIRED);
				}
				else if (rejection.status === ERRORS.NOT_ADMIN) {
					// fire "Forbidden Action & admin required" event
					$rootScope.$broadcast(EVENTS.ADMIN_REQUIRED);
				}

				return $q.reject(rejection);
			}

		};
	}
]);