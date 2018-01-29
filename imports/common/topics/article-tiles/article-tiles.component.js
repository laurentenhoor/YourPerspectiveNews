import ArticleTilesTemplate from './article-tiles.html';
import ArticleTilesStyle from './article-tiles.styl';

class ArticleTilesComponent {

    constructor($scope, $reactive, $timeout, $topicsApi, $articlesApi) {
        'ngInject';

        let $ctrl = this;
        $reactive($ctrl).attach($scope);

        $topicsApi.setCallbacks({
            addedArticle: (articleId) => {
                console.log("articleAdded", articleId)
                if ($ctrl.topic) {
                    $ctrl.topic = $topicsApi.getById($ctrl.topic._id);
                    Meteor.subscribe('articles', [$ctrl.topic], {
                        onReady: () => {
                            $ctrl.articles = $articlesApi.getByTopic($ctrl.topic)
                        }
                    })
                }
            },
            removedArticle: () => {
                console.log('REMOVED ARTICLE', $ctrl.topic)
                if($ctrl.topic){
                    $ctrl.articles = $articlesApi.getByTopicId($ctrl.topic._id)
                }
            }
        })

        $ctrl.$onChanges = (changes) => {
            if (changes.topic) {
                $ctrl.topic = angular.copy($ctrl.topic);
                $ctrl.articles = $articlesApi.getByTopicId($ctrl.topic._id);
            }
        }

        $ctrl.showDetails = (detailsAreVisible, articleId) => {
            if (detailsAreVisible){
                $articlesApi.countShowDetails(articleId);
            }
        }

        $ctrl.openExternalUrl = function (article) {

            $ctrl.visitedId = article._id; // trigger animation of click
            $timeout(() => $ctrl.visitedId = null, 700); // should be > animation time

            $articlesApi.countVisitExternal(article._id)

            if (article.url && article.url != '') {
                $timeout(() => window.location.href = article.url, 300);
            }

        }

    }

}

export default {
    templateUrl: ArticleTilesTemplate,
    controller: ArticleTilesComponent,
    bindings: {
        topic: '<',
    }
}