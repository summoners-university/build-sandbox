import { Stats } from 'services/modifiers';
import { format } from 'lib/strings';

const Templates = {
    DEFAULT: '${value}',
    PCT: '${value}%',

    [Stats.PCT_ARMOR_PEN.id]: '${value}%',
    [Stats.PCT_MAGIC_PEN.id]: '${value}%',
    [Stats.LIFE_STEAL.id]: '${value}%',
    [Stats.SPELL_VAMP.id]: '${value}%',
    [Stats.CRIT_CHANCE.id]: '${value}%',
    [Stats.CDR.id]: '${value}%'
};

function populated(stat) {
    return stat && (stat.value != null);
}

export default /* @ngInject */ function(decimalFilter) {
    return (stat) => {
        return populated(stat) ? format(Templates[stat.id] || Templates.DEFAULT, {
            value: decimalFilter(stat.value * (stat.percent ? 100 : 1), stat.decimals) || 0
        }) : '';
    }
};