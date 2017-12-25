import angular from 'angular';
import angularMeteor from 'angular-meteor';

var name = "httpPrefix";

export default angular.module(name, [
	angularMeteor
	]).directive('httpPrefix', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {

                console.log(controller);

                function ensureHttpPrefix(value) {

                    console.log('ensure httpPrefix')

                    // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
                    if(value && !/^(https?):\/\//i.test(value)
                       && 'http://'.indexOf(value) !== 0 && 'https://'.indexOf(value) !== 0 ) {
                        controller.$setViewValue('http://' + value);
                        controller.$render();
                        
                        return 'http://' + value;
                    }
                    else
                        return value;
                }
                controller.$formatters.push(ensureHttpPrefix);
                controller.$parsers.splice(0, 0, ensureHttpPrefix);
            }
        }});