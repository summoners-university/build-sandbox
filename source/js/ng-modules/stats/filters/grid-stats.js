import fn from 'fnjs';
import { Stats } from 'services/modifiers';

const PreviewStats = {
    HEALTH: Stats.HEALTH_POOL,

    RESOURCE: [
        Stats.MANA_POOL,
        Stats.ENERGY_POOL,
        Stats.BLOODWELL
    ],

    HEALTH_REGEN: Stats.HEALTH_REGEN,

    RESOURCE_REGEN: [
        Stats.MANA_REGEN,
        Stats.ENERGY_REGEN
    ],

    ARMOR_PEN: Stats.ARMOR_PEN,

    MAGIC_PEN: Stats.MAGIC_PEN,

    PCT_ARMOR_PEN: Stats.PCT_ARMOR_PEN,

    PCT_MAGIC_PEN: Stats.PCT_MAGIC_PEN,

    LIFE_STEAL: Stats.LIFE_STEAL,

    SPELL_VAMP: Stats.SPELL_VAMP,

    ATTACK_RANGE: Stats.ATTACK_RANGE,

    TENACITY: Stats.TENACITY,

    ATTACK_DAMAGE: Stats.ATTACK_DAMAGE,

    MAGIC_DAMAGE: Stats.MAGIC_DAMAGE,

    ARMOR: Stats.ARMOR,

    MAGIC_RESIST: Stats.MAGIC_RESIST,

    ATTACK_SPEED: Stats.ATTACK_SPEED,

    CDR: Stats.CDR,

    CRIT_CHANCE: Stats.CRIT_CHANCE,

    MOVE_SPEED: Stats.MOVE_SPEED
};

export default /*@ngInject*/ function () {
    return (stats) => {
        return fn.map(PreviewStats, (stat) => {
            if (Array.isArray(stat)) {
                stat = stat
                    .map(stat => stats[stat.id])
                    .filter(stat => !!stat)
                    [0];
            } else if(stats[stat.id]) {
                stat = stats[stat.id]
            }

            return stat;
        });
    }
}