import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularBootstrap from 'angular-ui-bootstrap';

import modalTemplate from './addArticleModal.html';
import {name as modalCtrl} from './addArticleModal.js';

import template from './addArticle.html';
import style from './addArticle.less';


class AddArticleCtrl {
	
	constructor($rootScope, $scope, $reactive, $uibModal) {
		
		var $ctrl = this;
		$reactive($ctrl).attach($scope);
		
		$ctrl.articleData = null;
		
		$ctrl.$onChanges = function(changes) {
		// Explaination: https://medium.com/front-end-hacking/angularjs-component-binding-types-my-experiences-10f354d4660
			if (changes.data && $ctrl.data) {
				$ctrl.articleData = angular.copy($ctrl.data);	
				$ctrl.articleData.topicId = angular.copy($ctrl.topicId);
			}
		}
		
		$ctrl.open = function () {
			
			console.log($ctrl.articleData)
			
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: modalTemplate,
				controller: 'AddArticleModalCtrl',
				controllerAs: '$ctrl',
				resolve : {
					articleData : function() {return $ctrl.articleData}
				}
			});

			modalInstance.result.then(function (feedback) {
				console.log('do something with: '+feedback);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});

		}
		
	}	
}

export default angular.module('yourpers.addArticle', [
	angularMeteor,
	angularBootstrap,
	modalCtrl
	])
	.component('yourpersAddArticle', {
		templateUrl : template,
		controller: ['$rootScope', '$scope', '$reactive', '$uibModal', AddArticleCtrl],
		bindings: {
			data : '<',
			topicId : '<'
		}
	});