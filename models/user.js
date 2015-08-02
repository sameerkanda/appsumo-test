"use strict";

var bcrypt = require('bcrypt'),
	Promise = require('promise');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
		isAdmin: DataTypes.BOOLEAN,
		userName: DataTypes.STRING,
		password: {
			type: DataTypes.STRING,
			set: function(val) {
				this.setDataValue('password', bcrypt.hashSync(val, 8));
			}
		}
	}, {
		classMethods: {
			associate: function(models) {
				User.belongsToMany(models.Answer, {through:'UserAnswer'});
			},
			getUserFromSession: function(session) {
				return new Promise(function(resolve, reject) {
					var models = require('./../models');

					if(!session.userId) {
						reject(Error('Unauthorized'));

						return;
					}

					models.User.findOne({
						where: {id:session.userId}
					}).then(function(user) {
						if(user) {
							resolve(user);
						}
						else {
							session.destroy(function() {
								reject(Error('Invalid Session'))
							});
						}
					});
				});
			}
		}
	});

	return User;
};