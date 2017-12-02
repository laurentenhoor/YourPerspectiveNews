import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularRoute from 'angular-route';

import {name as yourpersMenu} from '../imports/components/menu/menu';
import {name as yourpersFeedback} from '../imports/components/feedback/feedback';
import {name as yourpersBulletin} from '../imports/components/bulletin/bulletin';
import {name as yourpersLoader} from '../imports/components/loader/loader';

import '../imports/startup/accounts-config.js';

// Deprecated
import {name as yourpersPosts} from '../imports/components/deprecated/post/post';
import {name as yourpersItem} from '../imports/components/deprecated/item/item';
import {name as yourpersBundle} from '../imports/components/deprecated/bundle/bundle';
import {name as yourpersOverview} from '../imports/components/deprecated/overview/overview';
import {name as yourpersTopic} from '../imports/components/deprecated/topic/topic';


class MainCtrl {
	
	constructor($scope, $reactive, $window) {
		
		console.log('init MainCtrl');
		
		var $ctrl = this;
		$reactive($ctrl).attach($scope);
		
		$ctrl.showMobile = false;
		
		angular.element($window).bind('resize', function(){
			$scope.$apply(function() {
				checkWindowSize();	
			});
		});
		
		function checkWindowSize() {
			if ($window.innerWidth < 600) {
				$ctrl.showMobile = true;
			} else {
				$ctrl.showMobile = false;
			};
		}
		
		checkWindowSize();
	
	}
	
}


angular.module('yourpers', [
	
	angularMeteor,
	angularRoute,
	
	yourpersLoader,
	yourpersMenu,
	yourpersBulletin,
	yourpersFeedback,
	
	'accounts.ui',
	
	// Deprecated
	yourpersPosts,
	yourpersItem,
	yourpersBundle,
	yourpersOverview,
	yourpersTopic,
	
])

.controller('MainCtrl', ['$scope', '$reactive', '$window', MainCtrl])


.config(['$locationProvider', '$routeProvider', '$httpProvider', '$provide', '$sceDelegateProvider', function(
		$locationProvider, $routeProvider, $httpProvider, $provide, $sceDelegateProvider) {
	
	$sceDelegateProvider.resourceUrlWhitelist(['**']);

	$routeProvider.
	    when('/nieuws', {
    		template: '<yourpers-bulletin></yourpers-bulletin>'
	    }).
	    
	    // Deprecated
	    when('/overview', {
		      template: '<yourpers-overview></yourpers-overview>'
	    }).
	    when('/topic', {
	      template: '<yourpers-topic></yourpers-topic>'
	    }).
	    when('/tijdslijn', {
		      template: '<yourpers-post></yourpers-post>'
	    }).
	    when('/item/:id', {
	    		template: '<yourpers-item></yourpers-item>'
	    }).
	    when('/bundle', {
  		template: '<yourpers-bundle></yourpers-bundle>'
	    }).
	    
	    otherwise('/nieuws');
	
	$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
    
    $provide.decorator('$browser', ['$delegate', function($delegate) {
        var originalUrl = $delegate.url;
        $delegate.url = function() {
            var result = originalUrl.apply(this, arguments);
            if (result && result.replace) {
                result = result.replace(/%23/g, '#');
            }
            return result;
        };
        return $delegate;
    }]);
    
}]);