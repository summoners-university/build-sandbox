import fn from 'fnjs';
import { Types as RuneTypes } from 'services/runes';
import analytics, { EventCategories, EventActions, EventLabels } from 'services/analytics';

function slotOpen(runes, rune) {
    let max = rune.type == RuneTypes.QUINT ? 3 : 9;
    return runes[rune.type].filter(r => !!r).length < max;
}

function flatten(runes) {
    return Object.keys(runes).reduce((r, key) => r.concat(runes[key]), []).filter(r => !!r);
}

export default /*@ngInject*/ function($rootScope, $scope) {
    
    _.extend(this, {
        runes: {
            [RuneTypes.MARK]: [],
            [RuneTypes.SEAL]: [],
            [RuneTypes.GLYPH]: [],
            [RuneTypes.QUINT]: []
        },

        refund($event, rune, index) {
            let runes = this.runes[rune.type];
            let count = 1;
    
            runes[index] = null;
    
            if($event.metaKey || $event.ctrlKey) {
                for(let i = 0; i < runes.length; i++) {
                    let r = runes[i];
                    if(!r) continue;
                    if(r.id == rune.id) {
                        count++;
                        runes[i] = null;
                    }
                }
            }

            analytics.trackEvent({
                category: EventCategories.RUNE,
                action: EventActions.CLICK,
                label: EventLabels.REMOVED,
                value: rune.id
            });
    
            $rootScope.$broadcast('rune.refunded', rune, count);
            $rootScope.$broadcast('runes.updated', flatten(this.runes));
        },

        reset() {
            let runes = flatten(this.runes)
                .reduce((runes, rune) => {
                    if(runes[rune.id]) {
                        runes[rune.id].count++;
                    } else {
                        runes[rune.id] = {
                            rune: rune,
                            count: 1
                        }
                    }
                    return runes;
                }, {});

            fn.forEach(runes, runemeta => {
                $rootScope.$broadcast('rune.refunded', runemeta.rune, runemeta.count);
            });

            this.runes = {
                [RuneTypes.MARK]: [],
                [RuneTypes.SEAL]: [],
                [RuneTypes.GLYPH]: [],
                [RuneTypes.QUINT]: []
            };

            $rootScope.$broadcast('runes.updated', flatten(this.runes));
        }
    });
    
    $scope.$on('rune.clicked', ($event, rune, max) => {
        while(rune.quantity > 0 && slotOpen(this.runes, rune)) {
            let index = this.runes[rune.type].findIndex(r => !r);
            if(index > -1) {
                this.runes[rune.type][index] = rune;
            } else {
                this.runes[rune.type].push(rune);
            }

            rune.quantity--;

            if(!max) break;
        }

        $rootScope.$broadcast('runes.updated', flatten(this.runes));
    });
};