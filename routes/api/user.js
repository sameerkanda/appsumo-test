var router = require('express').Router(),
	models = require('./../../models');

router.get('/me', function(req, res, next) {
	if(req.session.userId) {
		models.User.getUserFromSession(req.session).then(function(user) {
			res.send({isAdmin:user.isAdmin});
		}, function(error) {
			res.sendStatus(401);
		});
	}
	else {
		res.sendStatus(401);
	}
});

router.post('/', function(req, res, next) {
	var validation_errors, user;

	if(appSumoInitialized) {
		res.status(409).send({error:'The admin user already exists.'});

		return;
	}

	//validate inputs
	req.checkBody('username', 'The username must be at least 2 characters.').len(2);
	req.checkBody('password', 'The password must be at least 5 characters.').len(5);

	validation_errors = req.validationErrors();

	if(validation_errors.length) {
		res.status(400).send({errors:validation_errors});

		return;
	}

	user = {
		userName:req.body.username,
		password:req.body.password,
		isAdmin:true
	};

	models.User.create(user).then(function(user) {
		appSumoInitialized = true;

		res.sendStatus(201);
	});
});

module.exports = router;
