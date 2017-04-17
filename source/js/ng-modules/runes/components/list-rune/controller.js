import _ from 'lodash';
import analytics, { EventCategories, EventActions, EventLabels, Dimensions } from 'services/analytics';

export default /*@ngInject*/ function($rootScope, $scope) {
    _.extend(this, {
        select($event, rune) {
            $rootScope.$broadcast('rune.clicked', rune, $event.metaKey || $event.ctrlKey);
            analytics.trackEvent({
                category: EventCategories.RUNE,
                action: EventActions.CLICK,
                label: EventLabels.ADDED,
                dimensions: {
                    [Dimensions.ITEM_ID]: rune.id
                }
            });
        },

        showTooltip($event) {
            let bounds = $event.delegateTarget.getBoundingClientRect();
            $scope.$broadcast('tooltip.show', bounds);
        },

        hideTooltip() {
            $scope.$broadcast('tooltip.hide');
        }
    });
};