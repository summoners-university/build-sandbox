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

    ARMOR: Stats.ARMOR,

    MAGIC_RESIST: Stats.MAGIC_RESIST,

    ATTACK_DAMAGE: Stats.ATTACK_DAMAGE,

    ATTACK_SPEED: Stats.ATTACK_SPEED,

    ATTACK_RANGE: Stats.ATTACK_RANGE,

    MOVE_SPEED: Stats.MOVE_SPEED
};


export default /*@ngInject*/ function () {
    return (champion) => {
        if(!champion.stats) {
            console.error('nochampstats', champion);
        }

        return fn.map(PreviewStats, (previewStat) => {
            let stat = null;
            
            if(Array.isArray(previewStat)) {
                stat = previewStat
                    .map(stat => champion.stats[stat.id])
                    .filter(stat => !!stat)
                    [0];
            } else {
                stat = champion.stats[previewStat.id]
            }

            return stat;
        });
    }
}