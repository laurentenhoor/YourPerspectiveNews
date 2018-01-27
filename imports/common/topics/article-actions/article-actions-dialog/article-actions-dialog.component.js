export default class ArticleActionsComponent {

	constructor($loader, $scope, $reactive, $document, $autoScroll, $dialog, $metadata, topicId, article, $articlesApi) {
		'ngInject';

		var $ctrl = this;
		$reactive($ctrl).attach($scope);

		$ctrl.topicId = topicId;
		$ctrl.article = article;

		if ($ctrl.article) {

			$ctrl.mode = 'edit_source';

			$ctrl.headerText = 'Wijzig deze bron.';
			$ctrl.headerSubText = 'Verander de categorie of verwijder deze bron.';
			$ctrl.urlDataIsLoaded = true;

			$ctrl.initialCategory = angular.copy($ctrl.article.category);


		} else if (!$ctrl.topicId) {

			$ctrl.mode = 'new_topic';

			$ctrl.headerText = 'Maak een nieuw(s) item.';
			$ctrl.headerSubText = 'Plaats een onderwerp dat nog niet door ons wordt besproken.';
			$ctrl.urlDataIsLoaded = false;


		} else if ($ctrl.topicId) {

			$ctrl.mode = 'add_source_to_topic';

			$ctrl.headerText = 'Voeg een bron toe.';
			$ctrl.headerSubText = 'Verbreed, verdiep of ontwricht dit onderwerp met een interessant artikel.';
			$ctrl.urlDataIsLoaded = false;

		} else {

			console.error('Could not succesfully load the modal: the requested inputs are not provided!');

		}

		$ctrl.urlChange = function () {
			
			console.log('Url input changed to:', $ctrl.article.url);
			
			$metadata.getArticleFromUrl($ctrl.article.url, (error, article) => {

				if (error) {
					console.error(error);
					return;
				}
				console.log(article);
				
				$ctrl.article = article;
				$ctrl.urlDataIsLoaded = true;				
				
			})
		}

		$ctrl.ok = function () {

			console.log($ctrl.article)
			$ctrl.article.category = $ctrl.modifiedCategory;
			
			switch ($ctrl.mode) {
				case 'add_source_to_topic':
					console.log('add_source_to_topic')
					$articlesApi.addToTopic($ctrl.topicId, $ctrl.article);
					// 	$autoScroll.scrollToTop();
					break;
				case 'new_topic':
					console.log('new topic')
					$articlesApi.addToNewTopic($ctrl.article)
					break;
				case 'edit_source':
					console.log('edit')
					$articlesApi.updateArticle($ctrl.article)
					break;
			}
			$dialog.hide();

		};

		$ctrl.searchTextChange = function (text) {
			console.log('Text changed to ' + text);
			$ctrl.modifiedCategory = text;			
		}

		$ctrl.selectedItemChange = function (item) {
			console.log('Item changed to ' + JSON.stringify(item));
			if (item) {
				$ctrl.searchTextChange(item.display);
			}
		}

		$ctrl.clearFieldAtFirstFocusOnly = function () {

			if ($ctrl.initialCategory == $ctrl.searchText) {
				$ctrl.searchText = '';
			}

		}

		$ctrl.cancel = function () {
			console.log('mdDialog $ctrl.cancel()')
			$dialog.cancel();
		}


		$ctrl.showRemovalConfirmation = function (ev) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $dialog.confirm()
				.title('Weet je het zeker?')
				.textContent('Dit artikel zal definitief worden verwijderd.')
				.ariaLabel('Verwijderen')
				.targetEvent(ev)
				.ok('Verwijderen')
				.cancel('Annuleren');

			$dialog.show(confirm).then(function () {
				console.log('dialog confirmed, will remove item')
				$articlesApi.removeFromTopic($ctrl.topicId, $ctrl.article._id)
			}, function () {
				// do nothing.
				console.log('canceled article removal');
			});
		};

		$ctrl.loadAll = function () {
			var map = ('Algemene berichtgeving, Andere kijk, Entertainment').split(/, +/g).map(function (state) {
				return {
					value: state.toLowerCase(),
					display: state
				};
			});
			// console.log(map)
			return map;
		}

		$ctrl.categories = $ctrl.loadAll();

		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);

			return function filterFn(state) {
				return (state.value.indexOf(lowercaseQuery) === 0);
			};

		}

		$ctrl.querySearch = function (query) {

			console.log('query: ' + query);
			console.log($ctrl.categories);

			var results = query ? $ctrl.categories.filter(createFilterFor(query)) : $ctrl.categories,
				deferred;

			console.log(results);

			return results;

		}

	}

}