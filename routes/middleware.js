var router = require('express').Router();

//set proper header for all RESTful responses
router.use(function(req, res, next) {
	res.type('application/json');

	next();
});

module.exports = router;
