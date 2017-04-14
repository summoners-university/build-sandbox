import { Stats } from 'services/modifiers';

const StatDescriptions = {
    [Stats.HEALTH_POOL.id]: 'Health',
    [Stats.MANA_POOL.id]: 'Mana',
    [Stats.HEALTH_REGEN.id]: 'Health Regeneration (per 5 sec)',
    [Stats.MANA_REGEN.id]: 'Mana Regeneration (per 5 sec)',
    [Stats.ENERGY_POOL.id]: 'Energy',
    [Stats.ENERGY_REGEN.id]: 'Energy Regeneration (per 5 sec)',
    [Stats.ARMOR.id]: 'Armor',
    [Stats.MAGIC_RESIST.id]: 'Magic Resistance',
    [Stats.ARMOR_PEN.id]: 'Armor Penetration',
    [Stats.MAGIC_PEN.id]: 'Magic Penetration',
    [Stats.PCT_ARMOR_PEN.id]: 'Armor Penetration (%)',
    [Stats.PCT_MAGIC_PEN.id]: 'Magic Penetration (%)',
    [Stats.CDR.id]: 'Cooldown Reduction',
    [Stats.MAX_CDR.id]: 'Maximum CDR',
    [Stats.MAGIC_DAMAGE.id]: 'Ability Power',
    [Stats.ATTACK_SPEED.id]: 'Attack Speed',
    [Stats.ATTACK_DAMAGE.id]: 'Attack Damage',
    [Stats.CRIT_CHANCE.id]: 'Critical Chance',
    [Stats.CRIT_DAMAGE.id]: 'Critical Damage',
    [Stats.MOVE_SPEED.id]: 'Movement Speed',
    [Stats.LIFE_STEAL.id]: 'Life Steal',
    [Stats.SPELL_VAMP.id]: 'Spell Vampirism',
    [Stats.TIME_DEAD.id]: 'Time Spent Dead',
    [Stats.GP10.id]: 'Gold per 10 sec',
    [Stats.PCT_XP.id]: 'Experience Gained',
    [Stats.ABILITY_DAMAGE.id]: 'Ability Damage',
    [Stats.TENACITY.id]: 'Tenacity',
    [Stats.DAMAGE_TAKEN.id]: 'Damage Taken',
    [Stats.DAMAGE_DEALT.id]: 'Damage Dealt'
};

export default /* @ngInject */ function(decimalFilter) {
    return (mod, prop) => {
        if(prop == 'name') {
            return StatDescriptions[mod.stat.id] + (mod.scaling ? ' (at Level 18)' : '');
        }

        if(prop == 'value') {
            let percent = mod.percent || mod.stat.percent;
            let valuePerLevel = mod.value * (percent ? 100 : 1);
            let value = (mod.scaling ? valuePerLevel * 18 : valuePerLevel);

            if([Stats.HEALTH_REGEN.id, Stats.MANA_REGEN.id, Stats.ENERGY_REGEN.id].indexOf(mod.stat.id) > -1) {
                value *= 5;
                valuePerLevel *= 5;
            }

            let perLevelText = (mod.scaling ? `(${decimalFilter(valuePerLevel, 2)} per level)` : '');

            let operator = value < 0 || mod.stat.id == Stats.TIME_DEAD.id ? '-' : '+';

            let pct = percent ? '%' : '';

            return `${operator}${decimalFilter(value, 2)}${pct} ${perLevelText}`;
        }
    }
};