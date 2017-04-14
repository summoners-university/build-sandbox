import _ from 'lodash';
import Config from 'config/general';
import champions from 'services/champions';

export default /*@ngInject*/ function($scope) {
    _.extend(this, {
        reset() {
            $scope.$broadcast('champion.clicked', null);
        }
    });

    _.extend($scope, {
        champions: champions.data
    });

    if(Config.LOAD_LIVE_DATA) {
        champions.loadLiveData()
            .then(data => $scope.champions = data)
            .then(data => console.log('Data loaded from live', data))
            .then(data => $scope.$apply())
    }
};