#Setup Instructions
* Copy .env-sample to .env and change the environment variables.
* Run `npm install` to install node.js libraries (node_modules).
* Run `bower install` to install front-end styles and scripts (bower_components).
* Run `grunt` to convert, concat, and minify html/css/js and move them to the public directory.
* Run `node server` to start the server. Your database structure will automatically be setup at this point.

#Using the App
* Once the website is running, it will ask you to setup a admin account (only done once).
* Once the admin account is setup, click on Admin Login to login as admin.
* Click on Create Questions to start creating questions.
* Once you've created questions, log out as amdmin, and the website will start asking you random questions (only the ones you have not answered yet), and record your ansewrs in the database.
* Analytics are not complete (they are not working). Saving user answers to the database may also be buggy (I didn't get to complete this either).
