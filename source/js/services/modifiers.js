import { assignKeys } from 'lib/objects';

const Resources = {
    MANA: 'Mana',
    ENERGY: 'Energy',
    BLOODWELL: 'BloodWell',
    RAGE: 'Rage'
};

const Stats = assignKeys({
    HEALTH_POOL: {
        name: 'Health Pool',
        decimals: 0,
        image: { x: 0, y: 180 },
        percent: false
    },
    MANA_POOL: {
        name: 'Mana Pool',
        decimals: 0,
        image: { x: 20, y: 180 },
        percent: false
    },
    HEALTH_REGEN: {
        name: 'Health Regeneration',
        decimals: 1,
        image: { x: 0, y: 0 },
        percent: false
    },
    MANA_REGEN: {
        name: 'Mana Regeneration',
        decimals: 1,
        image: { x: 20, y: 0 },
        percent: false
    },
    ENERGY_POOL: {
        name: 'Energy Pool',
        decimals: 0,
        image: { x: 20, y: 200 },
        percent: false
    },
    ENERGY_REGEN: {
        name: 'Energy Regeneration',
        decimals: 1,
        image: { x: 20, y: 160 },
        percent: false
    },
    ARMOR: {
        name: 'Armor',
        decimals: 0,
        image: { x: 0, y: 100 },
        percent: false
    },
    MAGIC_RESIST: {
        name: 'Magic Resistance',
        decimals: 0,
        image: { x: 20, y: 100 },
        percent: false
    },
    ARMOR_PEN: {
        name: 'Armor Penetration',
        decimals: 1,
        image: { x: 0, y: 20 },
        percent: false
    },
    PCT_ARMOR_PEN: {
        name: 'Armor Penetration',
        decimals: 1,
        image: { x: 0, y: 20 },
        percent: true
    },
    MAGIC_PEN: {
        name: 'Magic Penetration',
        decimals: 1,
        image: { x: 20, y: 20 },
        percent: false
    },
    PCT_MAGIC_PEN: {
        name: 'Magic Penetration',
        decimals: 1,
        image: { x: 20, y: 20 },
        percent: true
    },
    CDR: {
        name: 'Cooldown Reduction',
        decimals: 1,
        image: { x: 20, y: 120 },
        percent: true
    },
    MAX_CDR: {
        name: 'Cooldown Reduction Cap',
        percent: true
    },
    MAGIC_DAMAGE: {
        name: 'Ability Power',
        decimals: 0,
        image: { x: 20, y: 80 },
        percent: false
    },
    ATTACK_SPEED: {
        decimals: 2,
        name: 'Attack Speed',
        image: { x: 0, y: 120 },
        percent: false
    },
    ATTACK_DAMAGE: {
        decimals: 0,
        name: 'Attack Damage',
        image: { x: 0, y: 80 },
        percent: false
    },
    CRIT_CHANCE: {
        name: 'Critical Chance',
        decimals: 0,
        image: { x: 0, y: 140 },
        percent: true
    },
    CRIT_DAMAGE: {
        name: 'Critical Damage',
        decimals: 0,
        image: { x: 0, y: 140 },
        percent: true
    },
    MOVE_SPEED: {
        decimals: 0,
        name: 'Movement Speed',
        image: { x: 20, y: 140 },
        percent: false
    },
    LIFE_STEAL: {
        name: 'Life Steal',
        decimals: 1,
        image: { x: 0, y: 40 },
        percent: true
    },
    SPELL_VAMP: {
        name: 'Spell Vampirism',
        decimals: 1,
        image: { x: 20, y: 40 },
        percent: true
    },
    TIME_DEAD: {
        name: 'Time Spent Dead',
        decimals: 0,
        percent: true
    },
    GP10: {
        name: 'Gold per 10 seconds',
        decimals: 0,
        percent: false
    },
    PCT_XP: {
        name: 'Experience',
        decimals: 0,
        percent: true
    },
    ABILITY_DAMAGE: {
        name: 'Ability Damage',
        decimals: 1,
        percent: false
    },
    TENACITY: {
        name: 'Tenacity',
        decimals: 0,
        image: { x: 20, y: 60 },
        percent: true
    },
    DAMAGE_TAKEN: {
        name: 'Damage Taken',
        decimals: 0,
        percent: false
    },
    DAMAGE_DEALT: {
        name: 'Damage Dealt',
        decimals: 0,
        percent: false
    },
    ATTACK_RANGE: {
        decimals: 0,
        name: 'Attack Range',
        image: { x: 0, y: 60 },
        percent: false
    },
    ATTACK_SPEED_OFFSET: {
        name: 'Attack Speed Offset',
        decimals: 3,
        percent: false
    },
    BLOODWELL: {
        name: 'Blood Well',
        decimals: 0,
        image: { x: 0, y: 200 },
        percent: false
    }
});

const Mods = assignKeys({
    FLAT_HP_POOL: {
        stat: Stats.HEALTH_POOL,
        scaling: false,
        percent: false
    },

    SCALING_HP_POOL: {
        stat: Stats.HEALTH_POOL,
        scaling: true,
        percent: false
    },

    FLAT_HP_POOL_PCT: {
        stat: Stats.HEALTH_POOL,
        scaling: false,
        percent: true
    },

    FLAT_HP_REGEN: {
        stat: Stats.HEALTH_REGEN,
        scaling: false,
        percent: false
    },

    SCALING_HP_REGEN: {
        stat: Stats.HEALTH_REGEN,
        scaling: true,
        percent: false
    },

    FLAT_MP_POOL: {
        stat: Stats.MANA_POOL,
        scaling: false,
        percent: false
    },

    SCALING_MP_POOL: {
        stat: Stats.MANA_POOL,
        scaling: true,
        percent: false
    },

    FLAT_MP_REGEN: {
        stat: Stats.MANA_REGEN,
        scaling: false,
        percent: false
    },

    SCALING_MP_REGEN: {
        stat: Stats.MANA_REGEN,
        scaling: true,
        percent: false
    },

    FLAT_ARMOR: {
        stat: Stats.ARMOR,
        scaling: false,
        percent: false
    },

    SCALING_ARMOR: {
        stat: Stats.ARMOR,
        scaling: true,
        percent: false
    },

    FLAT_MR: {
        stat: Stats.MAGIC_RESIST,
        scaling: false,
        percent: false
    },

    SCALING_MR: {
        stat: Stats.MAGIC_RESIST,
        scaling: true,
        percent: false
    },

    FLAT_ARMOR_PEN: {
        stat: Stats.ARMOR_PEN,
        scaling: false,
        percent: false
    },

    SCALING_ARMOR_PEN: {
        stat: Stats.ARMOR_PEN,
        scaling: true,
        percent: false
    },

    FLAT_ARMOR_PEN_PCT: {
        stat: Stats.ARMOR_PEN,
        scaling: false,
        percent: true
    },

    FLAT_PCT_ARMOR_PEN: {
        stat: Stats.PCT_ARMOR_PEN,
        scaling: false,
        percent: false
    },

    FLAT_MAGIC_PEN: {
        stat: Stats.MAGIC_PEN,
        scaling: false,
        percent: false
    },

    SCALING_MAGIC_PEN: {
        stat: Stats.MAGIC_PEN,
        scaling: true,
        percent: false
    },

    FLAT_MAGIC_PEN_PCT: {
        stat: Stats.MAGIC_PEN,
        scaling: false,
        percent: true
    },

    FLAT_PCT_MAGIC_PEN: {
        stat: Stats.PCT_MAGIC_PEN,
        scaling: false,
        percent: false
    },

    FLAT_ATTACK_DAMAGE: {
        stat: Stats.ATTACK_DAMAGE,
        scaling: false,
        percent: false
    },

    SCALING_ATTACK_DAMAGE: {
        stat: Stats.ATTACK_DAMAGE,
        scaling: true,
        percent: false
    },

    FLAT_MAGIC_DAMAGE: {
        stat: Stats.MAGIC_DAMAGE,
        scaling: false,
        percent: false
    },

    SCALING_MAGIC_DAMAGE: {
        stat: Stats.MAGIC_DAMAGE,
        scaling: true,
        percent: false
    },

    FLAT_CRIT_CHANCE: {
        stat: Stats.CRIT_CHANCE,
        scaling: false,
        percent: false
    },

    SCALING_CRIT_CHANCE: {
        stat: Stats.CRIT_CHANCE,
        scaling: true,
        percent: false
    },

    FLAT_CRIT_DAMAGE: {
        stat: Stats.CRIT_DAMAGE,
        scaling: false,
        percent: false
    },

    FLAT_MOVE_SPEED: {
        stat: Stats.MOVE_SPEED,
        scaling: false,
        percent: false
    },

    FLAT_MOVE_SPEED_PCT: {
        stat: Stats.MOVE_SPEED,
        scaling: false,
        percent: true
    },

    ATTACK_SPEED_OFFSET: {
        stat: Stats.ATTACK_SPEED_OFFSET,
        scaling: false,
        percent: false
    },

    FLAT_ATTACK_SPEED: {
        stat: Stats.ATTACK_SPEED,
        scaling: false,
        percent: false
    },

    FLAT_ATTACK_SPEED_PCT: {
        stat: Stats.ATTACK_SPEED,
        scaling: false,
        percent: true
    },

    SCALING_ATTACK_SPEED: {
        stat: Stats.ATTACK_SPEED,
        scaling: true,
        percent: false
    },

    FLAT_CDR: {
        stat: Stats.CDR,
        scaling: false,
        percent: false
    },

    SCALING_CDR: {
        stat: Stats.CDR,
        scaling: true,
        percent: false
    },

    FLAT_MAX_CDR: {
        stat: Stats.MAX_CDR,
        scaling: false,
        percent: false
    },

    FLAT_PCT_XP: {
        stat: Stats.PCT_XP,
        scaling: false,
        percent: false
    },

    FLAT_TIME_DEAD: {
        stat: Stats.TIME_DEAD,
        scaling: false,
        percent: false
    },

    FLAT_GP10: {
        stat: Stats.GP10,
        scaling: false,
        percent: false
    },

    FLAT_ENERGY_POOL: {
        stat: Stats.ENERGY_POOL,
        scaling: false,
        percent: false
    },

    SCALING_ENERGY_POOL: {
        stat: Stats.ENERGY_POOL,
        scaling: true,
        percent: false
    },

    FLAT_ENERGY_REGEN: {
        stat: Stats.ENERGY_REGEN,
        scaling: false,
        percent: false
    },

    SCALING_ENERGY_REGEN: {
        stat: Stats.ENERGY_REGEN,
        scaling: true,
        percent: false
    },

    FLAT_LIFE_STEAL: {
        stat: Stats.LIFE_STEAL,
        scaling: false,
        percent: false
    },

    FLAT_SPELL_VAMP: {
        stat: Stats.SPELL_VAMP,
        scaling: false,
        percent: false
    },

    ABILITY_DAMAGE: {
        stat: Stats.ABILITY_DAMAGE,
        scaling: false,
        percent: true
    },
    
    FLAT_TENACITY: {
        stat: Stats.TENACITY,
        scaling: false,
        percent: false
    },

    FLAT_DAMAGE_TAKEN: {
        stat: Stats.DAMAGE_TAKEN,
        scaling: false,
        percent: true
    },

    FLAT_DAMAGE_DEALT: {
        stat: Stats.DAMAGE_DEALT,
        scaling: false,
        percent: true
    },

    FLAT_ATTACK_RANGE: {
        stat: Stats.ATTACK_RANGE,
        scaling: false,
        percent: false
    },

    FLAT_BLOODWELL: {
        stat: Stats.BLOODWELL,
        scaling: false,
        percent: false
    },

    SCALING_BLOODWELL: {
        stat: Stats.BLOODWELL,
        scaling: true,
        percent: false
    }
});

export { Mods, Stats, Resources };