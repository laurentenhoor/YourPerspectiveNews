import DebateTileTemplate from './debate-tile.html';
import DebateTileStyle from './debate-tile.styl';

class DebateTileComponent {
    constructor($scope, $reactive, $questionsApi, $usersApi, $auth, $timeout, $shareDialog) {
        'ngInject';

        var $ctrl = this;
        $reactive($ctrl).attach($scope);

        $ctrl.newQuestion = '';

        $ctrl.$onChanges = (changes) => {
            if (changes.topic && $ctrl.topic) {
                console.log('debate tile for topic:', $ctrl.topic);
            }
        }

        $ctrl.helpers({
            questions: () => {
                let topic = $ctrl.getReactively('topic')
                if (!topic) {
                    return;
                }
                return $questionsApi.getAllByTopic($ctrl.getReactively('topic'));
            },
            userId: () => {
                return Meteor.userId()
            }
        })

        $ctrl.deleteById = (questionId) => {
            $questionsApi.deleteById(questionId);
            $ctrl.questions = $questionsApi.getAllByTopic($ctrl.topic);
        }

        $ctrl.saveQuestion = () => {
            if (!$ctrl.newQuestion || $ctrl.newQuestion == "") {
                console.warn('No question input')
                return;
            }
            $questionsApi.saveQuestion($ctrl.topic, $ctrl.newQuestion, (error) => {
                if (!error) {
                    $ctrl.newQuestion = '';
                }
            });
        }

        $ctrl.user = (userId) => {
            return $usersApi.getUser(userId);
        }

        $ctrl.saveAnswer = (question, answer) => {
            if (!answer || answer == '') {
                console.warn('No answer input')
                return;
            }
            $questionsApi.saveAnswer(question, answer, (error) => {
                $timeout(() => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    $ctrl.questions = $questionsApi.getAllByTopic($ctrl.topic);
                })

            });
        }

        $ctrl.findExpert = () => {
            $shareDialog.show();
        }

        $ctrl.answers = (questionId) => {
            console.log('get answers for question', questionId)
            let answers = $questionsApi.getAnswers(questionId);
            console.log('answers found', answers)
            return answers;
        }
    }
}

export default {
    templateUrl: DebateTileTemplate,
    controller: DebateTileComponent,
    bindings: {
        topic: '<'
    }
}