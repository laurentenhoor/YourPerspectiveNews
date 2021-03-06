import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import angularMaterial from 'angular-material';
import angularMaterialStyle from '/node_modules/angular-material/angular-material.css';

import componentsModule from './components/components.module'
import commonModule from './common/common.module'
// import deprecatedModule from './deprecated/deprecated.module'

import appComponent from './app.component';

angular.module('yourpers', [
	
	angularMeteor,
	angularMaterial,
	uiRouter,

	componentsModule,
	commonModule,
	// deprecatedModule,
	
])

.component('yourpersApp', appComponent)

.config(($locationProvider, $sceDelegateProvider, $urlRouterProvider, $qProvider, $mdThemingProvider) => {
	'ngInject';

	$locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
	$sceDelegateProvider.resourceUrlWhitelist(['**']);
	$urlRouterProvider.otherwise('/');
	$qProvider.errorOnUnhandledRejections(false);

	$mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('red');
})

_ = lodash;