(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function extend(src, ...objects) {
    for(let i in objects) {
        if(!objects.hasOwnProperty(i)) continue;
        let obj = objects[i];
        for(let key in obj) {
            if(!obj.hasOwnProperty(key)) continue;
            if(obj[key] && typeof obj[key] == 'object' && obj[key].constructor == Object) {
                src[key] = extend({}, obj[key]);
            } else {
                src[key] = obj[key];
            }
        }
    }
    return src;
}

function collect(collection) {
    return Object.keys(collection)
        .map((key, i, keys) => ({value: collection[key], key}));
}

function uncollect(collection) {
    return collection.reduce((collection, entry) => {
        collection[entry.key] = entry.value;
        return collection;
    }, {});
}

function forEach(collection, callback) {
    Array.isArray(collection) ? collection.forEach(callback) : collect(collection)
        .forEach((entry, i, collection) => callback(entry.value, entry.key, collection))
    return collection;
}

function filter(collection, callback) {
    if(Array.isArray(collection)) return collection.filter(callback);

    let result = collect(collection)
        .filter((entry, i, collection) => callback(entry.value, entry.key, collection));

    return uncollect(result);
}

function every(collection, callback) {
    if(Array.isArray(collection)) return collection.every(callback);

    let result = collect(collection)
        .every((entry, i, collection) => callback(entry.value, entry.key, collection));

    return result;
}

function some(collection, callback) {
    if(Array.isArray(collection)) return collection.some(callback);

    let result = collect(collection)
        .some((entry, i, collection) => callback(entry.value, entry.key, collection));

    return result;
}

function find(collection, callback) {
    if(Array.isArray(collection)) return collection.find(callback);

    let result = collect(collection)
        .find((entry, i, collection) => callback(entry.value, entry.key, collection));

    return result ? result.value : undefined;
}

function findKey(collection, callback) {
    if(Array.isArray(collection)) return collection.findIndex(callback);

    collection = collect(collection);

    let index = collection
        .findIndex((entry, i, collection) => callback(entry.value, entry.key, collection));

    return index > -1 ? collection[index].key : undefined;
}

function sort(collection, callback) {
    if(Array.isArray(collection)) return collection.map(callback);
    collection = collect(collection);

    let result = collection
        .sort((a, b) => callback(a.value, b.value, a.key, b.key, collection));

    return uncollect(result);
}

function map(collection, callback) {
    if(Array.isArray(collection)) return collection.map(callback);

    let result = collect(collection)
        .map((entry, i, collection) => {
            entry.value = callback(entry.value, entry.key, collection);
            return entry;
        });

    return uncollect(result);
}

function mapKeys(collection, callback) {
    if(Array.isArray(collection)) return collection.map(callback);

    let result = collect(collection)
        .map((entry, i, collection) => {
            entry.key = callback(entry.value, entry.key, collection);
            return entry;
        });

    return uncollect(result);
}

function reduce(collection, callback, initial) {
    if(Array.isArray(collection)) return collection.reduce(callback, initial);

    return collect(collection)
        .reduce((sum, entry, i, collection) => callback(sum, entry.value, entry.key, collection), initial)
}

function reduceRight(collection, callback, initial) {
    if(Array.isArray(collection)) return collection.reduceRight(callback, initial);

    return collect(collection)
        .reduceRight((sum, entry, i, collection) => callback(sum, entry.value, entry.key, collection), initial)
}

function collection(_collection) {
    return extend(Object.create({
        valueOf() {
            return this.collection
        },
        forEach(callback) {
            return collection(forEach(this, callback));
        },
        some(callback) {
            return some(this.collection, callback);
        },
        every(callback) {
            return every(this.collection, callback);
        },
        find(callback) {
            return find(this.collection, callback);
        },
        findKey(callback) {
            return findKey(this.collection, callback);
        },
        sort(callback) {
            return collection(sort(this, callback));
        },
        filter(callback) {
            return collection(filter(this, callback));
        },
        map(callback) {
            return collection(map(this, callback));
        },
        mapKeys(callback) {
            return collection(mapKeys(this, callback));
        },
        reduce(callback, initial) {
            let res = reduce(this, callback, initial);
            return typeof res === 'object' ? collection(res) : res;
        },
        reduceRight(callback, initial) {
            let res = reduceRight(this, callback, initial);
            return typeof res === 'object' ? collection(res) : res;
        }
    }), _collection);
}

function chain(_collection) {
    return Object.create({
        forEach(callback) {
            forEach(this.collection, callback);
            return this;
        },
        some(callback) {
            this.collection = some(this.collection, callback);
            return this;
        },
        every(callback) {
            this.collection = every(this.collection, callback);
            return this;
        },
        find(callback) {
            this.collection = find(this.collection, callback);
            return this;
        },
        findKey(callback) {
            this.collection = findKey(this.collection, callback);
            return this;
        },
        sort(callback) {
            this.collection = sort(this.collection, callback);
            return this;
        },
        filter(callback) {
            this.collection = filter(this.collection, callback);
            return this;
        },
        map(callback) {
            this.collection = map(this.collection, callback);
            return this;
        },
        mapKeys(callback) {
            this.collection = mapKeys(this.collection, callback);
            return this;
        },
        reduce(callback, initial) {
            this.collection = reduce(this.collection, callback, initial);
            return this;
        },
        reduceRight(callback, initial) {
            this.collection = reduceRight(this.collection, callback, initial);
            return this;
        },
        value() {
            return this.collection;
        }
    }, {
        collection: {
            value: _collection,
            writable: true,
            enumerable: true,
            configurable: true
        }
    });
}

function close() {
    return this.collection;
}

function pipe(func, ...args) {
    let collection = typeof func !== 'function' ? func
        : func.apply(func, [this.collection].concat(args));

    return {
        collection,
        pipe: pipe.bind({ collection }),
        close: close.bind({ collection })
    }
}

function open(collection) {
    return {
        collection,
        pipe: pipe.bind({ collection }),
        close: close.bind({ collection: this.collection })
    }
}

function fn(_collection) {
    return collection(_collection);
}
fn.collection = collection;
fn.chain = chain;

fn.collect = collect;

fn.open = open;
fn.pipe = pipe;
fn.close = close;

fn.forEach = forEach;
fn.find = find;
fn.findKey = findKey;
fn.some = some;
fn.every = every;
fn.sort = sort;
fn.filter = filter;
fn.map = map;
fn.mapKeys = mapKeys;
fn.reduce = reduce;
fn.reduceRight = reduceRight;

if(typeof window !== 'undefined') { window.fn = fn }
if(typeof module !== 'undefined') { module.exports = fn }
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default={"type":"rune","version":"7.6.1","basic":{"name":"","rune":{"isrune":true,"tier":1,"type":"red"},"gold":{"base":0,"total":0,"sell":0,"purchasable":false},"group":"","description":"","colloq":";","plaintext":"","consumed":false,"stacks":1,"depth":1,"consumeOnFull":false,"from":[],"into":[],"specialRecipe":0,"inStore":true,"hideFromAll":false,"requiredChampion":"","stats":{"FlatHPPoolMod":0,"rFlatHPModPerLevel":0,"FlatMPPoolMod":0,"rFlatMPModPerLevel":0,"PercentHPPoolMod":0,"PercentMPPoolMod":0,"FlatHPRegenMod":0,"rFlatHPRegenModPerLevel":0,"PercentHPRegenMod":0,"FlatMPRegenMod":0,"rFlatMPRegenModPerLevel":0,"PercentMPRegenMod":0,"FlatArmorMod":0,"rFlatArmorModPerLevel":0,"PercentArmorMod":0,"rFlatArmorPenetrationMod":0,"rFlatArmorPenetrationModPerLevel":0,"rPercentArmorPenetrationMod":0,"rPercentArmorPenetrationModPerLevel":0,"FlatPhysicalDamageMod":0,"rFlatPhysicalDamageModPerLevel":0,"PercentPhysicalDamageMod":0,"FlatMagicDamageMod":0,"rFlatMagicDamageModPerLevel":0,"PercentMagicDamageMod":0,"FlatMovementSpeedMod":0,"rFlatMovementSpeedModPerLevel":0,"PercentMovementSpeedMod":0,"rPercentMovementSpeedModPerLevel":0,"FlatAttackSpeedMod":0,"PercentAttackSpeedMod":0,"rPercentAttackSpeedModPerLevel":0,"rFlatDodgeMod":0,"rFlatDodgeModPerLevel":0,"PercentDodgeMod":0,"FlatCritChanceMod":0,"rFlatCritChanceModPerLevel":0,"PercentCritChanceMod":0,"FlatCritDamageMod":0,"rFlatCritDamageModPerLevel":0,"PercentCritDamageMod":0,"FlatBlockMod":0,"PercentBlockMod":0,"FlatSpellBlockMod":0,"rFlatSpellBlockModPerLevel":0,"PercentSpellBlockMod":0,"FlatEXPBonus":0,"PercentEXPBonus":0,"rPercentCooldownMod":0,"rPercentCooldownModPerLevel":0,"rFlatTimeDeadMod":0,"rFlatTimeDeadModPerLevel":0,"rPercentTimeDeadMod":0,"rPercentTimeDeadModPerLevel":0,"rFlatGoldPer10Mod":0,"rFlatMagicPenetrationMod":0,"rFlatMagicPenetrationModPerLevel":0,"rPercentMagicPenetrationMod":0,"rPercentMagicPenetrationModPerLevel":0,"FlatEnergyRegenMod":0,"rFlatEnergyRegenModPerLevel":0,"FlatEnergyPoolMod":0,"rFlatEnergyModPerLevel":0,"PercentLifeStealMod":0,"PercentSpellVampMod":0},"tags":[],"maps":{"1":true,"8":true,"10":true,"12":true}},"data":{"10001":{"name":"Razer Mark of Precision","description":"+2.23% critical damage","image":{"full":"10001.png","sprite":"rune0.png","group":"rune","x":0,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatCritDamageMod":0.0223},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"10002":{"name":"Razer Quintessence of Speed","description":"+1.5% movement speed","image":{"full":"10002.png","sprite":"rune0.png","group":"rune","x":48,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentMovementSpeedMod":0.015},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5001":{"name":"Lesser Mark of Attack Damage","description":"+0.53 attack damage","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatPhysicalDamageMod":0.525},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5002":{"name":"Lesser Mark of Scaling Attack Damage","description":"+0.08 attack damage per level (+1.35 at champion level 18)","image":{"full":"r_2_1.png","sprite":"rune0.png","group":"rune","x":144,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatPhysicalDamageModPerLevel":0.075},"tags":["physicalAttack","perLevel","mark"],"colloq":null,"plaintext":null},"5003":{"name":"Lesser Mark of Attack Speed","description":"+0.94% attack speed","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"PercentAttackSpeedMod":0.0094},"tags":["physicalAttack","percent","mark"],"colloq":null,"plaintext":null},"5005":{"name":"Lesser Mark of Critical Damage","description":"+1.24% critical damage","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatCritDamageMod":0.0124},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5007":{"name":"Lesser Mark of Critical Chance","description":"+0.52% critical chance","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatCritChanceMod":0.0052},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5009":{"name":"Lesser Mark of Lethality","description":"+0.90 lethality","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{},"tags":["mark"],"colloq":null,"plaintext":null},"5011":{"name":"Lesser Mark of Health","description":"+1.93 health","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatHPPoolMod":1.9305},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5012":{"name":"Lesser Mark of Scaling Health","description":"+0.3 health per level (+5.4 at champion level 18)","image":{"full":"r_4_1.png","sprite":"rune0.png","group":"rune","x":240,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatHPModPerLevel":0.3005},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5013":{"name":"Lesser Mark of Armor","description":"+0.51 armor","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatArmorMod":0.508},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5015":{"name":"Lesser Mark of Magic Resist","description":"+0.43 magic resist","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatSpellBlockMod":0.43},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5016":{"name":"Lesser Mark of Scaling Magic Resist","description":"+0.04 magic resist per level (+0.72 at champion level 18)","image":{"full":"r_4_1.png","sprite":"rune0.png","group":"rune","x":240,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatSpellBlockModPerLevel":0.0412},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5021":{"name":"Lesser Mark of Cooldown Reduction","description":"-0.11% cooldowns","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rPercentCooldownMod":-0.0011},"tags":["utility","percent","mark"],"colloq":null,"plaintext":null},"5023":{"name":"Lesser Mark of Ability Power","description":"+0.33 ability power","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatMagicDamageMod":0.33},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5024":{"name":"Lesser Mark of Scaling Ability Power","description":"+0.06 ability power per level (+1.08 at champion level 18)","image":{"full":"r_4_1.png","sprite":"rune0.png","group":"rune","x":240,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatMagicDamageModPerLevel":0.0577},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5025":{"name":"Lesser Mark of Mana","description":"+3.28 mana","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatMPPoolMod":3.2813},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5026":{"name":"Lesser Mark of Scaling Mana","description":"+0.65 mana per level (+11.7 at champion level 18)","image":{"full":"r_2_1.png","sprite":"rune0.png","group":"rune","x":144,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatMPModPerLevel":0.6481},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5027":{"name":"Lesser Mark of Mana Regeneration","description":"+0.15 mana regen / 5 sec.","image":{"full":"r_3_1.png","sprite":"rune0.png","group":"rune","x":192,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatMPRegenMod":0.0292},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5029":{"name":"Lesser Mark of Magic Penetration","description":"+0.49 magic penetration","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.49},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5031":{"name":"Lesser Glyph of Attack Damage","description":"+0.16 attack damage","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatPhysicalDamageMod":0.1575},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5032":{"name":"Lesser Glyph of Scaling Attack Damage","description":"+0.02 attack damage per level (+0.36 at champion level 18)","image":{"full":"b_2_1.png","sprite":"rune0.png","group":"rune","x":336,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0225},"tags":["physicalAttack","perLevel","glyph"],"colloq":null,"plaintext":null},"5033":{"name":"Lesser Glyph of Attack Speed","description":"+0.35% attack speed","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"PercentAttackSpeedMod":0.0035},"tags":["physicalAttack","percent","glyph"],"colloq":null,"plaintext":null},"5035":{"name":"Lesser Glyph of Critical Damage","description":"+0.31% critical damage","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatCritDamageMod":0.0031},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5037":{"name":"Lesser Glyph of Critical Chance","description":"+0.15% critical chance","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatCritChanceMod":0.0015},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5041":{"name":"Lesser Glyph of Health","description":"+1.49 health","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatHPPoolMod":1.485},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5042":{"name":"Lesser Glyph of Scaling Health","description":"+0.3 health per level (+5.4 at champion level 18)","image":{"full":"b_4_1.png","sprite":"rune0.png","group":"rune","x":432,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatHPModPerLevel":0.3005},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5043":{"name":"Lesser Glyph of Armor","description":"+0.39 armor","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatArmorMod":0.3908},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5045":{"name":"Lesser Glyph of Magic Resist","description":"+0.74 magic resist","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatSpellBlockMod":0.74},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5046":{"name":"Lesser Glyph of Scaling Magic Resist","description":"+0.09 magic resist per level (+1.68 at champion level 18)","image":{"full":"b_4_1.png","sprite":"rune0.png","group":"rune","x":432,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatSpellBlockModPerLevel":0.0933},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5047":{"name":"Lesser Glyph of Health Regeneration","description":"+0.15 health regen / 5 sec.","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatHPRegenMod":0.03},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5051":{"name":"Lesser Glyph of Cooldown Reduction","description":"-0.47% cooldowns","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rPercentCooldownMod":-0.0047},"tags":["utility","percent","glyph"],"colloq":null,"plaintext":null},"5052":{"name":"Lesser Glyph of Scaling Cooldown Reduction","description":"-0.05% cooldowns per level (-0.93% at champion level 18)","image":{"full":"b_2_1.png","sprite":"rune0.png","group":"rune","x":336,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rPercentCooldownModPerLevel":-0.0005},"tags":["utility","percent","perLevel","glyph"],"colloq":null,"plaintext":null},"5053":{"name":"Lesser Glyph of Ability Power","description":"+0.66 ability power","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatMagicDamageMod":0.66},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5054":{"name":"Lesser Glyph of Scaling Ability Power","description":"+0.1 ability power per level (+1.8 at champion level 18)","image":{"full":"b_4_1.png","sprite":"rune0.png","group":"rune","x":432,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatMagicDamageModPerLevel":0.0962},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5055":{"name":"Lesser Glyph of Mana","description":"+6.25 mana","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatMPPoolMod":6.25},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5056":{"name":"Lesser Glyph of Scaling Mana","description":"+0.79 mana per level (+14.22 at champion level 18)","image":{"full":"b_2_1.png","sprite":"rune0.png","group":"rune","x":336,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatMPModPerLevel":0.787},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5057":{"name":"Lesser Glyph of Mana Regeneration","description":"+0.19 mana regen / 5 sec.","image":{"full":"b_3_1.png","sprite":"rune0.png","group":"rune","x":384,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatMPRegenMod":0.038},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5058":{"name":"Lesser Glyph of Scaling Mana Regeneration","description":"+0.04 mana regen / 5 sec. per level (+0.67 at champion level 18)","image":{"full":"b_4_1.png","sprite":"rune0.png","group":"rune","x":432,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatMPRegenModPerLevel":0.0074},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5059":{"name":"Lesser Glyph of Magic Penetration","description":"+0.35 magic penetration","image":{"full":"b_1_1.png","sprite":"rune0.png","group":"rune","x":288,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatMagicPenetrationMod":0.35},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5061":{"name":"Lesser Seal of Attack Damage","description":"+0.24 attack damage","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatPhysicalDamageMod":0.2364},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5062":{"name":"Lesser Seal of Scaling Attack Damage","description":"+0.03 attack damage per level (+0.61 at champion level 18)","image":{"full":"y_2_1.png","sprite":"rune0.png","group":"rune","x":48,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0338},"tags":["physicalAttack","perLevel","seal"],"colloq":null,"plaintext":null},"5063":{"name":"Lesser Seal of Attack Speed","description":"+0.42% attack speed","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"PercentAttackSpeedMod":0.0042},"tags":["physicalAttack","percent","seal"],"colloq":null,"plaintext":null},"5065":{"name":"Lesser Seal of Critical Damage","description":"+0.43% critical damage","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatCritDamageMod":0.0043},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5067":{"name":"Lesser Seal of Critical Chance","description":"+0.23% critical chance","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatCritChanceMod":0.0023},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5071":{"name":"Lesser Seal of Health","description":"+4.48 health","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatHPPoolMod":4.48},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5072":{"name":"Lesser Seal of Scaling Health","description":"+0.75 health per level (+13.44 at champion level 18)","image":{"full":"y_4_1.png","sprite":"rune0.png","group":"rune","x":144,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatHPModPerLevel":0.7467},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5073":{"name":"Lesser Seal of Armor","description":"+0.56 armor","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatArmorMod":0.56},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5074":{"name":"Lesser Seal of Scaling Armor","description":"+0.09 armor per level (+1.68 at champion level 18)","image":{"full":"y_2_1.png","sprite":"rune0.png","group":"rune","x":48,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatArmorModPerLevel":0.0933},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5075":{"name":"Lesser Seal of Magic Resist","description":"+0.41 magic resist","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatSpellBlockMod":0.4125},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5076":{"name":"Lesser Seal of Scaling Magic Resist","description":"+0.05 magic resist per level (+0.9 at champion level 18)","image":{"full":"y_4_1.png","sprite":"rune0.png","group":"rune","x":144,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatSpellBlockModPerLevel":0.0536},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5077":{"name":"Lesser Seal of Health Regeneration","description":"+0.31 health regen / 5 sec.","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatHPRegenMod":0.062},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5078":{"name":"Lesser Seal of Scaling Health Regeneration","description":"+0.06 health regen / 5 sec. per level (+1.08 at champion level 18)","image":{"full":"y_2_1.png","sprite":"rune0.png","group":"rune","x":48,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatHPRegenModPerLevel":0.0125},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5081":{"name":"Lesser Seal of Cooldown Reduction","description":"-0.2% cooldowns","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rPercentCooldownMod":-0.002},"tags":["utility","percent","seal"],"colloq":null,"plaintext":null},"5083":{"name":"Lesser Seal of Ability Power","description":"+0.33 ability power","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatMagicDamageMod":0.33},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5084":{"name":"Lesser Seal of Scaling Ability Power","description":"+0.06 ability power per level (+1.08 at champion level 18)","image":{"full":"y_4_1.png","sprite":"rune0.png","group":"rune","x":144,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatMagicDamageModPerLevel":0.0577},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5085":{"name":"Lesser Seal of Mana","description":"+3.83 mana","image":{"full":"y_1_1.png","sprite":"rune0.png","group":"rune","x":0,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatMPPoolMod":3.8281},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5086":{"name":"Lesser Seal of Scaling Mana","description":"+0.65 mana per level (+11.7 at champion level 18)","image":{"full":"y_2_1.png","sprite":"rune0.png","group":"rune","x":48,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatMPModPerLevel":0.6481},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5087":{"name":"Lesser Seal of Mana Regeneration","description":"+0.23 mana regen / 5 sec.","image":{"full":"y_3_1.png","sprite":"rune0.png","group":"rune","x":96,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatMPRegenMod":0.0451},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5088":{"name":"Lesser Seal of Scaling Mana Regeneration","description":"+0.036 mana regen / 5 sec. per level (+0.65 at champion level 18)","image":{"full":"y_4_1.png","sprite":"rune0.png","group":"rune","x":144,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatMPRegenModPerLevel":0.0072},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5091":{"name":"Lesser Quintessence of Attack Damage","description":"+1.25 attack damage","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatPhysicalDamageMod":1.25},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5092":{"name":"Lesser Quintessence of Scaling Attack Damage","description":"+0.14 attack damage per level (+2.52 at champion level 18)","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatPhysicalDamageModPerLevel":0.1389},"tags":["physicalAttack","perLevel","quintessence"],"colloq":null,"plaintext":null},"5093":{"name":"Lesser Quintessence of Attack Speed","description":"+2.52% attack speed","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"PercentAttackSpeedMod":0.0252},"tags":["physicalAttack","percent","quintessence"],"colloq":null,"plaintext":null},"5095":{"name":"Lesser Quintessence of Critical Damage","description":"+2.48% critical damage","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatCritDamageMod":0.0248},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5097":{"name":"Lesser Quintessence of Critical Chance","description":"+1.03% critical chance","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatCritChanceMod":0.0103},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5099":{"name":"Lesser Quintessence of Lethality","description":"+1.78 lethality","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{},"tags":["quintessence"],"colloq":null,"plaintext":null},"5101":{"name":"Lesser Quintessence of Health","description":"+14.5 health","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatHPPoolMod":14.5},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5102":{"name":"Lesser Quintessence of Scaling Health","description":"+1.5 health per level (+27 at champion level 18)","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatHPModPerLevel":1.5024},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5103":{"name":"Lesser Quintessence of Armor","description":"+2.37 armor","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatArmorMod":2.3684},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5104":{"name":"Lesser Quintessence of Scaling Armor","description":"+0.21 armor per level (+3.78 at champion level 18)","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatArmorModPerLevel":0.2083},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5105":{"name":"Lesser Quintessence of Magic Resist","description":"+2.22 magic resist","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatSpellBlockMod":2.22},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5106":{"name":"Lesser Quintessence of Scaling Magic Resist","description":"+0.21 magic resist per level (+3.78 at champion level 18)","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatSpellBlockModPerLevel":0.2062},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5107":{"name":"Lesser Quintessence of Health Regeneration","description":"+1.5 health regen / 5 sec.","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatHPRegenMod":0.3},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5108":{"name":"Lesser Quintessence of Scaling Health Regeneration","description":"+0.16 health regen / 5 sec. per level (+2.88 at champion level 18)","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatHPRegenModPerLevel":0.0313},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5111":{"name":"Lesser Quintessence of Cooldown Reduction","description":"-1.4% cooldowns","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rPercentCooldownMod":-0.014},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5112":{"name":"Lesser Quintessence of Scaling Cooldown Reduction","description":"-0.15% cooldowns per level (-2.8% at champion level 18)","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rPercentCooldownModPerLevel":-0.0016},"tags":["utility","percent","perLevel","quintessence"],"colloq":null,"plaintext":null},"5113":{"name":"Lesser Quintessence of Ability Power","description":"+2.75 ability power","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatMagicDamageMod":2.75},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5114":{"name":"Lesser Quintessence of Scaling Ability Power","description":"+0.24 ability power per level (+4.32 at champion level 18)","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatMagicDamageModPerLevel":0.2404},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5115":{"name":"Lesser Quintessence of Mana","description":"+20.83 mana","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatMPPoolMod":20.8333},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5116":{"name":"Lesser Quintessence of Scaling Mana","description":"+2.31 mana per level (+41.58 at champion level 18)","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatMPModPerLevel":2.3148},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5117":{"name":"Lesser Quintessence of Mana Regeneration","description":"+0.69 mana regen / 5 sec.","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"FlatMPRegenMod":0.1389},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5118":{"name":"Lesser Quintessence of Scaling Mana Regeneration","description":"+0.14 mana regen / 5 sec. per level (+2.52 at champion level 18)","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatMPRegenModPerLevel":0.0271},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5119":{"name":"Lesser Quintessence of Magic Penetration","description":"+1.11 magic penetration","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatMagicPenetrationMod":1.11},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5121":{"name":"Lesser Quintessence of Movement Speed","description":"+0.83% movement speed","image":{"full":"bl_3_1.png","sprite":"rune0.png","group":"rune","x":288,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"PercentMovementSpeedMod":0.0083},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5123":{"name":"Mark of Attack Damage","description":"+0.74 attack damage","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatPhysicalDamageMod":0.735},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5124":{"name":"Mark of Scaling Attack Damage","description":"+0.1 attack damage per level (+1.89 at champion level 18)","image":{"full":"r_2_2.png","sprite":"rune0.png","group":"rune","x":432,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatPhysicalDamageModPerLevel":0.105},"tags":["physicalAttack","perLevel","mark"],"colloq":null,"plaintext":null},"5125":{"name":"Mark of Attack Speed","description":"+1.32% attack speed","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"PercentAttackSpeedMod":0.0132},"tags":["physicalAttack","percent","mark"],"colloq":null,"plaintext":null},"5127":{"name":"Mark of Critical Damage","description":"+1.74% critical damage","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatCritDamageMod":0.0174},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5129":{"name":"Mark of Critical Chance","description":"+0.72% critical chance","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatCritChanceMod":0.0072},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5131":{"name":"Mark of Lethality","description":"+1.25 lethality","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{},"tags":["mark"],"colloq":null,"plaintext":null},"5133":{"name":"Mark of Health","description":"+2.7 health","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatHPPoolMod":2.7027},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5134":{"name":"Mark of Scaling Health","description":"+0.42 health per level (+7.56 at champion level 18)","image":{"full":"r_4_2.png","sprite":"rune0.png","group":"rune","x":48,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatHPModPerLevel":0.4207},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5135":{"name":"Mark of Armor","description":"+0.71 armor","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatArmorMod":0.7112},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5137":{"name":"Mark of Magic Resist","description":"+0.6 magic resist","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatSpellBlockMod":0.6},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5138":{"name":"Mark of Scaling Magic Resist","description":"+0.06 magic resist per level (+1.08 at champion level 18)","image":{"full":"r_4_2.png","sprite":"rune0.png","group":"rune","x":48,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatSpellBlockModPerLevel":0.0577},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5143":{"name":"Mark of Cooldown Reduction","description":"-0.16% cooldowns","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rPercentCooldownMod":-0.0016},"tags":["utility","percent","mark"],"colloq":null,"plaintext":null},"5145":{"name":"Mark of Ability Power","description":"+0.46 ability power","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatMagicDamageMod":0.462},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5146":{"name":"Mark of Scaling Ability Power","description":"+0.08 ability power per level (+1.44 at champion level 18)","image":{"full":"r_4_2.png","sprite":"rune0.png","group":"rune","x":48,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatMagicDamageModPerLevel":0.0808},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5147":{"name":"Mark of Mana","description":"+4.59 mana","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatMPPoolMod":4.5938},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5148":{"name":"Mark of Scaling Mana","description":"+0.91 mana per level (+16.38 at champion level 18)","image":{"full":"r_2_2.png","sprite":"rune0.png","group":"rune","x":432,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatMPModPerLevel":0.9074},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5149":{"name":"Mark of Mana Regeneration","description":"+0.2 mana regen / 5 sec.","image":{"full":"r_3_2.png","sprite":"rune0.png","group":"rune","x":0,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatMPRegenMod":0.0408},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5151":{"name":"Mark of Magic Penetration","description":"+0.68 magic penetration","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.68},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5153":{"name":"Glyph of Attack Damage","description":"+0.22 attack damage","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatPhysicalDamageMod":0.2205},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5154":{"name":"Glyph of Scaling Attack Damage","description":"+0.03 attack damage per level (+0.57 at champion level 18)","image":{"full":"b_2_2.png","sprite":"rune0.png","group":"rune","x":144,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0315},"tags":["physicalAttack","perLevel","glyph"],"colloq":null,"plaintext":null},"5155":{"name":"Glyph of Attack Speed","description":"+0.5% attack speed","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"PercentAttackSpeedMod":0.005},"tags":["physicalAttack","percent","glyph"],"colloq":null,"plaintext":null},"5157":{"name":"Glyph of Critical Damage","description":"+0.43% critical damage","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatCritDamageMod":0.0043},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5159":{"name":"Glyph of Critical Chance","description":"+0.22% critical chance","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatCritChanceMod":0.0022},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5163":{"name":"Glyph of Health","description":"+2.08 health","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatHPPoolMod":2.079},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5164":{"name":"Glyph of Scaling Health","description":"+0.42 health per level (+7.56 at champion level 18)","image":{"full":"b_4_2.png","sprite":"rune0.png","group":"rune","x":240,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatHPModPerLevel":0.4207},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5165":{"name":"Glyph of Armor","description":"+0.55 armor","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatArmorMod":0.5471},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5167":{"name":"Glyph of Magic Resist","description":"+1.04 magic resist","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatSpellBlockMod":1.04},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5168":{"name":"Glyph of Scaling Magic Resist","description":"+0.13 magic resist per level (+2.34 at champion level 18)","image":{"full":"b_4_2.png","sprite":"rune0.png","group":"rune","x":240,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatSpellBlockModPerLevel":0.13},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5169":{"name":"Glyph of Health Regeneration","description":"+0.21 health regen / 5 sec.","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatHPRegenMod":0.042},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5173":{"name":"Glyph of Cooldown Reduction","description":"-0.67% cooldowns","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rPercentCooldownMod":-0.0067},"tags":["utility","percent","glyph"],"colloq":null,"plaintext":null},"5174":{"name":"Glyph of Scaling Cooldown Reduction","description":"-0.07% cooldowns per level (-1.3% at champion level 18)","image":{"full":"b_2_2.png","sprite":"rune0.png","group":"rune","x":144,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rPercentCooldownModPerLevel":-0.0007},"tags":["utility","percent","perLevel","glyph"],"colloq":null,"plaintext":null},"5175":{"name":"Glyph of Ability Power","description":"+0.92 ability power","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatMagicDamageMod":0.92},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5176":{"name":"Glyph of Scaling Ability Power","description":"+0.13 ability power per level (+2.34 at champion level 18)","image":{"full":"b_4_2.png","sprite":"rune0.png","group":"rune","x":240,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatMagicDamageModPerLevel":0.1346},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5177":{"name":"Glyph of Mana","description":"+8.75 mana","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatMPPoolMod":8.75},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5178":{"name":"Glyph of Scaling Mana","description":"+1.1 mana per level (+19.8 at champion level 18)","image":{"full":"b_2_2.png","sprite":"rune0.png","group":"rune","x":144,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatMPModPerLevel":1.1019},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5179":{"name":"Glyph of Mana Regeneration","description":"+0.26 mana regen / 5 sec.","image":{"full":"b_3_2.png","sprite":"rune0.png","group":"rune","x":192,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"FlatMPRegenMod":0.052},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5180":{"name":"Glyph of Scaling Mana Regeneration","description":"+0.05 mana regen / 5 sec. per level (+0.94 at champion level 18)","image":{"full":"b_4_2.png","sprite":"rune0.png","group":"rune","x":240,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatMPRegenModPerLevel":0.0104},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5181":{"name":"Glyph of Magic Penetration","description":"+0.49 magic penetration","image":{"full":"b_1_2.png","sprite":"rune0.png","group":"rune","x":96,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rFlatMagicPenetrationMod":0.49},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5183":{"name":"Seal of Attack Damage","description":"+0.33 attack damage","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatPhysicalDamageMod":0.3309},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5184":{"name":"Seal of Scaling Attack Damage","description":"+0.05 attack damage per level (+0.85 at champion level 18)","image":{"full":"y_2_2.png","sprite":"rune0.png","group":"rune","x":336,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0473},"tags":["physicalAttack","perLevel","seal"],"colloq":null,"plaintext":null},"5185":{"name":"Seal of Attack Speed","description":"+0.59% attack speed","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"PercentAttackSpeedMod":0.0059},"tags":["physicalAttack","percent","seal"],"colloq":null,"plaintext":null},"5187":{"name":"Seal of Critical Damage","description":"+0.61% critical damage","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatCritDamageMod":0.0061},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5189":{"name":"Seal of Critical Chance","description":"+0.32% critical chance","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatCritChanceMod":0.0032},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5193":{"name":"Seal of Health","description":"+6.24 health","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatHPPoolMod":6.24},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5194":{"name":"Seal of Scaling Health","description":"+1.04 health per level (+18.72 at champion level 18)","image":{"full":"y_4_2.png","sprite":"rune0.png","group":"rune","x":432,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatHPModPerLevel":1.04},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5195":{"name":"Seal of Armor","description":"+0.78 armor","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatArmorMod":0.78},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5196":{"name":"Seal of Scaling Armor","description":"+0.13 armor per level (+2.34 at champion level 18)","image":{"full":"y_2_2.png","sprite":"rune0.png","group":"rune","x":336,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatArmorModPerLevel":0.13},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5197":{"name":"Seal of Magic Resist","description":"+0.58 magic resist","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatSpellBlockMod":0.5775},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5198":{"name":"Seal of Scaling Magic Resist","description":"+0.08 magic resist per level (+1.44 at champion level 18)","image":{"full":"y_4_2.png","sprite":"rune0.png","group":"rune","x":432,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatSpellBlockModPerLevel":0.075},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5199":{"name":"Seal of Health Regeneration","description":"+0.43 health regen / 5 sec.","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatHPRegenMod":0.086},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5200":{"name":"Seal of Scaling Health Regeneration","description":"+0.09 health regen / 5 sec. per level (+1.62 at champion level 18)","image":{"full":"y_2_2.png","sprite":"rune0.png","group":"rune","x":336,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatHPRegenModPerLevel":0.0175},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5203":{"name":"Seal of Cooldown Reduction","description":"-0.29% cooldowns","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rPercentCooldownMod":-0.0029},"tags":["utility","percent","seal"],"colloq":null,"plaintext":null},"5205":{"name":"Seal of Ability Power","description":"+0.46 ability power","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatMagicDamageMod":0.462},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5206":{"name":"Seal of Scaling Ability Power","description":"+0.08 ability power per level (+1.44 at champion level 18)","image":{"full":"y_4_2.png","sprite":"rune0.png","group":"rune","x":432,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatMagicDamageModPerLevel":0.0808},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5207":{"name":"Seal of Mana","description":"+5.36 mana","image":{"full":"y_1_2.png","sprite":"rune0.png","group":"rune","x":288,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatMPPoolMod":5.3594},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5208":{"name":"Seal of Scaling Mana","description":"+0.91 mana per level (+16.38 at champion level 18)","image":{"full":"y_2_2.png","sprite":"rune0.png","group":"rune","x":336,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatMPModPerLevel":0.9074},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5209":{"name":"Seal of Mana Regeneration","description":"+0.32 mana regen / 5 sec.","image":{"full":"y_3_2.png","sprite":"rune0.png","group":"rune","x":384,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"FlatMPRegenMod":0.0632},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5210":{"name":"Seal of Scaling Mana Regeneration","description":"+0.05 mana regen / 5 sec. per level (+0.9 at champion level 18)","image":{"full":"y_4_2.png","sprite":"rune0.png","group":"rune","x":432,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"rFlatMPRegenModPerLevel":0.01},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5213":{"name":"Quintessence of Attack Damage","description":"+1.75 attack damage","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatPhysicalDamageMod":1.75},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5214":{"name":"Quintessence of Scaling Attack Damage","description":"+0.19 attack damage per level (+3.42 at champion level 18)","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatPhysicalDamageModPerLevel":0.1944},"tags":["physicalAttack","perLevel","quintessence"],"colloq":null,"plaintext":null},"5215":{"name":"Quintessence of Attack Speed","description":"+3.51% attack speed","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentAttackSpeedMod":0.0351},"tags":["physicalAttack","percent","quintessence"],"colloq":null,"plaintext":null},"5217":{"name":"Quintessence of Critical Damage","description":"+3.47% critical damage","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatCritDamageMod":0.0347},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5219":{"name":"Quintessence of Critical Chance","description":"+1.44% critical chance","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatCritChanceMod":0.0144},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5221":{"name":"Quintessence of Lethality","description":"+2.49 lethality","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{},"tags":["quintessence"],"colloq":null,"plaintext":null},"5223":{"name":"Quintessence of Health","description":"+20 health","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatHPPoolMod":20},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5224":{"name":"Quintessence of Scaling Health","description":"+2.1 health per level (+37.8 at champion level 18)","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatHPModPerLevel":2.1034},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5225":{"name":"Quintessence of Armor","description":"+3.32 armor","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatArmorMod":3.3158},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5226":{"name":"Quintessence of Scaling Armor","description":"+0.29 armor per level (+5.22 at champion level 18)","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatArmorModPerLevel":0.2917},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5227":{"name":"Quintessence of Magic Resist","description":"+3.11 magic resist","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatSpellBlockMod":3.11},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5228":{"name":"Quintessence of Scaling Magic Resist","description":"+0.29 magic resist per level (+5.22 at champion level 18)","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatSpellBlockModPerLevel":0.2886},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5229":{"name":"Quintessence of Health Regeneration","description":"+2.1 health regen / 5 sec.","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatHPRegenMod":0.42},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5230":{"name":"Quintessence of Scaling Health Regeneration","description":"+0.22 health regen / 5 sec. per level (+3.96 at champion level 18)","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatHPRegenModPerLevel":0.0438},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5233":{"name":"Quintessence of Cooldown Reduction","description":"-1.95% cooldowns","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rPercentCooldownMod":-0.0195},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5234":{"name":"Quintessence of Scaling Cooldown Reduction","description":"-0.21% cooldowns per level (-3.9% at champion level 18)","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rPercentCooldownModPerLevel":-0.0022},"tags":["utility","percent","perLevel","quintessence"],"colloq":null,"plaintext":null},"5235":{"name":"Quintessence of Ability Power","description":"+3.85 ability power","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatMagicDamageMod":3.85},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5236":{"name":"Quintessence of Scaling Ability Power","description":"+0.34 ability power per level (+6.12 at champion level 18)","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMagicDamageModPerLevel":0.3365},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5237":{"name":"Quintessence of Mana","description":"+29.17 mana","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatMPPoolMod":29.1667},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5238":{"name":"Quintessence of Scaling Mana","description":"+3.24 mana per level (+58.32 at champion level 18)","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMPModPerLevel":3.2407},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5239":{"name":"Quintessence of Mana Regeneration","description":"+0.97 mana regen / 5 sec.","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatMPRegenMod":0.1944},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5240":{"name":"Quintessence of Scaling Mana Regeneration","description":"+0.19 mana regen / 5 sec. per level (+3.42 at champion level 18)","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMPRegenModPerLevel":0.038},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5241":{"name":"Quintessence of Magic Penetration","description":"+1.56 magic penetration","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMagicPenetrationMod":1.56},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5243":{"name":"Quintessence of Movement Speed","description":"+1.17% movement speed","image":{"full":"bl_3_2.png","sprite":"rune0.png","group":"rune","x":96,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentMovementSpeedMod":0.0117},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5245":{"name":"Greater Mark of Attack Damage","description":"+0.95 attack damage","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatPhysicalDamageMod":0.945},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5246":{"name":"Greater Mark of Scaling Attack Damage","description":"+0.13 attack damage per level (+2.43 at champion level 18)","image":{"full":"r_2_3.png","sprite":"rune0.png","group":"rune","x":240,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatPhysicalDamageModPerLevel":0.135},"tags":["physicalAttack","perLevel","mark"],"colloq":null,"plaintext":null},"5247":{"name":"Greater Mark of Attack Speed","description":"+1.7% attack speed","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"PercentAttackSpeedMod":0.017},"tags":["physicalAttack","percent","mark"],"colloq":null,"plaintext":null},"5249":{"name":"Greater Mark of Critical Damage","description":"+2.23% critical damage","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatCritDamageMod":0.0223},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5251":{"name":"Greater Mark of Critical Chance","description":"+0.93% critical chance","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatCritChanceMod":0.0093},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"5253":{"name":"Greater Mark of Lethality","description":"+1.60 lethality","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{},"tags":["mark"],"colloq":null,"plaintext":null},"5255":{"name":"Greater Mark of Health","description":"+3.47 health","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatHPPoolMod":3.4749},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5256":{"name":"Greater Mark of Scaling Health","description":"+0.54 health per level (+9.72 at champion level 18)","image":{"full":"r_4_3.png","sprite":"rune0.png","group":"rune","x":336,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatHPModPerLevel":0.5409},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5257":{"name":"Greater Mark of Armor","description":"+0.91 armor","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatArmorMod":0.9144},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5259":{"name":"Greater Mark of Magic Resist","description":"+0.77 magic resist","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatSpellBlockMod":0.77},"tags":["defense","flat","mark"],"colloq":null,"plaintext":null},"5260":{"name":"Greater Mark of Scaling Magic Resist","description":"+0.07 magic resist per level (+1.26 at champion level 18)","image":{"full":"r_4_3.png","sprite":"rune0.png","group":"rune","x":336,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatSpellBlockModPerLevel":0.0742},"tags":["defense","perLevel","mark"],"colloq":null,"plaintext":null},"5265":{"name":"Greater Mark of Cooldown Reduction","description":"-0.2% cooldowns","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rPercentCooldownMod":-0.002},"tags":["utility","percent","mark"],"colloq":null,"plaintext":null},"5267":{"name":"Greater Mark of Ability Power","description":"+0.59 ability power","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatMagicDamageMod":0.594},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5268":{"name":"Greater Mark of Scaling Ability Power","description":"+0.1 ability power per level (+1.8 at champion level 18)","image":{"full":"r_4_3.png","sprite":"rune0.png","group":"rune","x":336,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatMagicDamageModPerLevel":0.1038},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5269":{"name":"Greater Mark of Mana","description":"+5.91 mana","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatMPPoolMod":5.9063},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5270":{"name":"Greater Mark of Scaling Mana","description":"+1.17 mana per level (+21.06 at champion level 18)","image":{"full":"r_2_3.png","sprite":"rune0.png","group":"rune","x":240,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatMPModPerLevel":1.1667},"tags":["magic","perLevel","mark"],"colloq":null,"plaintext":null},"5271":{"name":"Greater Mark of Mana Regeneration","description":"+0.26 mana regen / 5 sec.","image":{"full":"r_3_3.png","sprite":"rune0.png","group":"rune","x":288,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"FlatMPRegenMod":0.0525},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5273":{"name":"Greater Mark of Magic Penetration","description":"+0.87 magic penetration","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.87},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5275":{"name":"Greater Glyph of Attack Damage","description":"+0.28 attack damage","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatPhysicalDamageMod":0.2835},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5276":{"name":"Greater Glyph of Scaling Attack Damage","description":"+0.04 attack damage per level (+0.73 at champion level 18)","image":{"full":"b_2_3.png","sprite":"rune0.png","group":"rune","x":432,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0405},"tags":["physicalAttack","perLevel","glyph"],"colloq":null,"plaintext":null},"5277":{"name":"Greater Glyph of Attack Speed","description":"+0.64% attack speed","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"PercentAttackSpeedMod":0.0064},"tags":["physicalAttack","percent","glyph"],"colloq":null,"plaintext":null},"5279":{"name":"Greater Glyph of Critical Damage","description":"+0.56% critical damage","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatCritDamageMod":0.0056},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5281":{"name":"Greater Glyph of Critical Chance","description":"+0.28% critical chance","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatCritChanceMod":0.0028},"tags":["physicalAttack","flat","glyph"],"colloq":null,"plaintext":null},"5285":{"name":"Greater Glyph of Health","description":"+2.67 health","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatHPPoolMod":2.673},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5286":{"name":"Greater Glyph of Scaling Health","description":"+0.54 health per level (+9.72 at champion level 18)","image":{"full":"b_4_3.png","sprite":"rune0.png","group":"rune","x":48,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatHPModPerLevel":0.5409},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5287":{"name":"Greater Glyph of Armor","description":"+0.7 armor","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatArmorMod":0.7034},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5289":{"name":"Greater Glyph of Magic Resist","description":"+1.34 magic resist","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatSpellBlockMod":1.34},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5290":{"name":"Greater Glyph of Scaling Magic Resist","description":"+0.16 magic resist per level (+3 at champion level 18)","image":{"full":"b_4_3.png","sprite":"rune0.png","group":"rune","x":48,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatSpellBlockModPerLevel":0.1667},"tags":["defense","perLevel","glyph"],"colloq":null,"plaintext":null},"5291":{"name":"Greater Glyph of Health Regeneration","description":"+0.27 health regen / 5 sec.","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatHPRegenMod":0.054},"tags":["defense","flat","glyph"],"colloq":null,"plaintext":null},"5295":{"name":"Greater Glyph of Cooldown Reduction","description":"-0.83% cooldowns","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rPercentCooldownMod":-0.0083},"tags":["utility","percent","glyph"],"colloq":null,"plaintext":null},"5296":{"name":"Greater Glyph of Scaling Cooldown Reduction","description":"-0.09% cooldowns per level (-1.67% at champion level 18)","image":{"full":"b_2_3.png","sprite":"rune0.png","group":"rune","x":432,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rPercentCooldownModPerLevel":-0.0009},"tags":["utility","percent","perLevel","glyph"],"colloq":null,"plaintext":null},"5297":{"name":"Greater Glyph of Ability Power","description":"+1.19 ability power","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatMagicDamageMod":1.19},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5298":{"name":"Greater Glyph of Scaling Ability Power","description":"+0.17 ability power per level (+3.06 at champion level 18)","image":{"full":"b_4_3.png","sprite":"rune0.png","group":"rune","x":48,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatMagicDamageModPerLevel":0.1731},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5299":{"name":"Greater Glyph of Mana","description":"+11.25 mana","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatMPPoolMod":11.25},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5300":{"name":"Greater Glyph of Scaling Mana","description":"+1.42 mana per level (+25.56 at champion level 18)","image":{"full":"b_2_3.png","sprite":"rune0.png","group":"rune","x":432,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatMPModPerLevel":1.4167},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5301":{"name":"Greater Glyph of Mana Regeneration","description":"+0.33 mana regen / 5 sec.","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatMPRegenMod":0.066},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5302":{"name":"Greater Glyph of Scaling Mana Regeneration","description":"+0.06 mana regen / 5 sec. per level (+1.2 at champion level 18)","image":{"full":"b_4_3.png","sprite":"rune0.png","group":"rune","x":48,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatMPRegenModPerLevel":0.0133},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"5303":{"name":"Greater Glyph of Magic Penetration","description":"+0.63 magic penetration","image":{"full":"b_1_3.png","sprite":"rune0.png","group":"rune","x":384,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatMagicPenetrationMod":0.63},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"5305":{"name":"Greater Seal of Attack Damage","description":"+0.43 attack damage","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatPhysicalDamageMod":0.4254},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5306":{"name":"Greater Seal of Scaling Attack Damage","description":"+0.06 attack damage per level (+1.09 at champion level 18)","image":{"full":"y_2_3.png","sprite":"rune0.png","group":"rune","x":144,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatPhysicalDamageModPerLevel":0.0608},"tags":["physicalAttack","perLevel","seal"],"colloq":null,"plaintext":null},"5307":{"name":"Greater Seal of Attack Speed","description":"+0.76% attack speed","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"PercentAttackSpeedMod":0.0076},"tags":["physicalAttack","percent","seal"],"colloq":null,"plaintext":null},"5309":{"name":"Greater Seal of Critical Damage","description":"+0.78% critical damage","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatCritDamageMod":0.0078},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5311":{"name":"Greater Seal of Critical Chance","description":"+0.42% critical chance","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatCritChanceMod":0.0042},"tags":["physicalAttack","flat","seal"],"colloq":null,"plaintext":null},"5315":{"name":"Greater Seal of Health","description":"+8 health","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatHPPoolMod":8},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5316":{"name":"Greater Seal of Scaling Health","description":"+1.33 health per level (+24 at champion level 18)","image":{"full":"y_4_3.png","sprite":"rune0.png","group":"rune","x":240,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatHPModPerLevel":1.3334},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5317":{"name":"Greater Seal of Armor","description":"+1 armor","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatArmorMod":1},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5318":{"name":"Greater Seal of Scaling Armor","description":"+0.16 armor per level (+3 at champion level 18)","image":{"full":"y_2_3.png","sprite":"rune0.png","group":"rune","x":144,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatArmorModPerLevel":0.1667},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5319":{"name":"Greater Seal of Magic Resist","description":"+0.74 magic resist","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatSpellBlockMod":0.7425},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5320":{"name":"Greater Seal of Scaling Magic Resist","description":"+0.1 magic resist per level (+1.8 at champion level 18)","image":{"full":"y_4_3.png","sprite":"rune0.png","group":"rune","x":240,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatSpellBlockModPerLevel":0.0965},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5321":{"name":"Greater Seal of Health Regeneration","description":"+0.56 health regen / 5 sec.","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatHPRegenMod":0.1112},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"5322":{"name":"Greater Seal of Scaling Health Regeneration","description":"+0.11 health regen / 5 sec. per level (+1.98 at champion level 18)","image":{"full":"y_2_3.png","sprite":"rune0.png","group":"rune","x":144,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatHPRegenModPerLevel":0.0225},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"5325":{"name":"Greater Seal of Cooldown Reduction","description":"-0.36% cooldowns","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rPercentCooldownMod":-0.0036},"tags":["utility","percent","seal"],"colloq":null,"plaintext":null},"5327":{"name":"Greater Seal of Ability Power","description":"+0.59 ability power","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatMagicDamageMod":0.594},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5328":{"name":"Greater Seal of Scaling Ability Power","description":"+0.1 ability power per level (+1.8 at champion level 18)","image":{"full":"y_4_3.png","sprite":"rune0.png","group":"rune","x":240,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatMagicDamageModPerLevel":0.1038},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5329":{"name":"Greater Seal of Mana","description":"+6.89 mana","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatMPPoolMod":6.8906},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5330":{"name":"Greater Seal of Scaling Mana","description":"+1.17 mana per level (+21.06 at champion level 18)","image":{"full":"y_2_3.png","sprite":"rune0.png","group":"rune","x":144,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatMPModPerLevel":1.1667},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5331":{"name":"Greater Seal of Mana Regeneration","description":"+0.41 mana regen / 5 sec.","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatMPRegenMod":0.0813},"tags":["magic","flat","seal"],"colloq":null,"plaintext":null},"5332":{"name":"Greater Seal of Scaling Mana Regeneration","description":"+0.065 mana regen / 5 sec. per level (+1.17 at champion level 18)","image":{"full":"y_4_3.png","sprite":"rune0.png","group":"rune","x":240,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatMPRegenModPerLevel":0.013},"tags":["magic","perLevel","seal"],"colloq":null,"plaintext":null},"5335":{"name":"Greater Quintessence of Attack Damage","description":"+2.25 attack damage","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatPhysicalDamageMod":2.25},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5336":{"name":"Greater Quintessence of Scaling Attack Damage","description":"+0.25 attack damage per level (+4.5 at champion level 18)","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatPhysicalDamageModPerLevel":0.25},"tags":["physicalAttack","perLevel","quintessence"],"colloq":null,"plaintext":null},"5337":{"name":"Greater Quintessence of Attack Speed","description":"+4.5% attack speed","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentAttackSpeedMod":0.045},"tags":["physicalAttack","percent","quintessence"],"colloq":null,"plaintext":null},"5339":{"name":"Greater Quintessence of Critical Damage","description":"+4.46% critical damage","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatCritDamageMod":0.0446},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5341":{"name":"Greater Quintessence of Critical Chance","description":"+1.86% critical chance","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatCritChanceMod":0.0186},"tags":["physicalAttack","flat","quintessence"],"colloq":null,"plaintext":null},"5343":{"name":"Greater Quintessence of Lethality","description":"+3.20 lethality","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{},"tags":["quintessence"],"colloq":null,"plaintext":null},"5345":{"name":"Greater Quintessence of Health","description":"+26 health","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatHPPoolMod":26},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5346":{"name":"Greater Quintessence of Scaling Health","description":"+2.7 health per level (+48.6 at champion level 18)","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatHPModPerLevel":2.7043},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5347":{"name":"Greater Quintessence of Armor","description":"+4.26 armor","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatArmorMod":4.2632},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5348":{"name":"Greater Quintessence of Scaling Armor","description":"+0.38 armor per level (+6.84 at champion level 18)","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatArmorModPerLevel":0.375},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5349":{"name":"Greater Quintessence of Magic Resist","description":"+4 magic resist","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatSpellBlockMod":4},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5350":{"name":"Greater Quintessence of Scaling Magic Resist","description":"+0.37 magic resist per level (+6.66 at champion level 18)","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatSpellBlockModPerLevel":0.3711},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5351":{"name":"Greater Quintessence of Health Regeneration","description":"+2.7 health regen / 5 sec.","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatHPRegenMod":0.54},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"5352":{"name":"Greater Quintessence of Scaling Health Regeneration","description":"+0.28 health regen / 5 sec. per level (+5.04 at champion level 18)","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatHPRegenModPerLevel":0.0563},"tags":["defense","perLevel","quintessence"],"colloq":null,"plaintext":null},"5355":{"name":"Greater Quintessence of Cooldown Reduction","description":"-2.5% cooldowns","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rPercentCooldownMod":-0.025},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5356":{"name":"Greater Quintessence of Scaling Cooldown Reduction","description":"-0.28% cooldowns per level (-5% at champion level 18)","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rPercentCooldownModPerLevel":-0.0028},"tags":["utility","percent","perLevel","quintessence"],"colloq":null,"plaintext":null},"5357":{"name":"Greater Quintessence of Ability Power","description":"+4.95 ability power","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatMagicDamageMod":4.95},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5358":{"name":"Greater Quintessence of Scaling Ability Power","description":"+0.43 ability power per level (+7.74 at champion level 18)","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMagicDamageModPerLevel":0.4327},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5359":{"name":"Greater Quintessence of Mana","description":"+37.5 mana","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatMPPoolMod":37.5},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5360":{"name":"Greater Quintessence of Scaling Mana","description":"+4.17 mana per level (+75.06 at champion level 18)","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMPModPerLevel":4.1667},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5361":{"name":"Greater Quintessence of Mana Regeneration","description":"+1.25 mana regen / 5 sec.","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatMPRegenMod":0.25},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5362":{"name":"Greater Quintessence of Scaling Mana Regeneration","description":"+0.24 mana regen / 5 sec. per level (+4.32 at champion level 18)","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMPRegenModPerLevel":0.0488},"tags":["magic","perLevel","quintessence"],"colloq":null,"plaintext":null},"5363":{"name":"Greater Quintessence of Magic Penetration","description":"+2.01 magic penetration","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMagicPenetrationMod":2.01},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5365":{"name":"Greater Quintessence of Movement Speed","description":"+1.5% movement speed","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentMovementSpeedMod":0.015},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5366":{"name":"Greater Quintessence of Revival","description":"-5% time dead","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rPercentTimeDeadMod":0.05},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5367":{"name":"Greater Quintessence of Gold","description":"+1 gold / 10 sec.","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatGoldPer10Mod":1},"tags":["utility","quintessence"],"colloq":null,"plaintext":null},"5368":{"name":"Greater Quintessence of Experience","description":"+2% experience gained","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentEXPBonus":0.02},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"5369":{"name":"Greater Seal of Energy Regeneration","description":"+0.63 Energy regen/5 sec","image":{"full":"y_1_3.png","sprite":"rune0.png","group":"rune","x":96,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"FlatEnergyRegenMod":0.126},"tags":["seal"],"colloq":null,"plaintext":null},"5370":{"name":"Greater Seal of Scaling Energy Regeneration","description":"+0.064 Energy regen/5 sec per level (+1.15 at champion level 18)","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatEnergyRegenModPerLevel":0.0128},"tags":["seal"],"colloq":null,"plaintext":null},"5371":{"name":"Greater Glyph of Energy","description":"+2.2 Energy","image":{"full":"b_3_3.png","sprite":"rune0.png","group":"rune","x":0,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"FlatEnergyPoolMod":2.2},"tags":["glyph"],"colloq":null,"plaintext":null},"5372":{"name":"Greater Glyph of Scaling Energy","description":"+0.161 Energy/level (+2.89 at level 18)","image":{"full":"b_2_3.png","sprite":"rune0.png","group":"rune","x":432,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"blue"},"stats":{"rFlatEnergyModPerLevel":0.161},"tags":["glyph"],"colloq":null,"plaintext":null},"5373":{"name":"Greater Quintessence of Energy Regeneration","description":"+1.575 Energy regen/5 sec","image":{"full":"bl_2_3.png","sprite":"rune0.png","group":"rune","x":336,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatEnergyRegenMod":0.315},"tags":["quintessence"],"colloq":null,"plaintext":null},"5374":{"name":"Greater Quintessence of Energy","description":"+5.4 Energy","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatEnergyPoolMod":5.4},"tags":["quintessence"],"colloq":null,"plaintext":null},"5400":{"name":"Lesser Mark of Precision","description":"+0.63 Lethality / +0.34 Magic Penetration","image":{"full":"r_1_1.png","sprite":"rune0.png","group":"rune","x":96,"y":0,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.34},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5401":{"name":"Mark of Precision","description":"+0.7 Leth / +0.48 M.Pen","image":{"full":"r_1_2.png","sprite":"rune0.png","group":"rune","x":384,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.48},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5402":{"name":"Greater Mark of Precision","description":"+1.13 Lethality / +0.62 Magic Penetration","image":{"full":"r_1_3.png","sprite":"rune0.png","group":"rune","x":192,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"red"},"stats":{"rFlatMagicPenetrationMod":0.61},"tags":["magic","flat","mark"],"colloq":null,"plaintext":null},"5403":{"name":"Greater Seal of Gold","description":"+0.25 gold / 10 sec.","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"rFlatGoldPer10Mod":0.25},"tags":["utility","seal"],"colloq":null,"plaintext":null},"5404":{"name":"Lesser Quintessence of Percent Health","description":"+0.84% increased health.","image":{"full":"bl_2_1.png","sprite":"rune0.png","group":"rune","x":240,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"PercentHPPoolMod":0.0084},"tags":["defense","percent","quintessence"],"colloq":null,"plaintext":null},"5405":{"name":"Quintessence of Percent Health","description":"+1.17% increased health.","image":{"full":"bl_2_2.png","sprite":"rune0.png","group":"rune","x":48,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentHPPoolMod":0.0117},"tags":["defense","percent","quintessence"],"colloq":null,"plaintext":null},"5406":{"name":"Greater Quintessence of Percent Health","description":"+1.5% increased health.","image":{"full":"bl_3_3.png","sprite":"rune0.png","group":"rune","x":384,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentHPPoolMod":0.015},"tags":["defense","percent","quintessence"],"colloq":null,"plaintext":null},"5407":{"name":"Lesser Quintessence of Spell Vamp","description":"+1.12% Spellvamp.","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"PercentSpellVampMod":0.0112},"tags":["quintessence"],"colloq":null,"plaintext":null},"5408":{"name":"Quintessence of Spell Vamp","description":"+1.56% Spellvamp.","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentSpellVampMod":0.0156},"tags":["quintessence"],"colloq":null,"plaintext":null},"5409":{"name":"Greater Quintessence of Spell Vamp","description":"+2% Spellvamp.","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentSpellVampMod":0.02},"tags":["quintessence"],"colloq":null,"plaintext":null},"5410":{"name":"Lesser Quintessence of Life Steal","description":"+0.84% Life Steal","image":{"full":"bl_1_1.png","sprite":"rune0.png","group":"rune","x":192,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"PercentLifeStealMod":0.0084},"tags":["quintessence"],"colloq":null,"plaintext":null},"5411":{"name":"Quintessence of Life Steal","description":"+1.17% Life Steal","image":{"full":"bl_1_2.png","sprite":"rune0.png","group":"rune","x":0,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentLifeStealMod":0.0117},"tags":["quintessence"],"colloq":null,"plaintext":null},"5412":{"name":"Greater Quintessence of Life Steal","description":"+1.5% Life Steal.","image":{"full":"bl_1_3.png","sprite":"rune0.png","group":"rune","x":288,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentLifeStealMod":0.015},"tags":["quintessence"],"colloq":null,"plaintext":null},"5413":{"name":"Lesser Seal of Percent Health","description":"+0.28% Health.","image":{"full":"y_2_1.png","sprite":"rune0.png","group":"rune","x":48,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"PercentHPPoolMod":0.0028},"tags":["defense","percent","seal"],"colloq":null,"plaintext":null},"5414":{"name":"Seal of Percent Health","description":"+0.39% Health.","image":{"full":"y_2_2.png","sprite":"rune0.png","group":"rune","x":336,"y":96,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"yellow"},"stats":{"PercentHPPoolMod":0.0039},"tags":["defense","percent","seal"],"colloq":null,"plaintext":null},"5415":{"name":"Greater Seal of Percent Health","description":"+0.5% Health.","image":{"full":"y_3_3.png","sprite":"rune0.png","group":"rune","x":192,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"yellow"},"stats":{"PercentHPPoolMod":0.005},"tags":["defense","percent","seal"],"colloq":null,"plaintext":null},"5416":{"name":"Lesser Quintessence of Precision","description":"+1.24 Lethality / +0.78 Magic Penetration","image":{"full":"bl_4_1.png","sprite":"rune0.png","group":"rune","x":336,"y":48,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"black"},"stats":{"rFlatMagicPenetrationMod":0.78},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5417":{"name":"Quintessence of Precision","description":"+1.74 Lethality / +1.09 Magic Penetration","image":{"full":"bl_4_2.png","sprite":"rune0.png","group":"rune","x":144,"y":144,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMagicPenetrationMod":1.09},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"5418":{"name":"Greater Quintessence of Precision","description":"+2.24 Lethality / +1.4 Magic Penetration","image":{"full":"bl_4_3.png","sprite":"rune0.png","group":"rune","x":432,"y":192,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMagicPenetrationMod":1.4},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"8001":{"name":"Mark of the Crippling Candy Cane","description":"+2% critical damage","image":{"full":"8001.png","sprite":"rune0.png","group":"rune","x":0,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatCritDamageMod":0.0198},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"8002":{"name":"Lesser Mark of the Yuletide Tannenbaum ","description":"+0.62% critical chance","image":{"full":"8002.png","sprite":"rune0.png","group":"rune","x":48,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"FlatCritChanceMod":0.0062},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"8003":{"name":"Glyph of the Special Stocking","description":"-0.75% cooldowns","image":{"full":"8003.png","sprite":"rune0.png","group":"rune","x":96,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rPercentCooldownMod":-0.0075},"tags":["utility","percent","glyph"],"colloq":null,"plaintext":null},"8005":{"name":"Lesser Glyph of the Gracious Gift","description":"+0.12 ability power per level (+2.16 at champion level 18)","image":{"full":"8005.png","sprite":"rune0.png","group":"rune","x":144,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"rFlatMagicDamageModPerLevel":0.1154},"tags":["magic","perLevel","glyph"],"colloq":null,"plaintext":null},"8006":{"name":"Lesser Seal of the Stout Snowman","description":"+0.72 health per level (+12.96 at champion level 18)","image":{"full":"8006.png","sprite":"rune0.png","group":"rune","x":192,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"rFlatHPModPerLevel":0.7211},"tags":["defense","perLevel","seal"],"colloq":null,"plaintext":null},"8007":{"name":"Lesser Mark of Alpine Attack Speed","description":"+1.13% attack speed","image":{"full":"8007.png","sprite":"rune0.png","group":"rune","x":240,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"red"},"stats":{"PercentAttackSpeedMod":0.0113},"tags":["physicalAttack","percent","mark"],"colloq":null,"plaintext":null},"8008":{"name":"Mark of the Combatant","description":"+2% critical damage","image":{"full":"8008.png","sprite":"rune0.png","group":"rune","x":288,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"red"},"stats":{"FlatCritDamageMod":0.0198},"tags":["physicalAttack","flat","mark"],"colloq":null,"plaintext":null},"8009":{"name":"Lesser Seal of the Medalist","description":"+3.56 health","image":{"full":"8009.png","sprite":"rune0.png","group":"rune","x":336,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"yellow"},"stats":{"FlatHPPoolMod":3.564},"tags":["defense","flat","seal"],"colloq":null,"plaintext":null},"8011":{"name":"Lesser Glyph of the Challenger","description":"+0.66 ability power","image":{"full":"8011.png","sprite":"rune0.png","group":"rune","x":384,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"1","type":"blue"},"stats":{"FlatMagicDamageMod":0.66},"tags":["magic","flat","glyph"],"colloq":null,"plaintext":null},"8012":{"name":"Glyph of the Soaring Slalom","description":"-0.75% cooldowns","image":{"full":"8012.png","sprite":"rune0.png","group":"rune","x":432,"y":240,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"blue"},"stats":{"rPercentCooldownMod":-0.0075},"tags":["utility","percent","glyph"],"colloq":null,"plaintext":null},"8013":{"name":"Quintessence of the Headless Horseman","description":"+2.96 lethality","image":{"full":"8013.png","sprite":"rune0.png","group":"rune","x":0,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{},"tags":["quintessence"],"colloq":null,"plaintext":null},"8014":{"name":"Quintessence of the Piercing Screech","description":"+1.85 magic penetration","image":{"full":"8014.png","sprite":"rune0.png","group":"rune","x":48,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"rFlatMagicPenetrationMod":1.85},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"8015":{"name":"Quintessence of Bountiful Treats","description":"+24 health","image":{"full":"8015.png","sprite":"rune0.png","group":"rune","x":96,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatHPPoolMod":24},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"8016":{"name":"Quintessence of the Speedy Specter","description":"+1.39% movement speed","image":{"full":"8016.png","sprite":"rune0.png","group":"rune","x":144,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"PercentMovementSpeedMod":0.0139},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"8017":{"name":"Quintessence of the Witches Brew","description":"+4.56 ability power","image":{"full":"8017.png","sprite":"rune0.png","group":"rune","x":192,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"2","type":"black"},"stats":{"FlatMagicDamageMod":4.56},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"8019":{"name":"Greater Quintessence of the Piercing Present","description":"+2.01 magic penetration","image":{"full":"8019.png","sprite":"rune0.png","group":"rune","x":240,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"rFlatMagicPenetrationMod":2.01},"tags":["magic","flat","quintessence"],"colloq":null,"plaintext":null},"8020":{"name":"Greater Quintessence of the Deadly Wreath","description":"+3.20 lethality","image":{"full":"8020.png","sprite":"rune0.png","group":"rune","x":288,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{},"tags":["quintessence"],"colloq":null,"plaintext":null},"8021":{"name":"Greater Quintessence of Frosty Health","description":"+26 health","image":{"full":"8021.png","sprite":"rune0.png","group":"rune","x":336,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"FlatHPPoolMod":26},"tags":["defense","flat","quintessence"],"colloq":null,"plaintext":null},"8022":{"name":"Greater Quintessence of Sugar Rush","description":"+1.5% movement speed","image":{"full":"8022.png","sprite":"rune0.png","group":"rune","x":384,"y":288,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentMovementSpeedMod":0.015},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null},"8035":{"name":"Greater Quintessence of Studio Rumble","description":"+1.5% movement speed","image":{"full":"8035.png","sprite":"rune0.png","group":"rune","x":48,"y":384,"w":48,"h":48},"rune":{"isrune":true,"tier":"3","type":"black"},"stats":{"PercentMovementSpeedMod":0.015},"tags":["utility","percent","quintessence"],"colloq":null,"plaintext":null}}};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objects = require('./objects');

/**
 * Execute an AJAX request.
 *
 * @param {string} method The HTTP method to use.
 * @param {string} url The URL to send teh request to.
 * @param {object=} params Key-value paris of query string parameters.
 * @param {*=} data The request body.
 * @param {headers=} headers Any headers to set.
 * @returns {Promise}
 */
function http(_ref) {
    var method = _ref.method;
    var url = _ref.url;
    var params = _ref.params;
    var data = _ref.data;
    var headers = _ref.headers;

    return new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = url;

        if (params) {
            var queryString = '';
            for (var key in params) {
                if (!params.hasOwnProperty(key)) continue;
                var symbol = queryString ? '&' : '?';
                var s = '' + symbol + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                queryString += s;
            }
            uri += queryString;
        }

        client.open(method, uri);

        if (headers) {
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    var value = headers[key];
                    client.setRequestHeader(key, value);
                }
            }
        }

        if (data && (method == 'POST' || method == 'PUT')) {
            client.send(data);
        } else {
            client.send();
        }

        client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve({
                    status: this.status,
                    body: this.response
                });
            } else {
                reject({
                    status: this.status,
                    body: this.response
                });
            }
        };

        client.onerror = function () {
            reject({
                status: this.status,
                body: this.response
            });
        };
    });
}

/**
 * Executes a GET request to the specified location.
 *
 * @param {string} url The URL to send the request to.
 * @param {object=} config The full configuration options.
 * @returns {Promise}
 */
http['get'] = function (url) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return http((0, _objects.mix)({
        url: url,
        method: 'GET'
    }, config));
};

/**
 * Executes a POST request to the specified location.
 *
 * @param {string} url The URL to send the request to.
 * @param {*=} data The request body.
 * @param {object=} config The full configuration options.
 * @returns {Promise}
 */
http['post'] = function (url, data) {
    var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    return http((0, _objects.mix)({
        url: url,
        data: data,
        method: 'POST'
    }, config));
};

exports.default = http;

},{"./objects":4}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assignKeys = exports.assignIDs = exports.mix = exports.extend = undefined;

var _fnjs = require('fnjs');

var _fnjs2 = _interopRequireDefault(_fnjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(src) {
    for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        objects[_key - 1] = arguments[_key];
    }

    for (var i in objects) {
        if (!objects.hasOwnProperty(i)) continue;
        var obj = objects[i];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            if (obj[key] && _typeof(obj[key]) == 'object' && obj[key].constructor == Object) {
                src[key] = mix({}, obj[key]);
            } else {
                src[key] = obj[key];
            }
        }
    }
    return src;
}

function mix(src) {
    var copy = extend({}, src);

    for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
    }

    return extend.apply(undefined, [copy].concat(objects));
}

function assignIDs(object) {
    var id = 0;

    _fnjs2.default.forEach(object, function (entry) {
        entry.id = id++;
    });

    return object;
}

function assignKeys(object) {
    _fnjs2.default.forEach(object, function (entry, key) {
        entry.id = key;
    });

    return object;
}

exports.extend = extend;
exports.mix = mix;
exports.assignIDs = assignIDs;
exports.assignKeys = assignKeys;

},{"fnjs":1}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.format = format;
/**
 * Formats a string by replacing {#} with it's numerically corresponding argument.
 * eg: <i>formatString("Hello {0}! Good to see {1}", 'World', 'you!')</i> returns <i>"Hello World! Good to see you!"</i>
 * @param {string} subject The source string to perform the format on
 * @returns {string} the formatted string
 */
function format(subject) {
    var args = Array.prototype.slice.call(arguments, 1);

    // If first and only arg is an object, assume this object is to be used to format the string, using a key-value relationship
    if (_typeof(args[0]) === 'object') {
        var map = args[0];
        return subject.replace(/\${(.+?)}/g, function (match, key) {
            if (typeof map[key] == 'undefined') return '';
            return map[key];
        });
    }

    return subject.replace(/\${(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = /*@ngInject*/function ($scope) {};

;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'runes/components/app/template.html',
        controller: _controller2.default
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components.app', []).directive('suRunesApp', _directive2.default);

},{"./directive":7,"angular":"angular"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components', [require('./tooltip').default.name, require('./list-rune').default.name, require('./list').default.name, require('./page').default.name, require('./app').default.name]);

},{"./app":8,"./list":15,"./list-rune":12,"./page":18,"./tooltip":21,"angular":"angular"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope) {
    _lodash2.default.extend(this, {
        select: function select($event, rune) {
            $rootScope.$broadcast('rune.clicked', rune, $event.metaKey || $event.ctrlKey);
            _analytics2.default.trackEvent({
                category: _analytics.EventCategories.RUNE,
                action: _analytics.EventActions.CLICK,
                label: _analytics.EventLabels.ADDED,
                value: rune.id
            });
        },
        showTooltip: function showTooltip($event) {
            var bounds = $event.delegateTarget.getBoundingClientRect();
            $scope.$broadcast('tooltip.show', bounds);
        },
        hideTooltip: function hideTooltip() {
            $scope.$broadcast('tooltip.hide');
        }
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _analytics = require('services/analytics');

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"lodash":"lodash","services/analytics":26}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            rune: '='
        },
        templateUrl: 'runes/components/list-rune/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components.list-rune', []).directive('suRunesListRune', _directive2.default);

},{"./directive":11,"angular":"angular"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($scope) {
    var _this = this;

    _lodash2.default.extend(this, {
        groups: [{
            name: 'Marks',
            expanded: false
        }, {
            name: 'Seals',
            expanded: false
        }, {
            name: 'Glyphs',
            expanded: false
        }, {
            name: 'Quintessences',
            expanded: false
        }],

        runes: {
            'Marks': tier3.filter(function (rune) {
                return rune.type == _runes.Types.MARK;
            }),
            'Seals': tier3.filter(function (rune) {
                return rune.type == _runes.Types.SEAL;
            }),
            'Glyphs': tier3.filter(function (rune) {
                return rune.type == _runes.Types.GLYPH;
            }),
            'Quintessences': tier3.filter(function (rune) {
                return rune.type == _runes.Types.QUINT;
            })
        },

        toggle: function toggle($event, group) {
            group.expanded = !group.expanded;
        }
    });

    $scope.$on('rune.refunded', function ($event, refundedRune, count) {
        var runes = _this.runes[refundedRune.type + 's'];
        var rune = runes.find(function (r) {
            return r.id == refundedRune.id;
        });
        rune.quantity += count;
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _runes = require('services/runes');

var _runes2 = _interopRequireDefault(_runes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tier3 = _runes2.default.data.filter(function (rune) {
    return rune.tier == 3;
}).map(function (rune) {
    return _lodash2.default.extend(rune, {
        quantity: rune.type == _runes.Types.QUINT ? 3 : 9,
        cost: 420
    });
});

;

},{"lodash":"lodash","services/runes":30}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'runes/components/list/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components.list', []).directive('suRunesList', _directive2.default);

},{"./directive":14,"angular":"angular"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope) {
    var _runes,
        _this = this;

    _.extend(this, {
        runes: (_runes = {}, _defineProperty(_runes, _runes3.Types.MARK, []), _defineProperty(_runes, _runes3.Types.SEAL, []), _defineProperty(_runes, _runes3.Types.GLYPH, []), _defineProperty(_runes, _runes3.Types.QUINT, []), _runes),

        refund: function refund($event, rune, index) {
            var runes = this.runes[rune.type];
            var count = 1;

            runes[index] = null;

            if ($event.metaKey || $event.ctrlKey) {
                for (var i = 0; i < runes.length; i++) {
                    var r = runes[i];
                    if (!r) continue;
                    if (r.id == rune.id) {
                        count++;
                        runes[i] = null;
                    }
                }
            }

            _analytics2.default.trackEvent({
                category: _analytics.EventCategories.RUNE,
                action: _analytics.EventActions.CLICK,
                label: _analytics.EventLabels.REMOVED,
                value: rune.id
            });

            $rootScope.$broadcast('rune.refunded', rune, count);
            $rootScope.$broadcast('runes.updated', flatten(this.runes));
        },
        reset: function reset() {
            var _runes2;

            var runes = flatten(this.runes).reduce(function (runes, rune) {
                if (runes[rune.id]) {
                    runes[rune.id].count++;
                } else {
                    runes[rune.id] = {
                        rune: rune,
                        count: 1
                    };
                }
                return runes;
            }, {});

            _fnjs2.default.forEach(runes, function (runemeta) {
                $rootScope.$broadcast('rune.refunded', runemeta.rune, runemeta.count);
            });

            this.runes = (_runes2 = {}, _defineProperty(_runes2, _runes3.Types.MARK, []), _defineProperty(_runes2, _runes3.Types.SEAL, []), _defineProperty(_runes2, _runes3.Types.GLYPH, []), _defineProperty(_runes2, _runes3.Types.QUINT, []), _runes2);

            $rootScope.$broadcast('runes.updated', flatten(this.runes));
        }
    });

    $scope.$on('rune.clicked', function ($event, rune, max) {
        while (rune.quantity > 0 && slotOpen(_this.runes, rune)) {
            var index = _this.runes[rune.type].findIndex(function (r) {
                return !r;
            });
            if (index > -1) {
                _this.runes[rune.type][index] = rune;
            } else {
                _this.runes[rune.type].push(rune);
            }

            rune.quantity--;

            if (!max) break;
        }

        $rootScope.$broadcast('runes.updated', flatten(_this.runes));
    });
};

var _fnjs = require('fnjs');

var _fnjs2 = _interopRequireDefault(_fnjs);

var _runes3 = require('services/runes');

var _analytics = require('services/analytics');

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function slotOpen(runes, rune) {
    var max = rune.type == _runes3.Types.QUINT ? 3 : 9;
    return runes[rune.type].filter(function (r) {
        return !!r;
    }).length < max;
}

function flatten(runes) {
    return Object.keys(runes).reduce(function (r, key) {
        return r.concat(runes[key]);
    }, []).filter(function (r) {
        return !!r;
    });
}

;

},{"fnjs":1,"services/analytics":26,"services/runes":30}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'runes/components/page/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components.page', []).directive('suRunesPage', _directive2.default);

},{"./directive":17,"angular":"angular"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($scope) {
    $scope.style = {};

    $scope.$on('tooltip.show', function ($event, bounds) {
        $scope.active = true;
        $scope.style = {
            top: bounds.top - 5 - window.scrollY + 'px',
            left: bounds.right + 5 - window.scrollY + 'px'
        };
    });

    $scope.$on('tooltip.hide', function () {
        $scope.active = false;
    });
};

;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            rune: '='
        },
        templateUrl: 'runes/components/tooltip/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":19}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.components.tooltip', []).directive('suRunesTooltip', _directive2.default);

},{"./directive":20,"angular":"angular"}],22:[function(require,module,exports){
'use strict';

var _StatsBrief;

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /* @ngInject */function (decimalFilter) {
    return function (rune) {
        var mods = rune.mods.filter(function (mod) {
            return !!mod;
        });
        if (mods.length < 1) return rune.name;

        var isHybridPen = mods[0] && mods[1] && mods[0].stat.id == _modifiers.Stats.ARMOR_PEN.id && mods[1].stat.id == _modifiers.Stats.MAGIC_PEN.id;

        if (isHybridPen) {
            return '+' + mods[0].value + ' / ' + mods[1].value + ' hybrid pen';
        }

        return mods.map(function (mod) {
            if (!mod.stat) {
                console.error('nostat', rune);
            }
            var percent = mod.percent || mod.stat.percent;
            var amount = (mod.scaling ? mod.value * 18 : mod.value) * (percent ? 100 : 1);
            if ([_modifiers.Stats.HEALTH_REGEN.id, _modifiers.Stats.MANA_REGEN.id, _modifiers.Stats.ENERGY_REGEN.id].indexOf(mod.stat.id) > -1) {
                amount *= 5;
            }
            var operator = amount < 0 || mod.stat.id == _modifiers.Stats.TIME_DEAD.id || mod.stat.id == _modifiers.Stats.CDR.id ? '-' : '+';
            var pct = percent ? '%' : '';
            var stat = StatsBrief[mod.stat.id].toLowerCase();
            var at18 = mod.scaling ? '@18' : '';
            return ['' + operator + decimalFilter(amount, 2) + pct, stat, at18].join(' ');
        }).join('& ');
    };
};

var _modifiers = require('services/modifiers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var StatsBrief = (_StatsBrief = {}, _defineProperty(_StatsBrief, _modifiers.Stats.HEALTH_POOL.id, 'Health'), _defineProperty(_StatsBrief, _modifiers.Stats.MANA_POOL.id, 'Mana'), _defineProperty(_StatsBrief, _modifiers.Stats.HEALTH_REGEN.id, 'Health / 5 sec'), _defineProperty(_StatsBrief, _modifiers.Stats.MANA_REGEN.id, 'Mana / 5 sec'), _defineProperty(_StatsBrief, _modifiers.Stats.ENERGY_POOL.id, 'Energy'), _defineProperty(_StatsBrief, _modifiers.Stats.ENERGY_REGEN.id, 'Energy / 5 sec'), _defineProperty(_StatsBrief, _modifiers.Stats.ARMOR.id, 'Armor'), _defineProperty(_StatsBrief, _modifiers.Stats.MAGIC_RESIST.id, 'Magic Resist'), _defineProperty(_StatsBrief, _modifiers.Stats.ARMOR_PEN.id, 'Armor Pen'), _defineProperty(_StatsBrief, _modifiers.Stats.MAGIC_PEN.id, 'Magic Pen'), _defineProperty(_StatsBrief, _modifiers.Stats.CDR.id, 'Cooldowns'), _defineProperty(_StatsBrief, _modifiers.Stats.MAGIC_DAMAGE.id, 'Ability Power'), _defineProperty(_StatsBrief, _modifiers.Stats.ATTACK_SPEED.id, 'Attack Speed'), _defineProperty(_StatsBrief, _modifiers.Stats.ATTACK_DAMAGE.id, 'Attack Damage'), _defineProperty(_StatsBrief, _modifiers.Stats.CRIT_CHANCE.id, 'Crit Chance'), _defineProperty(_StatsBrief, _modifiers.Stats.CRIT_DAMAGE.id, 'Crit Damage'), _defineProperty(_StatsBrief, _modifiers.Stats.MOVE_SPEED.id, 'Move Speed'), _defineProperty(_StatsBrief, _modifiers.Stats.LIFE_STEAL.id, 'Lifesteal'), _defineProperty(_StatsBrief, _modifiers.Stats.SPELL_VAMP.id, 'Spellvamp'), _defineProperty(_StatsBrief, _modifiers.Stats.TIME_DEAD.id, 'Time Dead'), _defineProperty(_StatsBrief, _modifiers.Stats.GP10.id, 'Gold / 10 sec'), _defineProperty(_StatsBrief, _modifiers.Stats.PCT_XP.id, 'XP Gained'), _StatsBrief);

;

},{"services/modifiers":29}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes.filters', []).filter('brief', require('./brief').default).filter('runestyle', require('./runestyle').default);

},{"./brief":22,"./runestyle":24,"angular":"angular"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /* @ngInject */function () {
    return function (rune, index) {
        var coords = _runes.Coords[rune.type][index];
        return {
            left: coords[0] + 'px',
            top: coords[1] + 'px'
        };
    };
};

var _runes = require('services/runes');

;

},{"services/runes":30}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularRaven = require('angular-raven');

var _angularRaven2 = _interopRequireDefault(_angularRaven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('runes', ['ngRaven', 'runes.templates', 'common', require('./filters').default.name, require('./components').default.name]);

},{"./components":9,"./filters":23,"angular":"angular","angular-raven":"angular-raven"}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Pages = {
  INDEX: '/',
  CHAMPIONS: '/champions',
  RUNES: '/runes',
  MASTERIES: '/masteries'
};

var EventCategories = {
  CHAMPION: 'champion',
  RUNE: 'rune',
  MASTERY: 'mastery'
};
var EventActions = {
  CLICK: 'click',
  SELECTED: 'selected'

};
var EventLabels = {
  ADDED: 'added',
  REMOVED: 'removed'
};

exports.Pages = Pages;
exports.EventCategories = EventCategories;
exports.EventActions = EventActions;
exports.EventLabels = EventLabels;
exports.default = {

  /**
   * Tracks a page view.
   *
   * @param {string} path - The path of the current URL. Prefixed with '/'
   */

  trackPageView: function trackPageView(path) {
    ga('send', {
      hitType: 'pageview',
      page: path
    });
  },

  /**
   * Tracks an event or interaction on the page.
   *
   * @param {string} category - The type of thing interacted with. (eg. Video)
   * @param {string} action - The type of interaction. (eg. play)
   * @param {string} label - Typically a subcategory.
   * @param {number} value - A useful and unique identification of the thing interacted with.
   */
  trackEvent: function trackEvent(_ref) {
    var category = _ref.category;
    var action = _ref.action;
    var label = _ref.label;
    var value = _ref.value;

    ga('send', Object.assign({
      hitType: 'event'
    }, {
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    }));
  }
};

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataTargets = undefined;

var _http = require('lib/http');

var _http2 = _interopRequireDefault(_http);

var _strings = require('lib/strings');

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EndPoints = {
    BASE: 'http://ddragon.leagueoflegends.com/cdn/${version}',
    DATA: '/data/${locale}/${target}',
    IMAGE: '/img/${path}'
};

var DataTargets = {
    MASTERIES: 'mastery.json',
    RUNES: 'rune.json',
    CHAMPIONS: 'champion.json'
};

var DEFAULT_LOCALE = 'en_US';
var DEFAULT_VERSION = _globals2.default.version;

function fetchData(version, target, locale) {
    return _http2.default.get((0, _strings.format)(EndPoints.BASE + EndPoints.DATA, {
        version: version || DEFAULT_VERSION,
        locale: locale || DEFAULT_LOCALE,
        target: target
    })).then(function (res) {
        return JSON.parse(res.body);
    });
}

function fetchImage(version, path, locale) {
    return _http2.default.get(imageURL(version, path, locale)).then(function (res) {
        return JSON.parse(res.body);
    });
}

function imageURL(version, path, locale) {
    return (0, _strings.format)(EndPoints.BASE + EndPoints.IMAGE, {
        version: version || DEFAULT_VERSION,
        locale: locale || DEFAULT_LOCALE,
        path: path
    });
}

exports.DataTargets = DataTargets;
exports.default = { fetchData: fetchData, fetchImage: fetchImage, imageURL: imageURL };

},{"lib/http":3,"lib/strings":5,"services/globals":28}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    version: '7.6.1'
};

exports.default = config;

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resources = exports.Stats = exports.Mods = undefined;

var _objects = require('lib/objects');

var Resources = {
    MANA: 'Mana',
    ENERGY: 'Energy',
    BLOODWELL: 'BloodWell',
    RAGE: 'Rage'
};

var Stats = (0, _objects.assignKeys)({
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

var Mods = (0, _objects.assignKeys)({
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

exports.Mods = Mods;
exports.Stats = Stats;
exports.Resources = Resources;

},{"lib/objects":4}],30:[function(require,module,exports){
'use strict';

var _Coords;

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Coords = exports.Types = undefined;

var _runes = require('data/7.6.1/runes');

var _runes2 = _interopRequireDefault(_runes);

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

var _ddragon = require('services/ddragon');

var _ddragon2 = _interopRequireDefault(_ddragon);

var _runes3 = require('transformers/runes');

var _runes4 = _interopRequireDefault(_runes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Types = {
    MARK: "Mark",
    SEAL: "Seal",
    GLYPH: "Glyph",
    QUINT: "Quintessence"
};

var Coords = (_Coords = {}, _defineProperty(_Coords, Types.MARK, [[24, 370], [86, 370], [158, 371], [8, 312], [70, 311], [125, 323], [29, 254], [76, 222], [113, 264]]), _defineProperty(_Coords, Types.SEAL, [[39, 186], [66, 138], [107, 179], [119, 112], [154, 70], [204, 43], [265, 24], [343, 5], [371, 55]]), _defineProperty(_Coords, Types.GLYPH, [[401, 4], [463, 8], [550, 6], [431, 53], [507, 40], [599, 40], [482, 87], [555, 79], [576, 133]]), _defineProperty(_Coords, Types.QUINT, [[26, 35], [182, 224], [413, 159]]), _Coords);

exports.Types = Types;
exports.Coords = Coords;
exports.default = {
    data: (0, _runes4.default)(_runes2.default),

    loadLiveData: function loadLiveData() {
        var _this = this;

        return _ddragon2.default.fetchData(_globals2.default.version, _ddragon.DataTargets.RUNES).then(function (rawdata) {
            return (0, _runes4.default)(rawdata);
        }).then(function (data) {
            return _this.data = data;
        });
    }
};

},{"data/7.6.1/runes":2,"services/ddragon":27,"services/globals":28,"transformers/runes":31}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objects = require('lib/objects');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _modifiers = require('services/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Types = {
    MARK: "Mark",
    SEAL: "Seal",
    GLYPH: "Glyph",
    QUINT: "Quintessence"
};

var ColorTypes = {
    "red": Types.MARK,
    "yellow": Types.SEAL,
    "blue": Types.GLYPH,
    "black": Types.QUINT
};

var RuneMods = {
    "FlatHPPoolMod": _modifiers.Mods.FLAT_HP_POOL,
    "rFlatHPModPerLevel": _modifiers.Mods.SCALING_HP_POOL,
    "FlatMPPoolMod": _modifiers.Mods.FLAT_MP_POOL,
    "rFlatMPModPerLevel": _modifiers.Mods.SCALING_MP_POOL,
    "PercentHPPoolMod": _modifiers.Mods.FLAT_HP_POOL_PCT,
    "FlatHPRegenMod": _modifiers.Mods.FLAT_HP_REGEN,
    "rFlatHPRegenModPerLevel": _modifiers.Mods.SCALING_HP_REGEN,
    "FlatMPRegenMod": _modifiers.Mods.FLAT_MP_REGEN,
    "rFlatMPRegenModPerLevel": _modifiers.Mods.SCALING_MP_REGEN,
    "FlatArmorMod": _modifiers.Mods.FLAT_ARMOR,
    "rFlatArmorModPerLevel": _modifiers.Mods.SCALING_ARMOR,
    "rFlatArmorPenetrationMod": _modifiers.Mods.FLAT_ARMOR_PEN,
    "FlatPhysicalDamageMod": _modifiers.Mods.FLAT_ATTACK_DAMAGE,
    "rFlatPhysicalDamageModPerLevel": _modifiers.Mods.SCALING_ATTACK_DAMAGE,
    "FlatMagicDamageMod": _modifiers.Mods.FLAT_MAGIC_DAMAGE,
    "rFlatMagicDamageModPerLevel": _modifiers.Mods.SCALING_MAGIC_DAMAGE,
    "PercentMovementSpeedMod": _modifiers.Mods.FLAT_MOVE_SPEED_PCT,
    "PercentAttackSpeedMod": _modifiers.Mods.FLAT_ATTACK_SPEED_PCT,
    "FlatCritChanceMod": _modifiers.Mods.FLAT_CRIT_CHANCE,
    "FlatCritDamageMod": _modifiers.Mods.FLAT_CRIT_DAMAGE,
    "FlatSpellBlockMod": _modifiers.Mods.FLAT_MR,
    "rFlatSpellBlockModPerLevel": _modifiers.Mods.SCALING_MR,
    "PercentEXPBonus": _modifiers.Mods.FLAT_PCT_XP,
    "rPercentCooldownMod": _modifiers.Mods.FLAT_CDR,
    "rPercentCooldownModPerLevel": _modifiers.Mods.SCALING_CDR,
    "rPercentTimeDeadMod": _modifiers.Mods.FLAT_TIME_DEAD,
    "rFlatGoldPer10Mod": _modifiers.Mods.FLAT_GP10,
    "rFlatMagicPenetrationMod": _modifiers.Mods.FLAT_MAGIC_PEN,
    "FlatEnergyRegenMod": _modifiers.Mods.FLAT_ENERGY_REGEN,
    "rFlatEnergyRegenModPerLevel": _modifiers.Mods.SCALING_ENERGY_REGEN,
    "FlatEnergyPoolMod": _modifiers.Mods.FLAT_ENERGY_POOL,
    "rFlatEnergyModPerLevel": _modifiers.Mods.SCALING_ENERGY_POOL,
    "PercentLifeStealMod": _modifiers.Mods.FLAT_LIFE_STEAL,
    "PercentSpellVampMod": _modifiers.Mods.FLAT_SPELL_VAMP
};

function transform(rawRunes) {
    var runes = _lodash2.default.values(_lodash2.default.mapValues(rawRunes.data, function (rune, id) {
        return {
            id: id,
            name: rune.name,
            description: rune.description,
            tier: rune.rune.tier,
            type: ColorTypes[rune.rune.type],
            mods: Object.keys(rune.stats).map(function (key) {
                return (0, _objects.mix)(RuneMods[key], {
                    value: Math.abs(rune.stats[key])
                });
            })
        };
    }));

    return runes;
}

exports.default = transform;

},{"lib/objects":4,"lodash":"lodash","services/modifiers":29}]},{},[25])

//# sourceMappingURL=runes.js.map
