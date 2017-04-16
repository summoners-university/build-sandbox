import { mix } from 'lib/objects';
import _ from 'lodash';
import fn from 'fnjs';
import champions from 'services/champions';
import { Stats } from 'services/modifiers';

export default /*@ngInject*/ function($scope, gridStatsFilter) {
    _.extend(this, {
        level: 1,
        basestats: {},
        mods: {},
        stats: gridStatsFilter({}),

        recalculate({ base, mods, level }) {
            let stats = fn.map(base, (stat) => {
                if(stat) {
                    stat.value = stat.values ? champions.calculateStat(stat, stat.values, level) : 0;
                }
                return stat;
            });

            fn.forEach(mods, (mod) => {
                let stat = fn.find(stats, (stat) => stat ? stat.id == mod.stat.id : null);
                if(!stat) {
                    return;
                }

                let value = (mod.scaling ? mod.value * level : mod.value);

                if([Stats.HEALTH_REGEN.id, Stats.MANA_REGEN.id, Stats.ENERGY_REGEN.id].indexOf(mod.stat.id) > -1) {
                    value *= 5;
                }

                let key = stat.id;
                if([Stats.MANA_POOL.id, Stats.ENERGY_POOL.id, Stats.BLOODWELL.id].indexOf(mod.stat.id) > -1) {
                    key = 'RESOURCE';
                }
                if([Stats.MANA_REGEN.id, Stats.ENERGY_REGEN.id].indexOf(mod.stat.id) > -1) {
                    key = 'RESOURCE_REGEN';
                }
                stats[key] = mix(stat, {
                    touched: true,
                    value: stat.value == null ? value : stat.value + value
                });
            });

            return stats;
        }
    });

    $scope.$on('level.updated', ($event, level) => {
        this.level = level;

        this.stats = this.recalculate({ base: this.basestats, mods: this.mods, level: this.level });
    });

    $scope.$on('champion.updated', ($event, champion) => {
        this.basestats = gridStatsFilter(champion ? champion.stats : {});

        this.stats = this.recalculate({ base: this.basestats, mods: this.mods, level: this.level });
    });

    $scope.$on('mods.updated', ($event, modsmap) => {
        this.mods = modsmap;

        this.stats = this.recalculate({ base: this.basestats, mods: this.mods, level: this.level });
    });
};