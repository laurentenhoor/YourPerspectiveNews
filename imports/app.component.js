import angular from 'angular';
import angularMeteor from 'angular-meteor';

import appTemplate from './app.html';
import appStyle from './app.styl';

class AppComponent {
	
	constructor($scope, $reactive, $window, $document, $timeout, $firstUseToast, $firstUseDialog) {
		'ngInject';
		
		console.log('init AppCtrl');
		
		let $ctrl = this;
		$reactive($ctrl).attach($scope);
		
		$ctrl.showMobile = false;
		
		angular.element($window).bind('resize', function(){
			$scope.$apply(function() {
				checkWindowSize();	
			});
		});
		
		function checkWindowSize() {
			
			var windowSize = $window.innerWidth;
			
			if (windowSize < 600) {
				$ctrl.showMobile = true;
			} else {
				$ctrl.showMobile = false;
			};
		
		}
		
		checkWindowSize();

		$timeout(() => $firstUseDialog.show(), 1000)
	
	}
}

export default {
	controller: AppComponent,
	templateUrl : appTemplate
  };