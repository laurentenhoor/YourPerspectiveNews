import SummaryTileTemplate from './summary-tile.html';
import SummaryTileStyle from './summary-tile.styl';

class SummaryTileComponent {

    constructor($reactive, $scope, $articlesApi, $topicsApi, $opinionsApi, $commentsApi, $timeout, $autoScroll, $auth, $writeOpinionDialog) {
        'ngInject';
        var $ctrl = this;
        $reactive($ctrl).attach($scope);

        $ctrl.showSummary = true;

        $ctrl.$onChanges = (changes) => {
            if (changes.topic) {
                $ctrl.topic = angular.copy($ctrl.topic)
                divideArticles();       
            }
            if (changes.showDetails) {
                $ctrl.detailsAreShown = angular.copy($ctrl.showDetails)
            }
        }

        $topicsApi.setCallbacks({
            addedArticle: (articleId) => {
                if ($ctrl.topic) {
                    $ctrl.topic = $topicsApi.getById($ctrl.topic._id);
                    Meteor.subscribe('articles', [$ctrl.topic], {
                        onReady: () => {
                            divideArticles();
                        }
                    })
                }
            },
            removedArticle: () => {
                $ctrl.topic = $topicsApi.getById($ctrl.topic._id);
                if($ctrl.topic){
                    divideArticles();
                }
            }
        })


        $ctrl.helpers({
            amountOfQuestions : () => {
                let questions = $commentsApi.getAllByTopic($ctrl.getReactively('topic'));
                if (questions) {
                    return questions.length;
                }
                return null;
            },
            amountOfOpinions : () => {
                let opinions = $opinionsApi.getAllByTopic($ctrl.getReactively('topic'));
                if (opinions) {
                    return opinions.length;
                }
                return null;
            }
        }); 

        const divideArticles = () => {
            
            $ctrl.articles = $articlesApi.getByTopic($ctrl.topic);
            
            let rootArticles = $articlesApi.getRootArticles($ctrl.topic)
            let otherArticles = $articlesApi.getOtherArticles($ctrl.topic)

            if (rootArticles.length > 0) {
                $ctrl.mainArticle = rootArticles[0];
                $ctrl.otherArticle = otherArticles[0];
            } else {
                $ctrl.mainArticle = otherArticles[0];
                $ctrl.otherArticle = otherArticles[1];
            }
        }

        $ctrl.writeOpinion = function ($event) {
            if ($auth.isLoggedIn()) {
                $writeOpinionDialog.show($event, $ctrl.topic._id);
            }
        }

        $ctrl.scrollToOpinion = function(topicId) {
            openTopic();
            $timeout(()=>{
                $autoScroll.horizontalScroll('opinion-' + topicId, 'scroll-' + topicId);
            },400)
        }


        $ctrl.scrollToArticle = function (articleId, topicId, $event) {
            openTopic();            
            $timeout(()=>{
                $autoScroll.horizontalScroll('topic-' +topicId + '-article-' + articleId, 'scroll-' + topicId);
            },400)
            
        }

        $ctrl.scrollToQuestions = function (topicId) {
            openTopic();
            $timeout(()=>{
                $autoScroll.horizontalScroll('discuss-' + topicId, 'scroll-' + topicId);
            },400)
        }

        function openTopic() {
            $topicsApi.countOpen($ctrl.topic._id);
            $ctrl.detailsAreShown = true;
            $ctrl.onShowDetails({$event: {showDetails: $ctrl.detailsAreShown}});
        }

    }

}

export default {
    templateUrl: SummaryTileTemplate,
    controller: SummaryTileComponent,
    bindings: {
        topic: '<',
        showDetails: '<',
        onShowDetails: '&',
    }
}