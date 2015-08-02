var router = require('express').Router(),
	models = require('./../../models');

router.post('/', function(req, res, next) {
	models.Answer.findOne({
		where: {id: req.body.answerId},
		include: [{model:models.Question}]
	}).then(function(answer) {
		if(!answer) {
			res.sendStatus(404);

			return;
		}

		if(!req.session.userId) {
			models.User.create({}).then(recordUserAnswer);
		}
		else {
			models.User.getUserFromSession(req.session).then(function(user) {
				req.session.userId = user.id;

				recordUserAnswer(user)
			});
		}

		function recordUserAnswer(user) {
			user.addAnswer(answer);

			res.sendStatus(201);
		}
	});
});

module.exports = router;