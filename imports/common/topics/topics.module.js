import angular from 'angular';
import angularMeteor from 'angular-meteor';

import TopicControls from './topic-controls/topic-controls.module';
import ArticleMenu from '/imports/common/article-menu/article-menu';
import yourpersComments from '/imports/common/comments-tile/comments-tile';

import TopicsComponent from './topics.component';
import AutoScrollService from './auto-scroll.service';


export default angular.module('topics', [
	ArticleMenu,
	yourpersComments,
	TopicControls,
])
	.component('topics', TopicsComponent)
	.service('$autoScroll', AutoScrollService)
	.config(($stateProvider) => {
		'ngInject';

		$stateProvider
			.state('topics', {
				url: "/",
				component: 'topics'
			});

	})
	.name;