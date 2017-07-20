import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './loader.html';
import style from './loader.less';

class LoaderCtrl {
	
  constructor($rootScope, $scope, $location) {
	  
	  $rootScope.stateIsLoading = true;
	  
	  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
		  $rootScope.stateIsLoading = true;
		});
	  
	  $rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
		  $rootScope.stateIsLoading = false;
		});
  }

}
 
export default angular.module('allpers.loader', [
  angularMeteor
])
  .component('allpersLoader', {
    templateUrl : template,
    controller: ['$rootScope', '$scope', '$location', LoaderCtrl]
  })
  
.directive('extLink', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      elem.bind('click', function(e) {
    	  	$rootScope.stateIsLoading = true;  
      });
    }
  };
}]);