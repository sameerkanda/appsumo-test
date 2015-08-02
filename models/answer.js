"use strict";

module.exports = function(sequelize, DataTypes) {
	var Answer = sequelize.define("Answer", {
		answer: DataTypes.STRING
	}, {
		classMethods: {
			associate: function(models) {
				Answer.belongsTo(models.Question);
				Answer.belongsToMany(models.User, {through:'UserAnswer'});
			}
		}
	});

	return Answer;
};