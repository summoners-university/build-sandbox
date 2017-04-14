import _ from 'lodash';
import globals from 'services/globals';

export default /*@ngInject*/ function($scope) {
    _.extend(this, {
        tab: null,

        gameVersion: globals.version
    });

    $scope.$on('tab.changed', (e, tab) => {
        this.tab = tab;
    })
};