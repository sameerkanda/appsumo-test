appSumo.service('$user', function($http) {
	this.signUp = function (parameters, callback) {
		parameters = angular.toJson(parameters, false);

		$http.post('/api/users', parameters).success(function(data, status) {
			if(callback)
				callback(false)
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		});
	};

	this.get = function(id, callback) {
		$http.get('/api/users/' + id).success(function(data, status) {
			if(callback)
				callback(false, data);
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		});
	};

	this.login = function(parameters, callback) {
		parameters = angular.toJson(parameters, false);

		$http.post('/auth', parameters).success(function(data, status) {
			if(callback)
				callback(false)
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		});
	};

	this.logout = function(callback) {
		$http.delete('/auth', {}).success(function() {
			if(callback)
				callback();
		});
	};
});

appSumo.service('$question', function($http) {
	this.create = function(parameters, callback) {
		parameters = JSON.parse(angular.toJson(parameters, false));

		//remove empty answers
		for(var i=parameters.answers.length - 1; i>=0; i--)
			if(parameters.answers[i] == '')
				parameters.answers.splice(i, 1);

		$http.post('/api/questions', parameters).success(function(data, status) {
			if(callback)
				callback(false)
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		});
	};

	this.get = function(id, callback) {
		$http.get('/api/questions/' + id).success(function(data, status) {
			if(callback)
				callback(false, data);
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		});
	}
});

appSumo.service('$userAnswer', function($http) {
	this.create = function(parameters, callback) {
		$http.post('/api/user-answers', parameters).success(function(data, status) {
			if(callback)
				callback(true, status);
		}).error(function(data, status) {
			if(callback)
				callback(true, status);
		})
	}
});