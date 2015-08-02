'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		//convert sass into css
		sass: {
			target: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					update: true,
					cacheLocation: 'storage/grunt/.sass-cache'
				},
				files: [{
					expand: true,
					src: ['assets/styles/**/*.scss'],
					ext: '.min.css'
				}]
			}
		},
		//concat and minify all css, and move to public directory
		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			target: {
				files: {
					'public/css/style.min.css': [
						'bower_components/bootstrap/dist/css/bootstrap.min.css',
						'assets/styles/appsumo-test.min.css'
					]
				}
			}
		},
		//concat and minify all sumoapp-test scripts
		uglify: {
			options: {
				mangle: false
			},
			target: {
				files: {
					'assets/scripts/script.min.js': [
						'assets/scripts/appsumo-test.js',
						'assets/scripts/services.js',
						'assets/scripts/directives.js',
						'assets/scripts/controllers.js'
					]
				}
			}
		},
		//concat all package scripts with sumoapp-test scripts, and move to public directory
		concat: {
			target: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'bower_components/angular/angular.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js',
					'assets/scripts/script.min.js'
				],
				dest: 'public/js/script.min.js'
			}
		},
		//pre-convert static jade into html, so express doesn't have to do it all the time (only works for static html delivery), and move to public directory
		jade: {
			target: {
				options: {
					data: {
						debug: false
					}
				},
				files: [{
					expand: true,
					cwd: 'views',
					src: ['**/*.jade'],
					dest: 'public',
					ext: '.html'
				}]
			}
		},
		//run "grunt watch" to automatically run grunt tasks
		watch: {
			scss: {
				files: ['assets/styles/**/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {
					spawn: false
				}
			},
			js: {
				files: ['assets/scripts/**/*.js'],
				tasks: ['uglify', 'concat'],
				options: {
					spawn: false
				}
			},
			jade: {
				files: ['views/**/*.jade'],
				tasks: ['jade'],
				options: {
					spawn: false
				}
			}
		}
	});

	//run "grunt" to manually run grunt tasks
	grunt.registerTask('default', [
		'sass',
		'cssmin',
		'uglify',
		'concat',
		'jade'
	]);
};
