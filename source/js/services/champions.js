import raw from 'data/7.6.1/champions';
import globals from 'services/globals';
import ddragon, { DataTargets } from 'services/ddragon';
import { Stats } from 'services/modifiers';
import transform from 'transformers/champions';

export default {
    data: transform(raw),

    loadLiveData() {
        return ddragon.fetchData(globals.version, DataTargets.CHAMPIONS)
            .then(rawdata => transform(rawdata))
            .then(data => this.data = data)
    },

    calculateAttackSpeed(offset) {
        return 0.625 / (1 + offset);
    },

    calculateStat(stat, { base, growth }, level) {
        if(!growth) return base;
        let value = base + growth * (level - 1) * (0.685 + 0.0175 * level);
        return stat.id == Stats.ATTACK_SPEED.id ? this.calculateAttackSpeed(base) * (1 + value / 100) : value;
    }
};