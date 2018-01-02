import { Votes } from '/imports/api/votes.js';
import { Articles } from '/imports/api/articles.js';
import { Comments } from '/imports/api/comments.js';

export default class VoteService {

    constructor($auth) {
        'ngInject';
        this.$auth = $auth;
    }

    voteById(id, voteValue) {
		
		if (!this.$auth.isLoggedIn()) {
            throw new Meteor.Error('not-logged-in', "Please login first");
            return;
		}
		
		// robustness for adjusting the javascript value
		if (voteValue > 0) {
			voteValue = 1;
		} else {
			voteValue = -1;
		}

		// check if a vote already exists for this user and article
		var vote = Votes.findOne({articleId : id, ownerId: Meteor.userId()});
		console.log(vote);
		
		if (!vote) {
			
			Votes.insert({
				ownerId: Meteor.userId(),
				ownerName: Meteor.user().username,
//				email: Meteor.user() ? Meteor.user().emails[0].address : 'null',
				value: voteValue,
				articleId : id
			});
			
			Articles.update(id, {$inc : {score: voteValue}});
			Comments.update(id, {$inc : {score: voteValue}});			
			
		} else {
			
			if (vote.value != voteValue) {
				
				Votes.update(vote._id, {$set: {value: voteValue}});
				
				Articles.update(id, {$inc : {score: 2*voteValue}});
				Comments.update(id, {$inc : {score: 2*voteValue}});
				
			}
			
		}
		
	}

}