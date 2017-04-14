import { mix } from 'lib/objects';
import _ from 'lodash';
import { Mods } from 'services/modifiers';

const Types = {
    MARK: "Mark",
    SEAL: "Seal",
    GLYPH: "Glyph",
    QUINT: "Quintessence"
};

const ColorTypes = {
    "red": Types.MARK,
    "yellow": Types.SEAL,
    "blue": Types.GLYPH,
    "black": Types.QUINT
};

const RuneMods = {
    "FlatHPPoolMod": Mods.FLAT_HP_POOL,
    "rFlatHPModPerLevel": Mods.SCALING_HP_POOL,
    "FlatMPPoolMod": Mods.FLAT_MP_POOL,
    "rFlatMPModPerLevel": Mods.SCALING_MP_POOL,
    "PercentHPPoolMod": Mods.FLAT_HP_POOL_PCT,
    "FlatHPRegenMod": Mods.FLAT_HP_REGEN,
    "rFlatHPRegenModPerLevel": Mods.SCALING_HP_REGEN,
    "FlatMPRegenMod": Mods.FLAT_MP_REGEN,
    "rFlatMPRegenModPerLevel": Mods.SCALING_MP_REGEN,
    "FlatArmorMod": Mods.FLAT_ARMOR,
    "rFlatArmorModPerLevel": Mods.SCALING_ARMOR,
    "rFlatArmorPenetrationMod": Mods.FLAT_ARMOR_PEN,
    "FlatPhysicalDamageMod": Mods.FLAT_ATTACK_DAMAGE,
    "rFlatPhysicalDamageModPerLevel": Mods.SCALING_ATTACK_DAMAGE,
    "FlatMagicDamageMod": Mods.FLAT_MAGIC_DAMAGE,
    "rFlatMagicDamageModPerLevel": Mods.SCALING_MAGIC_DAMAGE,
    "PercentMovementSpeedMod": Mods.FLAT_MOVE_SPEED_PCT,
    "PercentAttackSpeedMod": Mods.FLAT_ATTACK_SPEED_PCT,
    "FlatCritChanceMod": Mods.FLAT_CRIT_CHANCE,
    "FlatCritDamageMod": Mods.FLAT_CRIT_DAMAGE,
    "FlatSpellBlockMod": Mods.FLAT_MR,
    "rFlatSpellBlockModPerLevel": Mods.SCALING_MR,
    "PercentEXPBonus": Mods.FLAT_PCT_XP,
    "rPercentCooldownMod": Mods.FLAT_CDR,
    "rPercentCooldownModPerLevel": Mods.SCALING_CDR,
    "rPercentTimeDeadMod": Mods.FLAT_TIME_DEAD,
    "rFlatGoldPer10Mod": Mods.FLAT_GP10,
    "rFlatMagicPenetrationMod": Mods.FLAT_MAGIC_PEN,
    "FlatEnergyRegenMod": Mods.FLAT_ENERGY_REGEN,
    "rFlatEnergyRegenModPerLevel": Mods.SCALING_ENERGY_REGEN,
    "FlatEnergyPoolMod": Mods.FLAT_ENERGY_POOL,
    "rFlatEnergyModPerLevel": Mods.SCALING_ENERGY_POOL,
    "PercentLifeStealMod": Mods.FLAT_LIFE_STEAL,
    "PercentSpellVampMod": Mods.FLAT_SPELL_VAMP
};

function transform(rawRunes) {
    let runes = _.values(_.mapValues(rawRunes.data, (rune, id) => {
        return {
            id,
            name: rune.name,
            description: rune.description,
            tier: rune.rune.tier,
            type: ColorTypes[rune.rune.type],
            mods: Object.keys(rune.stats).map(key => {
                return mix(RuneMods[key], {
                    value: Math.abs(rune.stats[key])
                })
            })
        }
    }));

    return runes;
}

export default transform;