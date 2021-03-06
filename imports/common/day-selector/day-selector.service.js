export default class DaySelectorService {

    constructor($auth, $state, $timeout) {
        'ngInject';

        this.$auth = $auth;
        this.$state = $state;
        this.$timeout = $timeout;

        // this.selectedDate = new Date();
        this.selectedDate = new Date("2018/04/13 18:00");
        this.singleTopicMode = false;

        if (this.selectedDate.getHours() < 15) {
            // console.log('Het is nog geen 15:00, dus nog geen nieuwe onderwerpen voor vandaag!');
            this.yesterday();
        }
        this.today = new Date(this.selectedDate);

        this.selectedDate.setUTCHours(12);
        this.selectedDate.setUTCMinutes(0);
        this.selectedDate.setUTCSeconds(0);
        this.selectedDate.setUTCMilliseconds(0);

        this.minDate = null;
        this.maxDate = null;
        this.calculateRange();
    }
    
    isBeforePublishTime() {
        return (this.selectedDate.getHours() < 15)
    }

    initSingleTopicMode() {
        this.singleTopicMode = true;
        console.log('this.singleTopicMode', this.singleTopicMode)
    }

    exitSingleTopicMode() {
        this.singleTopicMode = false;
        this.$state.go('topics', {});
        console.log('this.singleTopicMode', this.singleTopicMode)
    }

    nextDayButtonHidden() {
        if (this.$auth.isAdmin()) {
            return false;
        }
        return this.selectedDate.getMonth() == this.today.getMonth() && this.selectedDate.getDate() == this.today.getDate();
    }

    tomorrow() {
        this.selectedDate.setDate(this.selectedDate.getDate() + 1);
        this.calculateRange();
    }

    yesterday() {
        this.selectedDate.setDate(this.selectedDate.getDate() - 1);
        this.calculateRange();
    }

    calculateRange() {
        this.minDate = new Date(this.selectedDate.getTime() - 12 * 60 * 60 * 1000).getTime();
        this.maxDate = new Date(this.selectedDate.getTime() + 12 * 60 * 60 * 1000).getTime();
    }

}