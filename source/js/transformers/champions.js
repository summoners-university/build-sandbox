import fn from 'fnjs';
import { mix } from 'lib/objects';
import { Mods, Resources } from 'services/modifiers';

const ResourceMappings = {
    'MP': Resources.MANA,
    'Mana': Resources.MANA,
    'Energy': Resources.ENERGY,
    'BloodWell': Resources.BLOODWELL,
    'Rage': Resources.RAGE
};

const ResourceStats = ['mp', 'mpperlevel', 'mpregen', 'mpregenperlevel'];

const ChampionStatMods = {
    'hp': Mods.FLAT_HP_POOL,
    'hpperlevel': Mods.SCALING_HP_POOL,
    'mp': {
        [Resources.MANA]: Mods.FLAT_MP_POOL,
        [Resources.ENERGY]: Mods.FLAT_ENERGY_POOL,
        [Resources.BLOODWELL]: Mods.FLAT_BLOODWELL
    },
    'mpperlevel': {
        [Resources.MANA]: Mods.SCALING_MP_POOL,
        [Resources.ENERGY]: Mods.SCALING_ENERGY_POOL,
        [Resources.BLOODWELL]: Mods.SCALING_BLOODWELL
    },
    'movespeed': Mods.FLAT_MOVE_SPEED,
    'armor': Mods.FLAT_ARMOR,
    'armorperlevel': Mods.SCALING_ARMOR,
    'spellblock': Mods.FLAT_MR,
    'spellblockperlevel': Mods.SCALING_MR,
    'attackrange': Mods.FLAT_ATTACK_RANGE,
    'hpregen': Mods.FLAT_HP_REGEN,
    'hpregenperlevel': Mods.SCALING_HP_REGEN,
    'mpregen': {
        [Resources.MANA]: Mods.FLAT_MP_REGEN,
        [Resources.ENERGY]: Mods.FLAT_ENERGY_REGEN
    },
    'mpregenperlevel': {
        [Resources.MANA]: Mods.SCALING_MP_REGEN,
        [Resources.ENERGY]: Mods.SCALING_ENERGY_REGEN
    },
    'crit': Mods.FLAT_CRIT_CHANCE,
    'critperlevel': Mods.SCALING_CRIT_CHANCE,
    'attackdamage': Mods.FLAT_ATTACK_DAMAGE,
    'attackdamageperlevel': Mods.SCALING_ATTACK_DAMAGE,
    'attackspeedoffset': Mods.FLAT_ATTACK_SPEED,
    'attackspeedperlevel': Mods.SCALING_ATTACK_SPEED
};

function transform(rawChampions) {
    let champions = fn.map(rawChampions.data, (champion, id) => {
        let resource = ResourceMappings[champion.partype];

        return {
            id,
            resource,
            name: champion.name,
            stats: fn.chain(champion.stats)
                .map((value, stat) => {
                    let mod = ChampionStatMods[stat];

                    if(ResourceStats.indexOf(stat) > -1) {
                        mod = mod[resource]
                    }

                    return mod ? mix(mod, { value }) : null;
                })
                .filter(mod => !!mod)
                .reduce((stats, mod) => {
                    let id = mod.stat.id;
                    
                    if(!stats[id]) {
                        stats[id] = mix({ values: {} }, mod.stat);
                    }

                    let key = mod.scaling ? 'growth' : 'base';

                    stats[id].values[key] = mod.value;

                    return stats;
                }, {})
                .value(),
            image: {
                sprite: champion.image.sprite,
                x: champion.image.x,
                y: champion.image.y
            }
        }
    });

    return fn.sort(champions, (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
}

export default transform;