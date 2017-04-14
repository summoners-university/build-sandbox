import _ from 'lodash';

export default /*@ngInject*/ function($rootScope, $scope) {
    _.extend(this, {
        select(champion) {
            if($scope.currentChampion != champion) {
                $rootScope.$broadcast('champion.updated', champion);
            }
            $scope.currentChampion = champion;
        }
    });

    $scope.$on('champion.clicked', ($event, champion) => {
        this.select(champion);
    });

    $scope.currentChampion = null;
};