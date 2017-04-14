import { Stats } from 'services/modifiers';

const StatsBrief = {
    [Stats.HEALTH_POOL.id]: 'Health',
    [Stats.MANA_POOL.id]: 'Mana',
    [Stats.HEALTH_REGEN.id]: 'Health / 5 sec',
    [Stats.MANA_REGEN.id]: 'Mana / 5 sec',
    [Stats.ENERGY_POOL.id]: 'Energy',
    [Stats.ENERGY_REGEN.id]: 'Energy / 5 sec',
    [Stats.ARMOR.id]: 'Armor',
    [Stats.MAGIC_RESIST.id]: 'Magic Resist',
    [Stats.ARMOR_PEN.id]: 'Armor Pen',
    [Stats.MAGIC_PEN.id]: 'Magic Pen',
    [Stats.CDR.id]: 'Cooldowns',
    [Stats.MAGIC_DAMAGE.id]: 'Ability Power',
    [Stats.ATTACK_SPEED.id]: 'Attack Speed',
    [Stats.ATTACK_DAMAGE.id]: 'Attack Damage',
    [Stats.CRIT_CHANCE.id]: 'Crit Chance',
    [Stats.CRIT_DAMAGE.id]: 'Crit Damage',
    [Stats.MOVE_SPEED.id]: 'Move Speed',
    [Stats.LIFE_STEAL.id]: 'Lifesteal',
    [Stats.SPELL_VAMP.id]: 'Spellvamp',
    [Stats.TIME_DEAD.id]: 'Time Dead',
    [Stats.GP10.id]: 'Gold / 10 sec',
    [Stats.PCT_XP.id]: 'XP Gained'
};

export default /* @ngInject */ function(decimalFilter) {
    return (rune) => {
        let mods = rune.mods.filter(mod => !!mod);
        if(mods.length < 1) return rune.name;

        let isHybridPen = mods[0] && mods[1] && mods[0].stat.id == Stats.ARMOR_PEN.id && mods[1].stat.id == Stats.MAGIC_PEN.id;

        if(isHybridPen) {
            return `+${mods[0].value} / ${mods[1].value} hybrid pen`;
        }

        return mods.map(mod => {
            if(!mod.stat) {
                console.error('nostat', rune);
            }
            let percent = mod.percent || mod.stat.percent;
            let amount = (mod.scaling ? mod.value * 18 : mod.value) * (percent ? 100 : 1);
            if([Stats.HEALTH_REGEN.id, Stats.MANA_REGEN.id, Stats.ENERGY_REGEN.id].indexOf(mod.stat.id) > -1) {
                amount *= 5;
            }
            let operator = amount < 0 || mod.stat.id == Stats.TIME_DEAD.id || mod.stat.id == Stats.CDR.id ? '-' : '+';
            let pct = percent ? '%' : '';
            let stat = StatsBrief[mod.stat.id].toLowerCase();
            let at18 = mod.scaling ? '@18' : '';
            return [`${operator}${decimalFilter(amount, 2)}${pct}`, stat, at18].join(' ');
        }).join('& ');
    }
};