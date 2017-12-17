import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
 
import template from './authentication.html';
import { name as DisplayNameFilter } from '/imports/filters/displayName';
 
const name = 'authentication';
 
class AuthenticationCtrl {
  constructor($scope, $reactive) {
    'ngInject';
    
    console.log('authentication init');
 
    var $ctrl = this;
	$reactive($ctrl).attach($scope);
	
    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }
  
  login() {
	  Meteor.loginWithLinkedIn({}, (err) => {
		  if (err) {
		    // handle error
		  } else {
		    // successful login!
		  }
		});
  }
 
  logout() {
    Accounts.logout();
  }
}
 
// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  templateUrl: template,
  controller: AuthenticationCtrl
});