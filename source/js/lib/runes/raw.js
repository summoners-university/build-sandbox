const raw = [{
    id: 5001,
    tier: 1,
    name: "Lesser Mark of Attack Damage",
    description: "+0.53 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 15
}, {
    id: 5002,
    tier: 1,
    name: "Lesser Mark of Scaling Attack Damage",
    description: "+0.08 attack damage per level (+1.35 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5003,
    tier: 1,
    name: "Lesser Mark of Attack Speed",
    description: "+0.94% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5005,
    tier: 1,
    name: "Lesser Mark of Critical Damage",
    description: "+1.24% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 65
}, {
    id: 5007,
    tier: 1,
    name: "Lesser Mark of Critical Chance",
    description: "+0.52% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5009,
    tier: 1,
    name: "Lesser Mark of Armor Penetration",
    description: "+0.72 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5011,
    tier: 1,
    name: "Lesser Mark of Health",
    description: "+1.93 health",
    rank: "1",
    effect: "HEALTH",
    cost: 30
}, {
    id: 5012,
    tier: 1,
    name: "Lesser Mark of Scaling Health",
    description: "+0.3 health per level (+5.4 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 65
}, {
    id: 5013,
    tier: 1,
    name: "Lesser Mark of Armor",
    description: "+0.51 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5015,
    tier: 1,
    name: "Lesser Mark of Magic Resist",
    description: "+0.43 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5016,
    tier: 1,
    name: "Lesser Mark of Scaling Magic Resist",
    description: "+0.04 magic resist per level (+0.72 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5021,
    tier: 1,
    name: "Lesser Mark of Cooldown Reduction",
    description: "-0.09% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 30
}, {
    id: 5023,
    tier: 1,
    name: "Lesser Mark of Ability Power",
    description: "+0.33 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5024,
    tier: 1,
    name: "Lesser Mark of Scaling Ability Power",
    description: "+0.06 ability power per level (+1.08 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5025,
    tier: 1,
    name: "Lesser Mark of Mana",
    description: "+3.28 mana",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5026,
    tier: 1,
    name: "Lesser Mark of Scaling Mana",
    description: "+0.65 mana per level (+11.7 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5027,
    tier: 1,
    name: "Lesser Mark of Mana Regeneration",
    description: "+0.15 mana regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 15
}, {
    id: 5029,
    tier: 1,
    name: "Lesser Mark of Magic Penetration",
    description: "+0.49 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5031,
    tier: 1,
    name: "Lesser Glyph of Attack Damage",
    description: "+0.16 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 15
}, {
    id: 5032,
    tier: 1,
    name: "Lesser Glyph of Scaling Attack Damage",
    description: "+0.02 attack damage per level (+0.36 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 15
}, {
    id: 5033,
    tier: 1,
    name: "Lesser Glyph of Attack Speed",
    description: "+0.35% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5035,
    tier: 1,
    name: "Lesser Glyph of Critical Damage",
    description: "+0.31% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 65
}, {
    id: 5037,
    tier: 1,
    name: "Lesser Glyph of Critical Chance",
    description: "+0.15% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5041,
    tier: 1,
    name: "Lesser Glyph of Health",
    description: "+1.49 health",
    rank: "1",
    effect: "HEALTH",
    cost: 30
}, {
    id: 5042,
    tier: 1,
    name: "Lesser Glyph of Scaling Health",
    description: "+0.3 health per level (+5.4 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 65
}, {
    id: 5043,
    tier: 1,
    name: "Lesser Glyph of Armor",
    description: "+0.39 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5045,
    tier: 1,
    name: "Lesser Glyph of Magic Resist",
    description: "+0.74 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5046,
    tier: 1,
    name: "Lesser Glyph of Scaling Magic Resist",
    description: "+0.09 magic resist per level (+1.68 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5047,
    tier: 1,
    name: "Lesser Glyph of Health Regeneration",
    description: "+0.15 health regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 65
}, {
    id: 5051,
    tier: 1,
    name: "Lesser Glyph of Cooldown Reduction",
    description: "-0.36% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 65
}, {
    id: 5052,
    tier: 1,
    name: "Lesser Glyph of Scaling Cooldown Reduction",
    description: "-0.05% cooldowns per level (-0.93% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 30
}, {
    id: 5053,
    tier: 1,
    name: "Lesser Glyph of Ability Power",
    description: "+0.66 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5054,
    tier: 1,
    name: "Lesser Glyph of Scaling Ability Power",
    description: "+0.1 ability power per level (+1.8 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5055,
    tier: 1,
    name: "Lesser Glyph of Mana",
    description: "+6.25 mana",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5056,
    tier: 1,
    name: "Lesser Glyph of Scaling Mana",
    description: "+0.79 mana per level (+14.22 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5057,
    tier: 1,
    name: "Lesser Glyph of Mana Regeneration",
    description: "+0.19 mana regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 30
}, {
    id: 5058,
    tier: 1,
    name: "Lesser Glyph of Scaling Mana Regeneration",
    description: "+0.04 mana regen / 5 sec. per level (+0.67 at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 15
}, {
    id: 5059,
    tier: 1,
    name: "Lesser Glyph of Magic Penetration",
    description: "+0.35 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5061,
    tier: 1,
    name: "Lesser Seal of Attack Damage",
    description: "+0.24 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 15
}, {
    id: 5062,
    tier: 1,
    name: "Lesser Seal of Scaling Attack Damage",
    description: "+0.03 attack damage per level (+0.61 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 15
}, {
    id: 5063,
    tier: 1,
    name: "Lesser Seal of Attack Speed",
    description: "+0.42% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5065,
    tier: 1,
    name: "Lesser Seal of Critical Damage",
    description: "+0.43% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 65
}, {
    id: 5067,
    tier: 1,
    name: "Lesser Seal of Critical Chance",
    description: "+0.23% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 30
}, {
    id: 5071,
    tier: 1,
    name: "Lesser Seal of Health",
    description: "+2.97 health",
    rank: "1",
    effect: "HEALTH",
    cost: 65
}, {
    id: 5072,
    tier: 1,
    name: "Lesser Seal of Scaling Health",
    description: "+0.75 health per level (+13.44 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 30
}, {
    id: 5073,
    tier: 1,
    name: "Lesser Seal of Armor",
    description: "+0.56 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5074,
    tier: 1,
    name: "Lesser Seal of Scaling Armor",
    description: "+0.09 armor per level (+1.68 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 30
}, {
    id: 5075,
    tier: 1,
    name: "Lesser Seal of Magic Resist",
    description: "+0.41 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 15
}, {
    id: 5076,
    tier: 1,
    name: "Lesser Seal of Scaling Magic Resist",
    description: "+0.05 magic resist per level (+0.9 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 30
}, {
    id: 5077,
    tier: 1,
    name: "Lesser Seal of Health Regeneration",
    description: "+0.31 health regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 65
}, {
    id: 5078,
    tier: 1,
    name: "Lesser Seal of Scaling Health Regeneration",
    description: "+0.06 health regen / 5 sec. per level (+1.08 at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 30
}, {
    id: 5081,
    tier: 1,
    name: "Lesser Seal of Cooldown Reduction",
    description: "-0.16% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 30
}, {
    id: 5083,
    tier: 1,
    name: "Lesser Seal of Ability Power",
    description: "+0.33 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5084,
    tier: 1,
    name: "Lesser Seal of Scaling Ability Power",
    description: "+0.06 ability power per level (+1.08 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 30
}, {
    id: 5085,
    tier: 1,
    name: "Lesser Seal of Mana",
    description: "+3.83 mana",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5086,
    tier: 1,
    name: "Lesser Seal of Scaling Mana",
    description: "+0.65 mana per level (+11.7 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 30
}, {
    id: 5087,
    tier: 1,
    name: "Lesser Seal of Mana Regeneration",
    description: "+0.23 mana regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 15
}, {
    id: 5088,
    tier: 1,
    name: "Lesser Seal of Scaling Mana Regeneration",
    description: "+0.036 mana regen / 5 sec. per level (+0.65 at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 15
}, {
    id: 5091,
    tier: 1,
    name: "Lesser Quintessence of Attack Damage",
    description: "+1.25 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5092,
    tier: 1,
    name: "Lesser Quintessence of Scaling Attack Damage",
    description: "+0.14 attack damage per level (+2.52 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 40
}, {
    id: 5093,
    tier: 1,
    name: "Lesser Quintessence of Attack Speed",
    description: "+2.52% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5095,
    tier: 1,
    name: "Lesser Quintessence of Critical Damage",
    description: "+2.48% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5097,
    tier: 1,
    name: "Lesser Quintessence of Critical Chance",
    description: "+1.03% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5099,
    tier: 1,
    name: "Lesser Quintessence of Armor Penetration",
    description: "+1.42 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5101,
    tier: 1,
    name: "Lesser Quintessence of Health",
    description: "+14.5 health",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5102,
    tier: 1,
    name: "Lesser Quintessence of Scaling Health",
    description: "+1.5 health per level (+27 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5103,
    tier: 1,
    name: "Lesser Quintessence of Armor",
    description: "+2.37 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5104,
    tier: 1,
    name: "Lesser Quintessence of Scaling Armor",
    description: "+0.21 armor per level (+3.78 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5105,
    tier: 1,
    name: "Lesser Quintessence of Magic Resist",
    description: "+2.22 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5106,
    tier: 1,
    name: "Lesser Quintessence of Scaling Magic Resist",
    description: "+0.21 magic resist per level (+3.78 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5107,
    tier: 1,
    name: "Lesser Quintessence of Health Regeneration",
    description: "+1.5 health regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5108,
    tier: 1,
    name: "Lesser Quintessence of Scaling Health Regeneration",
    description: "+0.16 health regen / 5 sec. per level (+2.88 at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5111,
    tier: 1,
    name: "Lesser Quintessence of Cooldown Reduction",
    description: "-1.4% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5112,
    tier: 1,
    name: "Lesser Quintessence of Scaling Cooldown Reduction",
    description: "-0.15% cooldowns per level (-2.8% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 80
}, {
    id: 5113,
    tier: 1,
    name: "Lesser Quintessence of Ability Power",
    description: "+2.75 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 80
}, {
    id: 5114,
    tier: 1,
    name: "Lesser Quintessence of Scaling Ability Power",
    description: "+0.24 ability power per level (+4.32 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 80
}, {
    id: 5115,
    tier: 1,
    name: "Lesser Quintessence of Mana",
    description: "+20.83 mana",
    rank: "1",
    effect: "MANA",
    cost: 80
}, {
    id: 5116,
    tier: 1,
    name: "Lesser Quintessence of Scaling Mana",
    description: "+2.31 mana per level (+41.58 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 40
}, {
    id: 5117,
    tier: 1,
    name: "Lesser Quintessence of Mana Regeneration",
    description: "+0.69 mana regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 80
}, {
    id: 5118,
    tier: 1,
    name: "Lesser Quintessence of Scaling Mana Regeneration",
    description: "+0.14 mana regen / 5 sec. per level (+2.52 at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 80
}, {
    id: 5119,
    tier: 1,
    name: "Lesser Quintessence of Magic Penetration",
    description: "+1.11 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 80
}, {
    id: 5121,
    tier: 1,
    name: "Lesser Quintessence of Movement Speed",
    description: "+0.83% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5123,
    tier: 2,
    name: "Mark of Attack Damage",
    description: "+0.74 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5124,
    tier: 2,
    name: "Mark of Scaling Attack Damage",
    description: "+0.1 attack damage per level (+1.89 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5125,
    tier: 2,
    name: "Mark of Attack Speed",
    description: "+1.32% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5127,
    tier: 2,
    name: "Mark of Critical Damage",
    description: "+1.74% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 330
}, {
    id: 5129,
    tier: 2,
    name: "Mark of Critical Chance",
    description: "+0.72% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5131,
    tier: 2,
    name: "Mark of Armor Penetration",
    description: "+1 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5133,
    tier: 2,
    name: "Mark of Health",
    description: "+2.7 health",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5134,
    tier: 2,
    name: "Mark of Scaling Health",
    description: "+0.42 health per level (+7.56 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5135,
    tier: 2,
    name: "Mark of Armor",
    description: "+0.71 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5137,
    tier: 2,
    name: "Mark of Magic Resist",
    description: "+0.6 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5138,
    tier: 2,
    name: "Mark of Scaling Magic Resist",
    description: "+0.06 magic resist per level (+1.08 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5143,
    tier: 2,
    name: "Mark of Cooldown Reduction",
    description: "-0.13% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 80
}, {
    id: 5145,
    tier: 2,
    name: "Mark of Ability Power",
    description: "+0.46 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5146,
    tier: 2,
    name: "Mark of Scaling Ability Power",
    description: "+0.08 ability power per level (+1.44 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5147,
    tier: 2,
    name: "Mark of Mana",
    description: "+4.59 mana",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5148,
    tier: 2,
    name: "Mark of Scaling Mana",
    description: "+0.91 mana per level (+16.38 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5149,
    tier: 2,
    name: "Mark of Mana Regeneration",
    description: "+0.2 mana regen / 5 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 80
}, {
    id: 5151,
    tier: 2,
    name: "Mark of Magic Penetration",
    description: "+0.68 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5153,
    tier: 2,
    name: "Glyph of Attack Damage",
    description: "+0.22 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5154,
    tier: 2,
    name: "Glyph of Scaling Attack Damage",
    description: "+0.03 attack damage per level (+0.57 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5155,
    tier: 2,
    name: "Glyph of Attack Speed",
    description: "+0.5% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5157,
    tier: 2,
    name: "Glyph of Critical Damage",
    description: "+0.43% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 330
}, {
    id: 5159,
    tier: 2,
    name: "Glyph of Critical Chance",
    description: "+0.22% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5163,
    tier: 2,
    name: "Glyph of Health",
    description: "+2.08 health",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5164,
    tier: 2,
    name: "Glyph of Scaling Health",
    description: "+0.42 health per level (+7.56 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5165,
    tier: 2,
    name: "Glyph of Armor",
    description: "+0.55 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5167,
    tier: 2,
    name: "Glyph of Magic Resist",
    description: "+1.04 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5168,
    tier: 2,
    name: "Glyph of Scaling Magic Resist",
    description: "+0.13 magic resist per level (+2.34 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5169,
    tier: 2,
    name: "Glyph of Health Regeneration",
    description: "+0.21 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5173,
    tier: 2,
    name: "Glyph of Cooldown Reduction",
    description: "-0.51% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 330
}, {
    id: 5174,
    tier: 2,
    name: "Glyph of Scaling Cooldown Reduction",
    description: "-0.07% cooldowns per level (-1.3% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5175,
    tier: 2,
    name: "Glyph of Ability Power",
    description: "+0.92 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5176,
    tier: 2,
    name: "Glyph of Scaling Ability Power",
    description: "+0.13 ability power per level (+2.34 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5177,
    tier: 2,
    name: "Glyph of Mana",
    description: "+8.75 mana",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5178,
    tier: 2,
    name: "Glyph of Scaling Mana",
    description: "+1.1 mana per level (+19.8 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5179,
    tier: 2,
    name: "Glyph of Mana Regeneration",
    description: "+0.26 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5180,
    tier: 2,
    name: "Glyph of Scaling Mana Regeneration",
    description: "+0.05 mana regen / 5 sec. per level (+0.94 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 80
}, {
    id: 5181,
    tier: 2,
    name: "Glyph of Magic Penetration",
    description: "+0.49 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5183,
    tier: 2,
    name: "Seal of Attack Damage",
    description: "+0.33 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5184,
    tier: 2,
    name: "Seal of Scaling Attack Damage",
    description: "+0.05 attack damage per level (+0.85 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 80
}, {
    id: 5185,
    tier: 2,
    name: "Seal of Attack Speed",
    description: "+0.59% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 165
}, {
    id: 5187,
    tier: 2,
    name: "Seal of Critical Damage",
    description: "+0.61% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 330
}, {
    id: 5189,
    tier: 2,
    name: "Seal of Critical Chance",
    description: "+0.32% critical chance",
    rank: "1",
    effect: "PHSYICAL",
    cost: 165
}, {
    id: 5193,
    tier: 2,
    name: "Seal of Health",
    description: "+4.16 health",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5194,
    tier: 2,
    name: "Seal of Scaling Health",
    description: "+1.04 health per level (+18.72 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5195,
    tier: 2,
    name: "Seal of Armor",
    description: "+.78 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5196,
    tier: 2,
    name: "Seal of Scaling Armor",
    description: "+0.23 armor per level (+2.34 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 165
}, {
    id: 5197,
    tier: 2,
    name: "Seal of Magic Resist",
    description: "+0.58 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 80
}, {
    id: 5198,
    tier: 2,
    name: "Seal of Scaling Magic Resist",
    description: "+0.08 magic resist per level (+1.44 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 165
}, {
    id: 5199,
    tier: 2,
    name: "Seal of Health Regeneration",
    description: "+0.43 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5200,
    tier: 2,
    name: "Seal of Scaling Health Regeneration",
    description: "+0.09 health regen / 5 sec. per level (+1.62 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5203,
    tier: 2,
    name: "Seal of Cooldown Reduction",
    description: "-0.23% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5205,
    tier: 2,
    name: "Seal of Ability Power",
    description: "+0.46 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5206,
    tier: 2,
    name: "Seal of Scaling Ability Power",
    description: "+0.08 ability power per level (+1.44 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 165
}, {
    id: 5207,
    tier: 2,
    name: "Seal of Mana",
    description: "+5.36 mana",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5208,
    tier: 2,
    name: "Seal of Scaling Mana",
    description: "+0.91 mana per level (+16.38 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 165
}, {
    id: 5209,
    tier: 2,
    name: "Seal of Mana Regeneration",
    description: "+0.32 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 80
}, {
    id: 5210,
    tier: 2,
    name: "Seal of Scaling Mana Regeneration",
    description: "+0.05 mana regen / 5 sec. per level (+0.9 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 80
}, {
    id: 5213,
    tier: 2,
    name: "Quintessence of Attack Damage",
    description: "+1.75 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5214,
    tier: 2,
    name: "Quintessence of Scaling Attack Damage",
    description: "+0.19 attack damage per level (+3.42 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5215,
    tier: 2,
    name: "Quintessence of Attack Speed",
    description: "+3.51% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5217,
    tier: 2,
    name: "Quintessence of Critical Damage",
    description: "+3.47% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5219,
    tier: 2,
    name: "Quintessence of Critical Chance",
    description: "+1.44% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5221,
    tier: 2,
    name: "Quintessence of Armor Penetration",
    description: "+1.99 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5223,
    tier: 2,
    name: "Quintessence of Health",
    description: "+20 health",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5224,
    tier: 2,
    name: "Quintessence of Scaling Health",
    description: "+2.1 health per level (+37.8 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5225,
    tier: 2,
    name: "Quintessence of Armor",
    description: "+3.32 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5226,
    tier: 2,
    name: "Quintessence of Scaling Armor",
    description: "+0.29 armor per level (+5.22 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5227,
    tier: 2,
    name: "Quintessence of Magic Resist",
    description: "+3.11 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5228,
    tier: 2,
    name: "Quintessence of Scaling Magic Resist",
    description: "+0.29 magic resist per level (+5.22 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5229,
    tier: 2,
    name: "Quintessence of Health Regeneration",
    description: "+2.1 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5230,
    tier: 2,
    name: "Quintessence of Scaling Health Regeneration",
    description: "+0.22 health regen / 5 sec. per level (+3.96 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5233,
    tier: 2,
    name: "Quintessence of Cooldown Reduction",
    description: "-1.95% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 820
}, {
    id: 5234,
    tier: 2,
    name: "Quintessence of Scaling Cooldown Reduction",
    description: "-0.21% cooldowns per level (-3.9% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 410
}, {
    id: 5235,
    tier: 2,
    name: "Quintessence of Ability Power",
    description: "+3.85 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5236,
    tier: 2,
    name: "Quintessence of Scaling Ability Power",
    description: "+0.34 ability power per level (+6.12 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5237,
    tier: 2,
    name: "Quintessence of Mana",
    description: "+29.17 mana",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5238,
    tier: 2,
    name: "Quintessence of Scaling Mana",
    description: "+3.24 mana per level (+58.32 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 205
}, {
    id: 5239,
    tier: 2,
    name: "Quintessence of Mana Regeneration",
    description: "+0.97 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5240,
    tier: 2,
    name: "Quintessence of Scaling Mana Regeneration",
    description: "+0.19 mana regen / 5 sec. per level (+3.42 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5241,
    tier: 2,
    name: "Quintessence of Magic Penetration",
    description: "+1.56 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5243,
    tier: 2,
    name: "Quintessence of Movement Speed",
    description: "+1.17% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 820
}, {
    id: 5245,
    tier: 3,
    name: "Greater Mark of Attack Damage",
    description: "+0.95 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5246,
    tier: 3,
    name: "Greater Mark of Scaling Attack Damage",
    description: "+0.13 attack damage per level (+2.43 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5247,
    tier: 3,
    name: "Greater Mark of Attack Speed",
    description: "+1.7% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5249,
    tier: 3,
    name: "Greater Mark of Critical Damage",
    description: "+2.23% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 820
}, {
    id: 5251,
    tier: 3,
    name: "Greater Mark of Critical Chance",
    description: "+0.93% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5253,
    tier: 3,
    name: "Greater Mark of Armor Penetration",
    description: "+1.28 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5255,
    tier: 3,
    name: "Greater Mark of Health",
    description: "+3.47 health",
    rank: "1",
    effect: "HEALTH",
    cost: 410
}, {
    id: 5256,
    tier: 3,
    name: "Greater Mark of Scaling Health",
    description: "+0.54 health per level (+9.72 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5257,
    tier: 3,
    name: "Greater Mark of Armor",
    description: "+0.91 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5259,
    tier: 3,
    name: "Greater Mark of Magic Resist",
    description: "+0.77 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5260,
    tier: 3,
    name: "Greater Mark of Scaling Magic Resist",
    description: "+0.07 magic resist per level (+1.26 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5265,
    tier: 3,
    name: "Greater Mark of Cooldown Reduction",
    description: "-0.16% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 410
}, {
    id: 5267,
    tier: 3,
    name: "Greater Mark of Ability Power",
    description: "+0.59 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5268,
    tier: 3,
    name: "Greater Mark of Scaling Ability Power",
    description: "+0.1 ability power per level (+1.8 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5269,
    tier: 3,
    name: "Greater Mark of Mana",
    description: "+5.91 mana",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5270,
    tier: 3,
    name: "Greater Mark of Scaling Mana",
    description: "+1.17 mana per level (+21.06 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5271,
    tier: 3,
    name: "Greater Mark of Mana Regeneration",
    description: "+0.26 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 205
}, {
    id: 5273,
    tier: 3,
    name: "Greater Mark of Magic Penetration",
    description: "+0.87 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5275,
    tier: 3,
    name: "Greater Glyph of Attack Damage",
    description: "+0.28 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5276,
    tier: 3,
    name: "Greater Glyph of Scaling Attack Damage",
    description: "+0.04 attack damage per level (+0.73 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5277,
    tier: 3,
    name: "Greater Glyph of Attack Speed",
    description: "+0.64% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5279,
    tier: 3,
    name: "Greater Glyph of Critical Damage",
    description: "+0.56% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 820
}, {
    id: 5281,
    tier: 3,
    name: "Greater Glyph of Critical Chance",
    description: "+0.28% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5285,
    tier: 3,
    name: "Greater Glyph of Health",
    description: "+2.67 health",
    rank: "1",
    effect: "HEALTH",
    cost: 410
}, {
    id: 5286,
    tier: 3,
    name: "Greater Glyph of Scaling Health",
    description: "+0.54 health per level (+9.72 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5287,
    tier: 3,
    name: "Greater Glyph of Armor",
    description: "+0.7 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5289,
    tier: 3,
    name: "Greater Glyph of Magic Resist",
    description: "+1.34 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5290,
    tier: 3,
    name: "Greater Glyph of Scaling Magic Resist",
    description: "+0.16 magic resist per level (+3.0 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5291,
    tier: 3,
    name: "Greater Glyph of Health Regeneration",
    description: "+0.27 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5295,
    tier: 3,
    name: "Greater Glyph of Cooldown Reduction",
    description: "-0.83% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 820
}, {
    id: 5296,
    tier: 3,
    name: "Greater Glyph of Scaling Cooldown Reduction",
    description: "-0.09% cooldowns per level (-1.67% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 410
}, {
    id: 5297,
    tier: 3,
    name: "Greater Glyph of Ability Power",
    description: "+1.19 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5298,
    tier: 3,
    name: "Greater Glyph of Scaling Ability Power",
    description: "+0.17 ability power per level (+3.06 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5299,
    tier: 3,
    name: "Greater Glyph of Mana",
    description: "+11.25 mana",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5300,
    tier: 3,
    name: "Greater Glyph of Scaling Mana",
    description: "+1.42 mana per level (+25.56 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5301,
    tier: 3,
    name: "Greater Glyph of Mana Regeneration",
    description: "+0.33 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5302,
    tier: 3,
    name: "Greater Glyph of Scaling Mana Regeneration",
    description: "+0.06 mana regen / 5 sec. per level (+1.20 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 205
}, {
    id: 5303,
    tier: 3,
    name: "Greater Glyph of Magic Penetration",
    description: "+0.63 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5305,
    tier: 3,
    name: "Greater Seal of Attack Damage",
    description: "+0.43 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5306,
    tier: 3,
    name: "Greater Seal of Scaling Attack Damage",
    description: "+0.06 attack damage per level (+1.09 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 205
}, {
    id: 5307,
    tier: 3,
    name: "Greater Seal of Attack Speed",
    description: "+0.76% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5309,
    tier: 3,
    name: "Greater Seal of Critical Damage",
    description: "+0.78% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 820
}, {
    id: 5311,
    tier: 3,
    name: "Greater Seal of Critical Chance",
    description: "+0.42% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 410
}, {
    id: 5315,
    tier: 3,
    name: "Greater Seal of Health",
    description: "+8.00 health",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5316,
    tier: 3,
    name: "Greater Seal of Scaling Health",
    description: "+1.33 health per level (+24.00 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 410
}, {
    id: 5317,
    tier: 3,
    name: "Greater Seal of Armor",
    description: "+1.00 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5318,
    tier: 3,
    name: "Greater Seal of Scaling Armor",
    description: "+0.16 armor per level (+3.0 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5319,
    tier: 3,
    name: "Greater Seal of Magic Resist",
    description: "+0.74 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 205
}, {
    id: 5320,
    tier: 3,
    name: "Greater Seal of Scaling Magic Resist",
    description: "+0.1 magic resist per level (+1.8 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 410
}, {
    id: 5321,
    tier: 3,
    name: "Greater Seal of Health Regeneration",
    description: "+0.56 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5322,
    tier: 3,
    name: "Greater Seal of Scaling Health Regeneration",
    description: "+0.11 health regen / 5 sec. per level (+1.98 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 410
}, {
    id: 5325,
    tier: 3,
    name: "Greater Seal of Cooldown Reduction",
    description: "-0.29% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 410
}, {
    id: 5327,
    tier: 3,
    name: "Greater Seal of Ability Power",
    description: "+0.59 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5328,
    tier: 3,
    name: "Greater Seal of Scaling Ability Power",
    description: "+0.1 ability power per level (+1.8 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 410
}, {
    id: 5329,
    tier: 3,
    name: "Greater Seal of Mana",
    description: "+6.89 mana",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5330,
    tier: 3,
    name: "Greater Seal of Scaling Mana",
    description: "+1.17 mana per level (+21.06 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 410
}, {
    id: 5331,
    tier: 3,
    name: "Greater Seal of Mana Regeneration",
    description: "+0.41 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 205
}, {
    id: 5332,
    tier: 3,
    name: "Greater Seal of Scaling Mana Regeneration",
    description: "+0.065 mana regen / 5 sec. per level (+1.17 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 205
}, {
    id: 5335,
    tier: 3,
    name: "Greater Quintessence of Attack Damage",
    description: "+2.25 attack damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 1025
}, {
    id: 5336,
    tier: 3,
    name: "Greater Quintessence of Scaling Attack Damage",
    description: "+0.25 attack damage per level (+4.5 at champion level 18)",
    rank: "1",
    effect: "PHYSICAL",
    cost: 515
}, {
    id: 5337,
    tier: 3,
    name: "Greater Quintessence of Attack Speed",
    description: "+4.5% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 1025
}, {
    id: 5339,
    tier: 3,
    name: "Greater Quintessence of Critical Damage",
    description: "+4.46% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 1025
}, {
    id: 5341,
    tier: 3,
    name: "Greater Quintessence of Critical Chance",
    description: "+1.86% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 1025
}, {
    id: 5343,
    tier: 3,
    name: "Greater Quintessence of Armor Penetration",
    description: "+2.56 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 1025
}, {
    id: 5345,
    tier: 3,
    name: "Greater Quintessence of Health",
    description: "+26 health",
    rank: "1",
    effect: "HEALTH",
    cost: 2050
}, {
    id: 5346,
    tier: 3,
    name: "Greater Quintessence of Scaling Health",
    description: "+2.7 health per level (+48.6 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 2050
}, {
    id: 5347,
    tier: 3,
    name: "Greater Quintessence of Armor",
    description: "+4.26 armor",
    rank: "1",
    effect: "DEFENSE",
    cost: 1025
}, {
    id: 5348,
    tier: 3,
    name: "Greater Quintessence of Scaling Armor",
    description: "+0.38 armor per level (+6.84 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 1025
}, {
    id: 5349,
    tier: 3,
    name: "Greater Quintessence of Magic Resist",
    description: "+4 magic resist",
    rank: "1",
    effect: "DEFENSE",
    cost: 1025
}, {
    id: 5350,
    tier: 3,
    name: "Greater Quintessence of Scaling Magic Resist",
    description: "+0.37 magic resist per level (+6.66 at champion level 18)",
    rank: "1",
    effect: "DEFENSE",
    cost: 1025
}, {
    id: 5351,
    tier: 3,
    name: "Greater Quintessence of Health Regeneration",
    description: "+2.7 health regen / 5 sec.",
    rank: "1",
    effect: "HEALTH",
    cost: 2050
}, {
    id: 5352,
    tier: 3,
    name: "Greater Quintessence of Scaling Health Regeneration",
    description: "+0.28 health regen / 5 sec. per level (+5.04 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 2050
}, {
    id: 5355,
    tier: 3,
    name: "Greater Quintessence of Cooldown Reduction",
    description: "-2.50% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 2050
}, {
    id: 5356,
    tier: 3,
    name: "Greater Quintessence of Scaling Cooldown Reduction",
    description: "-0.28% cooldowns per level (-5% at champion level 18)",
    rank: "1",
    effect: "UTILITY",
    cost: 1025
}, {
    id: 5357,
    tier: 3,
    name: "Greater Quintessence of Ability Power",
    description: "+4.95 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 1025
}, {
    id: 5358,
    tier: 3,
    name: "Greater Quintessence of Scaling Ability Power",
    description: "+0.43 ability power per level (+7.74 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 1025
}, {
    id: 5359,
    tier: 3,
    name: "Greater Quintessence of Mana",
    description: "+37.5 mana",
    rank: "1",
    effect: "MANA",
    cost: 1025
}, {
    id: 5360,
    tier: 3,
    name: "Greater Quintessence of Scaling Mana",
    description: "+4.17 mana per level (+75.06 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 515
}, {
    id: 5361,
    tier: 3,
    name: "Greater Quintessence of Mana Regeneration",
    description: "+1.25 mana regen / 5 sec.",
    rank: "1",
    effect: "MANA",
    cost: 1025
}, {
    id: 5362,
    tier: 3,
    name: "Greater Quintessence of Scaling Mana Regeneration",
    description: "+0.24 mana regen / 5 sec. per level (+4.32 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 1025
}, {
    id: 5363,
    tier: 3,
    name: "Greater Quintessence of Magic Penetration",
    description: "+2.01 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 1025
}, {
    id: 5365,
    tier: 3,
    name: "Greater Quintessence of Movement Speed",
    description: "+1.5% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 2050
}, {
    id: 5366,
    tier: 3,
    name: "Greater Quintessence of Revival",
    description: "-5% time dead",
    rank: "1",
    effect: "UTILITY",
    cost: 1025
}, {
    id: 5367,
    tier: 3,
    name: "Greater Quintessence of Gold",
    description: "+1 gold / 10 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 515
}, {
    id: 5368,
    tier: 3,
    name: "Greater Quintessence of Experience",
    description: "+2% experience gained",
    rank: "1",
    effect: "UTILITY",
    cost: 2050
}, {
    id: 5369,
    tier: 3,
    name: "Greater Seal of Energy Regeneration",
    description: "+0.63 Energy regen/5 sec",
    rank: "1",
    effect: "MANA",
    cost: 820
}, {
    id: 5370,
    tier: 3,
    name: "Greater Seal of Scaling Energy Regeneration",
    description: "+0.064 Energy regen/5 sec per level (+1.15 at champion level 18)",
    rank: "1",
    effect: "MANA",
    cost: 820
}, {
    id: 5371,
    tier: 3,
    name: "Greater Glyph of Energy",
    description: "+2.2 Energy",
    rank: "1",
    effect: "MANA",
    cost: 820
}, {
    id: 5372,
    tier: 3,
    name: "Greater Glyph of Scaling Energy",
    description: "+0.161 Energy/level (+2.89 at level 18)",
    rank: "1",
    effect: "MANA",
    cost: 820
}, {
    id: 5373,
    tier: 3,
    name: "Greater Quintessence of Energy Regeneration",
    description: "+1.575 Energy regen/5 sec",
    rank: "1",
    effect: "MANA",
    cost: 2050
}, {
    id: 5374,
    tier: 3,
    name: "Greater Quintessence of Energy",
    description: "+5.4 Energy",
    rank: "1",
    effect: "MANA",
    cost: 1025
}, {
    id: 5400,
    tier: 1,
    name: "Lesser Mark of Hybrid Penetration",
    description: "+0.5 Armor Penetration / +0.34 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 65
}, {
    id: 5401,
    tier: 2,
    name: "Mark of Hybrid Penetration",
    description: "+0.7 Armor Penetration / +0.48 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 330
}, {
    id: 5402,
    tier: 3,
    name: "Greater Mark of Hybrid Penetration",
    description: "+0.9 Armor Penetration / +0.62 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 820
}, {
    id: 5403,
    tier: 3,
    name: "Greater Seal of Gold",
    description: "+0.25 gold / 10 sec.",
    rank: "1",
    effect: "UTILITY",
    cost: 410
}, {
    id: 5404,
    tier: 1,
    name: "Lesser Quintessence of Percent Health",
    description: "+0.84% increased health.",
    rank: "1",
    effect: "HEALTH",
    cost: 165
}, {
    id: 5405,
    tier: 2,
    name: "Quintessence of Percent Health",
    description: "+1.17% increased health.",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5406,
    tier: 3,
    name: "Greater Quintessence of Percent Health",
    description: "+1.5% increased health.",
    rank: "1",
    effect: "HEALTH",
    cost: 2050
}, {
    id: 5407,
    tier: 1,
    name: "Lesser Quintessence of Spell Vamp",
    description: "+1.12% Spellvamp.",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5408,
    tier: 2,
    name: "Quintessence of Spell Vamp",
    description: "+1.56% Spellvamp.",
    rank: "1",
    effect: "UTILITY",
    cost: 820
}, {
    id: 5409,
    tier: 3,
    name: "Greater Quintessence of Spell Vamp",
    description: "+2% Spellvamp.",
    rank: "1",
    effect: "UTILITY",
    cost: 2050
}, {
    id: 5410,
    tier: 1,
    name: "Lesser Quintessence of Life Steal",
    description: "+0.84% Lifesteal",
    rank: "1",
    effect: "UTILITY",
    cost: 165
}, {
    id: 5411,
    tier: 2,
    name: "Quintessence of Life Steal",
    description: "+1.17% Lifesteal",
    rank: "1",
    effect: "UTILITY",
    cost: 820
}, {
    id: 5412,
    tier: 3,
    name: "Greater Quintessence of Life Steal",
    description: "+1.5% Lifesteal.",
    rank: "1",
    effect: "UTILITY",
    cost: 2050
}, {
    id: 5413,
    tier: 1,
    name: "Lesser Seal of Percent Health",
    description: "+0.28% Health.",
    rank: "1",
    effect: "HEALTH",
    cost: 65
}, {
    id: 5414,
    tier: 2,
    name: "Seal of Percent Health",
    description: "+0.39% Health.",
    rank: "1",
    effect: "HEALTH",
    cost: 330
}, {
    id: 5415,
    tier: 3,
    name: "Greater Seal of Percent Health",
    description: "+0.5% Health.",
    rank: "1",
    effect: "HEALTH",
    cost: 820
}, {
    id: 5416,
    tier: 1,
    name: "Lesser Quintessence of Hybrid Penetration",
    description: "+0.99 Armor Penetration / +0.78 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 165
}, {
    id: 5417,
    tier: 2,
    name: "Quintessence of Hybrid Penetration",
    description: "+1.39 Armor Penetration / +1.09 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 820
}, {
    id: 5418,
    tier: 3,
    name: "Greater Quintessence of Hybrid Penetration",
    description: "+1.79 Armor Penetration / +1.4 Magic Penetration",
    rank: "1",
    effect: "MAGIC, PHYSICAL",
    cost: 2050
}, {
    id: 8001,
    tier: 2,
    name: "Mark of the Crippling Candy Cane",
    description: "+2% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 0
}, {
    id: 8002,
    tier: 1,
    name: "Lesser Mark of the Yuletide Tannenbaum",
    description: "+0.62% critical chance",
    rank: "1",
    effect: "PHYSICAL",
    cost: 0
}, {
    id: 8003,
    tier: 2,
    name: "Glyph of the Special Stocking",
    description: "-0.58% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 0
}, {
    id: 8005,
    tier: 1,
    name: "Lesser Glyph of the Gracious Gift",
    description: "+0.12 ability power per level (+2.16 at champion level 18)",
    rank: "1",
    effect: "MAGIC",
    cost: 0
}, {
    id: 8006,
    tier: 1,
    name: "Lesser Seal of the Stout Snowman",
    description: "+0.72 health per level (+12.96 at champion level 18)",
    rank: "1",
    effect: "HEALTH",
    cost: 0
}, {
    id: 8007,
    tier: 1,
    name: "Lesser Mark of Alpine Attack Speed",
    description: "+1.13% attack speed",
    rank: "1",
    effect: "PHYSICAL",
    cost: 0
}, {
    id: 8008,
    tier: 2,
    name: "Mark of the Combatant",
    description: "+2% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 0
}, {
    id: 8009,
    tier: 1,
    name: "Lesser Seal of the Medalist",
    description: "+3.56 health",
    rank: "1",
    effect: "HEALTH",
    cost: 0
}, {
    id: 8011,
    tier: 1,
    name: "Lesser Glyph of the Challenger",
    description: "+0.66 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 0
}, {
    id: 8012,
    tier: 2,
    name: "Glyph of the Soaring Slalom",
    description: "-0.58% cooldowns",
    rank: "1",
    effect: "UTILITY",
    cost: 0
}, {
    id: 8013,
    tier: 2,
    name: "Quintessence of the Headless Horseman",
    description: "+2.37 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 495
}, {
    id: 8014,
    tier: 2,
    name: "Quintessence of the Piercing Screech",
    description: "+1.85 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 495
}, {
    id: 8015,
    tier: 2,
    name: "Quintessence of Bountiful Treats",
    description: "+24 health",
    rank: "1",
    effect: "HEALTH",
    cost: 995
}, {
    id: 8016,
    tier: 2,
    name: "Quintessence of the Speedy Specter",
    description: "+1.39% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 995
}, {
    id: 8017,
    tier: 2,
    name: "Quintessence of the Witches Brew",
    description: "+4.56 ability power",
    rank: "1",
    effect: "MAGIC",
    cost: 495
}, {
    id: 8019,
    tier: 3,
    name: "Greater Quintessence of the Piercing Present",
    description: "+2.01 magic penetration",
    rank: "1",
    effect: "MAGIC",
    cost: 775
}, {
    id: 8020,
    tier: 3,
    name: "Greater Quintessence of the Deadly Wreath",
    description: "+2.56 armor penetration",
    rank: "1",
    effect: "PHYSICAL",
    cost: 775
}, {
    id: 8021,
    tier: 3,
    name: "Greater Quintessence of Frosty Health",
    description: "+26 health",
    rank: "1",
    effect: "HEALTH",
    cost: 1550
}, {
    id: 8022,
    tier: 3,
    name: "Greater Quintessence of Sugar Rush",
    description: "+1.5% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 1550
}, {
    id: 8035,
    tier: 3,
    name: "Greater Quintessence of Studio Rumble",
    description: "+1.5% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 0
}, {
    id: 10001,
    tier: 3,
    name: "Razer Mark of Precision",
    description: "+2.23% critical damage",
    rank: "1",
    effect: "PHYSICAL",
    cost: 0
}, {
    id: 10002,
    tier: 3,
    name: "Razer Quintessence of Speed",
    description: "+1.5% movement speed",
    rank: "1",
    effect: "UTILITY",
    cost: 0
}];

export default raw;