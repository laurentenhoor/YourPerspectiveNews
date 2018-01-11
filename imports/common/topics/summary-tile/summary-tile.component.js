import SummaryTileTemplate from './summary-tile.html';
import SummaryTileStyle from './summary-tile.styl';

class SummaryTileComponent {

    constructor($reactive, $scope, $articlesApi, $opinionsApi, $commentsApi, $timeout, $autoScroll, $auth, $writeOpinionDialog, $dialog) {
        'ngInject';
        var $ctrl = this;
        $reactive($ctrl).attach($scope);

        $ctrl.showSummary = true;

        $ctrl.$onChanges = (changes) => {
            if (changes.topic) {
                $ctrl.topic = angular.copy($ctrl.topic)

                $ctrl.topic.articlesByCategory = _.sortBy($ctrl.topic.articlesByCategory, 'sortingOrder', 'desc');

                _.each($ctrl.topic.articlesByCategory, (categoryBlock, i) => {
                    if (categoryBlock && categoryBlock.articleIds && categoryBlock.articleIds.length == 0) {
                        // remove empty categories: should we do this on db level? 
                        // Risk if we ever change the 'articleIds' name
                        $ctrl.topic.articlesByCategory.splice(i, 1);
                    }
                });
                
                $ctrl.helpers({
                    bestArticle: () => {
                        return _.maxBy(
                            $articlesApi.getAllByTopic($ctrl.topic),
                            'score'
                        );
                    },
                    articlesByCategory: () => {
                        var topic = $ctrl.getReactively('topic')
                        
                        _.each(topic.articlesByCategory, (categoryBlock, i) => {
                            topic.articlesByCategory[i].articles = _.orderBy($articlesApi.getByIds(categoryBlock.articleIds), 'createdAt', 'desc');
                        })
                        // console.log('categories', topic.articlesByCategory)
                        var length = topic.articlesByCategory[0].articles.length;
                        $ctrl.topicImageUrl = topic.articlesByCategory[0].articles[0].imageUrl;
                        return topic.articlesByCategory
                    },
                    bestOpinion: () => {
                        var opinions = $opinionsApi.getAllByTopic($ctrl.topic);
                        var bestOpinion = _.maxBy(opinions,'score');
                        // console.log('bestOpinion', bestOpinion)
                        return bestOpinion;
                    },
                    bestQuestion: () => {
                        let bestQuestion = $commentsApi.getBestCommentByTopic($ctrl.topic);
                        // console.log('bestQuestion', bestQuestion);
                        return bestQuestion;
                    },
                    amountOfQuestions : () => {
                        let questions = $commentsApi.getAllByTopic($ctrl.topic);
                        return questions.length;
                    },
                    amountOfOpinions : () => {
                        let opinions = $opinionsApi.getAllByTopic($ctrl.topic);
                        return opinions.length;
                    }
                });

            }
            if (changes.showDetails) {
                $ctrl.detailsAreShown = angular.copy($ctrl.showDetails)
            }
        }

        $ctrl.gotoCategory = function (index, topicId, $event) {
            console.log('scrollToCategory:', index, topicId);
            console.log($ctrl.topic.articlesByCategory)
            
            $ctrl.detailsAreShown = true;
            $ctrl.onShowDetails({$event: {showDetails: $ctrl.detailsAreShown}});

            $timeout(()=>{
                $autoScroll.horizontalScroll('category-' + index + '-' + topicId, 'scroll-' + topicId);
            },400)
            
        }

        $ctrl.discuss = function (topicId) {
            $ctrl.detailsAreShown = true;
            $ctrl.onShowDetails({$event: {showDetails: $ctrl.detailsAreShown}});

            $timeout(()=>{
                $autoScroll.horizontalScroll('discuss-' + topicId, 'scroll-' + topicId);
            },400)
           
        }

        $ctrl.writeOpinion = function ($event) {
            if ($auth.isLoggedIn()) {
                $writeOpinionDialog.show($event, $ctrl.topic._id);
            }
        }

        $ctrl.readOpinion = function(topicId) {
            $ctrl.detailsAreShown = true;
            $ctrl.onShowDetails({$event: {showDetails: $ctrl.detailsAreShown}});

            $timeout(()=>{
                $autoScroll.horizontalScroll('opinion-' + topicId, 'scroll-' + topicId);
            },400)
        }

        $ctrl.makeDetailsVisible = function() {
            console.log('showDetails')
            if ($ctrl.detailsAreShown) {
                $ctrl.detailsAreShown = false;
            } else {
                $ctrl.detailsAreShown = true;
            }
            
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