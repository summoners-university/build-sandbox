import _ from 'lodash';
import Config from 'config/general';
import masteries from 'services/masteries';

function flatten(trees) {
    return trees.reduce((masteries, tree) => {
        return masteries.concat(
            tree.talents.filter(t => t.points > 0)
        );
    }, []);
}

export default /*@ngInject*/ function($rootScope, $scope) {
    _.extend(this, {
        masteries: masteries.data,

        reset() {
            this.masteries.trees.forEach(tree => masteries.reset(tree));
            this.masteries.points = 0;
            $rootScope.$broadcast('masteries.updated', flatten(this.masteries.trees));
        }
    });
    
    $scope.$on('mastery.attempt.spend', ($event, { mastery, tree, points }) => {
        let changed = masteries.addPoints(this.masteries, { tree, mastery, points });

        if(changed) {
            $scope.$emit('mastery.updated', mastery);
        }
    });

    $scope.$on('mastery.attempt.refund', ($event, { mastery, tree, points }) => {
        let changed = masteries.removePoints(this.masteries, { tree, mastery, points });

        if(changed) {
            $scope.$emit('mastery.updated', mastery);
        }
    });

    $scope.$on('mastery.updated', ($event, mastery) => {
        $rootScope.$broadcast('masteries.updated', flatten(this.masteries.trees));
    });

    if(Config.LOAD_LIVE_DATA) {
        masteries.loadLiveData()
            .then(data => this.masteries = data)
            .then(data => console.log('data loaded from live', data))
            .then(data => $scope.$apply())
    }
};