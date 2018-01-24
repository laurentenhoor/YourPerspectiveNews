import { Mongo } from 'meteor/mongo';

export const Topics = new Mongo.Collection('topics');

import { Articles } from './articles.js';

Topics.before.insert(function (userId, doc) {

	if (Meteor.isServer) {
		//Format the document
		doc.createdAt = Date.now();
		doc.updatedAt = Date.now();
	}
});

if (Meteor.isServer) {

	Meteor.publish('topics', (amountOfTopics, yesterday, singleTopicId) => {

		var amountOfDays = 1;

		function getDayTimestamp(amountOfDays) {
			return new Date().getTime() - (amountOfDays * 24 * 60 * 60 * 1000);
		}
		var startOfDay = getDayTimestamp(1);
		var endOfDay = getDayTimestamp(-1);

		if (yesterday == true) {
			startOfDay = getDayTimestamp(2);
			endOfDay = getDayTimestamp(1);
		}
		else if (yesterday == null) {
			startOfDay = getDayTimestamp(1000);
		}

		var searchQuery = {
			updatedAt: { $gte: startOfDay, $lte: endOfDay }
		}

		if (singleTopicId) {
			searchQuery._id = singleTopicId;
		}
		
		return Topics.find(
			searchQuery, {
				sort: { updatedAt: - 1 },
				limit: amountOfTopics
			})
	});

	Meteor.publish('articles', (topics) => {
		var articleIds = []
		_.each(topics, (topic) => {
			articleIds = articleIds.concat(topic.articleIds);
		});
		var articles = Articles.find({ _id: { $in: articleIds } });
		return articles;
	});
	
}