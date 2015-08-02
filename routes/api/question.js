var router = require('express').Router(),
	models = require('./../../models');

router.get('/next', function(req, res) {
	models.User.getUserFromSession(req.session).then(function(user) {
		user.getAnswers({include:[{model:models.Question}]}).then(function(answers) {
			var uniqueQuestionIds = [];

			for(var i=0; i<answers.length; i++) {
				if(uniqueQuestionIds.indexOf(answers[i].Question.id) == -1)
					uniqueQuestionIds.push(answers[i].Question.id);
			}

			outputNextQuestion(uniqueQuestionIds);
		});
	}, function() {
		outputNextQuestion([]);
	});

	function outputNextQuestion(uniqueQuestionIds) {
		var questionQuery = {include: [{model:models.Answer}]};

		if(uniqueQuestionIds.length) {
			questionQuery.where = {
				id: {$notIn:uniqueQuestionIds}
			};
		}

		models.Question.findAll(questionQuery).then(function(questions) {
			var randomQuestion;

			if(questions.length == 0) {
				res.sendStatus(404);

				return;
			}

			randomQuestion = questions[Math.floor(Math.random() * questions.length)];

			res.send(randomQuestion);
		});
	}
});

router.post('/', function(req, res, next) {
	var validation_errors;

	//validate inputs
	req.checkBody('question', 'The question must be at least 2 characters.').len(2);
	req.checkBody('answers.0', 'There must be at least one answers.').len(1);

	validation_errors = req.validationErrors();

	if(validation_errors.length) {
		res.status(400).send({errors:validation_errors});

		return;
	}

	if(!req.session.userId) {
		res.sendStatus(401);

		return;
	}

	models.User.getUserFromSession(req.session).then(function(user) {
		if(!user.isAdmin) {
			res.sendStatus(401);

			return;
		}

		models.Question.create({question:req.body.question}).then(function(question) {
			req.body.answers.forEach(function(answer) {
				models.Answer.create({answer:answer}).then(function(answer) {
					question.addAnswer(answer);
				});
			});

			res.sendStatus(201);
		});
	}, function(error) {
		res.sendStatus(401);

		return;
	});
});

module.exports = router;
