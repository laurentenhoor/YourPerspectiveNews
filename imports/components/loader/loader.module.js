import angular from 'angular';

import LoaderComponent from './loader.component';
import LoaderService from './loader.service';

export default angular
	.module('Loader', [])
	.component('loader', LoaderComponent)
	.service('$loader', LoaderService)
	.name;