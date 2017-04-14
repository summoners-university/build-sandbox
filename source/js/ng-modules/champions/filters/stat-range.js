import fn from 'fnjs';
import champions from 'services/champions';

export default /*@ngInject*/ function(decimalFilter) {
    return (stat) => {
        if(!stat) return '';

        let lvl1 = decimalFilter(champions.calculateStat(stat, stat.values, 1), stat.decimals);
        let lvl18 = decimalFilter(champions.calculateStat(stat, stat.values, 18), stat.decimals);

        return stat.values.growth ? `${lvl1} - ${lvl18}` : `${lvl1}`;
    }
}