import _ from 'lodash';
import runes, { Types as RuneTypes } from 'services/runes';

let tier3 = runes.data
    .filter(rune => rune.tier == 3)
    .map(rune => _.extend(rune, {
        quantity: rune.type == RuneTypes.QUINT ? 3 : 9,
        cost: 420
    }));

export default /*@ngInject*/ function($scope) {
    _.extend(this, {
        groups: [
            {
                name: 'Marks',
                expanded: false
            },
            {
                name: 'Seals',
                expanded: false
            },
            {
                name: 'Glyphs',
                expanded: false
            },
            {
                name: 'Quintessences',
                expanded: false
            }
        ],

        runes: {
            'Marks': tier3.filter(rune => rune.type == RuneTypes.MARK),
            'Seals': tier3.filter(rune => rune.type == RuneTypes.SEAL),
            'Glyphs': tier3.filter(rune => rune.type == RuneTypes.GLYPH),
            'Quintessences': tier3.filter(rune => rune.type == RuneTypes.QUINT)
        },

        toggle($event, group) {
            group.expanded = !group.expanded;
        }
    });

    $scope.$on('rune.refunded', ($event, refundedRune, count) => {
        let runes = this.runes[refundedRune.type+'s'];
        let rune = runes.find(r => r.id == refundedRune.id);
        rune.quantity += count;
    });
};