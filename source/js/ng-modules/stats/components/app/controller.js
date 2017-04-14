import { mix } from 'lib/objects';
import _ from 'lodash';

const ModSources = {
    RUNES: 'runes',
    MASTERIES: 'masteries'
};

export default /*@ngInject*/ function($scope) {
    _.extend(this, {
        level: 1,
        levels: Array.from({ length: 18 }, (v, i) => i + 1),
        rawmods: [],
        modsmap: [],

        update(array, source, transform = mod => mod) {
            let modlist = array.length == 0 ? [] : array
                .map(item => {
                    return item.mods.reduce((mods, mod) => {
                        mod = mix(mod, { source });
                        return mods.concat([ transform(mod, item) ]);
                    }, []);
                })
                .reduce((all, one) => all.concat(one), []);

            this.rawmods = this.rawmods
                .filter(mod => mod.source != source)
                .concat(modlist);

            this.modsmap = this.rawmods
                .reduce((mods, mod) => {
                    if(!mods[mod.id]) {
                        mods[mod.id] = mix({}, mod);
                    } else {
                        mods[mod.id].value += mod.value;
                    }
                    return mods;
                }, {});
            
            $scope.$broadcast('mods.updated', this.modsmap);
        },

        updateLevel(level) {
            this.level = level;

            $scope.$broadcast('level.updated', this.level);
        }
    });

    $scope.$on('runes.updated', ($event, runes) => {
        this.update(runes, ModSources.RUNES);
    });

    $scope.$on('masteries.updated', ($event, masteries) => {
        this.update(masteries, ModSources.MASTERIES, (mod, mastery) => {
            return mix(mod, { value: mod.value * mastery.points })
        });
    });
};