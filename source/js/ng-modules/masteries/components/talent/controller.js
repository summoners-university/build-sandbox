import _ from 'lodash';
import analytics, { EventCategories, EventActions, EventLabels, Dimensions } from 'services/analytics';

export default /*@ngInject*/ function($scope) {
    _.extend(this, {
        total: $scope.$parent.$parent.points,
        
        spend($event, mastery) {
            let points = $event.ctrlKey || $event.metaKey ? mastery.ranks - mastery.points : 1;

            $scope.$emit('mastery.attempt.spend', { mastery, points, tree: $scope.tree });

            analytics.trackEvent({
                category: EventCategories.MASTERY,
                action: EventActions.CLICK,
                label: EventLabels.ADDED,
                dimensions: {
                    [Dimensions.ITEM_ID]: mastery.id
                }
            });
        },

        refund($event, mastery) {
            let points = $event.ctrlKey || $event.metaKey ? mastery.points : 1;

            $scope.$emit('mastery.attempt.refund', { mastery, points, tree: $scope.tree })

            analytics.trackEvent({
                category: EventCategories.MASTERY,
                action: EventActions.CLICK,
                label: EventLabels.REMOVED,
                dimensions: {
                    [Dimensions.ITEM_ID]: mastery.id
                }
            });
        }
    });
};