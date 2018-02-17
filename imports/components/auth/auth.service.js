import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMaterial from 'angular-material';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

export default class AuthService {

	constructor($dialog, $loader, $rootScope, $desktopViewer) {
		'ngInject';

		return {
			login: (callback) => {
				
				Meteor.loginWithLinkedIn({
					loginStyle: ($desktopViewer.isDesktop() ? 'popup' : 'redirect')
				}, (error) => {
					if (error) { console.error(error); }
					callback()
				});

			},
			logout: () => {

				ga('send', {
					hitType: 'event',
					eventCategory: 'Account',
					eventAction: 'logout',
					eventLabel: '/user/' + Meteor.userId()
				})

				$loader.startAndWait(() =>
					Accounts.logout(() =>
						$loader.stop()))

			},
			isLoggedIn: () => {

				if (!Meteor.user()) {

					var confirmModal = $dialog.confirm()
						.title('Log in met LinkedIn')
						.textContent(`Wij streven naar eerlijke discussies tussen echte mensen.`)
						.ariaLabel('Log in met LinkedIn')
						.ok('Login')
						.cancel('Annuleren')

					$dialog.show(confirmModal).then(function () {
						login();
						return;
					}, function () {
						console.log('canceled login modal');
					});

					return false;
				} else {
					return true;
				}
			}

		}

	}


}