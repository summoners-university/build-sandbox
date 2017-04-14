import _ from 'lodash';
import analytics, { Pages } from 'services/analytics';

const DEFAULT_TAB = 'champions';
const TABS = {
    'champions': 'champions',
    'runes': 'runes',
    'masteries': 'masteries'
};
const TABS_ANALYTICS = {
    'champions': Pages.CHAMPIONS,
    'masteries': Pages.MASTERIES,
    'runes': Pages.RUNES
};

export default /*@ngInject*/ function($rootScope, $scope, hash) {
    _.extend(this, {
        tab: TABS[hash] || DEFAULT_TAB,

        select(tab) {
            this.tab = tab;
            $rootScope.$broadcast('tab.changed', tab);
            analytics.trackPageView(TABS_ANALYTICS[tab]);
        }
    });

    $rootScope.$broadcast('tab.changed', this.tab);
};