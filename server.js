require('dotenv').load();

var express = require('express'),
	expressValidator = require('express-validator'),
	compression = require('compression'),
	models = require('./models'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	sessionFileStore = require('session-file-store')(session),
	app = express(),
	server;

//quick hack to make this into a global variable (not a good idea to do in production)
appSumoInitialized = false;

//create database tables on initial run
models.sequelize.sync().then(function () {
	//check to see if the website is being loaded for the very first time
	models.User.count().then(function(userCount) {
		appSumoInitialized = userCount > 0;

		//session middleware
		app.use(session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: true,
			store: new sessionFileStore()
		}));

		//gzip all output (TODO: images should not be gzipped in production)
		app.use(compression());

		//parse json from request (for RESTful APIs)
		app.use(bodyParser.json());

		//validation handler
		app.use(expressValidator({
			errorFormatter: function(param, msg, value) {
				var namespace = param.split('.'), root = namespace.shift(), formParam = root;

				return {param:formParam, message:msg, value:value};
			}
		}));

		//RESTful APIs routes
		app.use(['/auth', '/api'], require('./routes/middleware'));
		app.use('/auth', require('./routes/auth'));
		app.use('/api/users', require('./routes/api/user'));
		app.use('/api/questions', require('./routes/api/question'));
		app.use('/api/user-answers', require('./routes/api/userAnswer'));

		//redirect to /initialize page when website is loaded for the very first time
		app.use(function(req, res, next) {
			if(!appSumoInitialized && req.url == '/')
				res.redirect('/initialize');
			else
				next()
		});

		//deliver public static content
		app.use(express.static(__dirname + '/public'));

		//always deliver index.html on 404 (let front-end handle 404 rerouting)
		app.use(function(req, res, next) {
			res.sendFile(__dirname + '/public/index.html');
		});

		//start the server
		server = app.listen(process.env.SERVER_PORT, function() {
			console.log('Express server listening on port ' + server.address().port);
		});
	});
});