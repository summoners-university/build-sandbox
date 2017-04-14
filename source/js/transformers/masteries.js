import _ from 'lodash';
import { mix } from 'lib/objects';
import { Mods } from 'services/modifiers';

const MasteryMods = {
    '6111': [
        mix(Mods.FLAT_ATTACK_SPEED_PCT, { value: 0.008 })
    ],
    '6114': [
        mix(Mods.ABILITY_DAMAGE, { value: 0.004 })
    ],
    '6131': [
        mix(Mods.FLAT_LIFE_STEAL, { value: 0.004 }),
        mix(Mods.FLAT_SPELL_VAMP, { value: 0.004 })
    ],
    '6134': [
        mix(Mods.SCALING_MAGIC_DAMAGE, { value: 0.166 }),
        mix(Mods.SCALING_ATTACK_DAMAGE, { value: 0.11 })
    ],
    '6151': [
        mix(Mods.FLAT_PCT_ARMOR_PEN, { value: 0.014 })
    ],
    '6154': [
        mix(Mods.FLAT_PCT_MAGIC_PEN, { value: 0.014 })
    ],
    '6211': [
        mix(Mods.FLAT_HP_REGEN, { value: 0.004 })
    ],
    '6232': [
        mix(Mods.FLAT_HP_POOL, { value: 9 })
    ],
    '6251': [
        mix(Mods.FLAT_TENACITY, { value: 0.03 })
    ],
    '6351': [
        mix(Mods.FLAT_ARMOR_PEN, { value: 0.6 }),
        mix(Mods.FLAT_MAGIC_PEN, { value: 0.6 }),
        mix(Mods.SCALING_ARMOR_PEN, { value: 0.006 }),
        mix(Mods.SCALING_MAGIC_PEN, { value: 0.006 })
    ],
    '6352': [
        mix(Mods.FLAT_CDR, { value: 0.01 }),
        mix(Mods.FLAT_MAX_CDR, { value: 0.01 })
    ]
};

function transform(rawMasteries) {
    let talents = _.mapValues(rawMasteries.data, talent => ({
        id: talent.id,
        name: talent.name,
        description: talent.description,
        ranks: talent.ranks,
        image: talent.image,
        points: 0
    }));

    let trees = _.values(_.mapValues(rawMasteries.tree, (tree, name) => ({
        name: name,
        points: 0,
        talents: tree
            .map((talentRow, tier) => talentRow
                .filter(talent => !!talent)
                .map(talent => talents[talent.masteryId])
                .map(talent => _.extend(talent, {
                    tier,
                    mods: (MasteryMods[talent.id] || [])
                }))
            )
            .reduce((talents, row) => talents.concat(row), [])
    })));

    return {
        version: rawMasteries.version,
        trees,
        talents,
        points: 0
    };
}

export default transform;