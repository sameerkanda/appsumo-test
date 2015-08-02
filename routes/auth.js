var router = require('express').Router(),
	bcrypt = require('bcrypt'),
	models = require('./../models');

router.post('/', function(req, res, next) {
	models.User.findOne({
		where: {username: req.body.username}
	}).then(function(user) {
		if(!user || !bcrypt.compareSync(req.body.password, user.password)) {
			res.sendStatus(401);

			return;
		}

		req.session.userId = user.id;

		res.sendStatus(200);
	});
});

router.delete('/', function(req, res, next) {
	req.session.destroy(function() {
		res.sendStatus(200);
	})
});

module.exports = router;
