import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularRoute from 'angular-route';

import allpersMenu from '../imports/components/menu/menu';
import allpersOverview from '../imports/components/overview/overview';
import allpersTopic from '../imports/components/topic/topic';
import allpersPosts from '../imports/components/posts/posts';

import '../imports/startup/accounts-config.js';

import template from './main.html';


angular.module('allpers', [
                           
	angularMeteor,
	angularRoute,
	
	allpersMenu.name,
	allpersOverview.name,
	allpersTopic.name,
	allpersPosts.name,
	
	'accounts.ui'
	
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  
	$locationProvider.hashPrefix('!');
	
	$routeProvider.
	    when('/news', {
	      template: '<allpers-overview></allpers-overview>'
	    }).
	    when('/topic', {
	      template: '<allpers-topic></allpers-topic>'
	    }).
	    otherwise('/news');
	
}]);