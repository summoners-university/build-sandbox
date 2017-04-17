import _ from 'lodash';
import analytics, { EventCategories, EventActions, Dimensions } from 'services/analytics';

export default /*@ngInject*/ function($rootScope, $scope) {
    _.extend(this, {
        select(champion) {
            $scope.$emit('champion.clicked', champion);
            analytics.trackEvent({
                category: EventCategories.CHAMPION,
                action: EventActions.CLICK,
                dimensions: {
                    [Dimensions.ITEM_ID]: champion.id
                }
            });
        }
    });
};