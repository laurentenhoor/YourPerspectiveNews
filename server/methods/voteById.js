import { Votes } from '../../imports/api/votes.js';
import { Posts } from '../../imports/api/posts.js';

Meteor.methods({

	voteById(id, voteValue) {
		
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-logged-in', "Please login first");
		}
		
		// robustness for adjusting the javascript value
		if (voteValue > 0) {
			voteValue = 1;
		} else {
			voteValue = -1;
		}

		// check if a vote already exists for this user and article
		var vote = Votes.findOne({articleId : id, ownerId: Meteor.userId()});
		
		if (!vote) {
			
			Votes.insert({
				ownerId: Meteor.userId(),
				ownerName: Meteor.user().username,
//				email: Meteor.user() ? Meteor.user().emails[0].address : 'null',
				value: voteValue,
				articleId : id
			});
			Posts.update(id, {$inc : { score: voteValue}});
			
		} else {
			
			if (vote.value != voteValue) {
				Votes.update(vote._id, {$set: {value: voteValue}});
				Posts.update(id, {$inc : {score: 2*voteValue}});
			}
			
		}
		
	}
});