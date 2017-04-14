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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Config = {
  LOAD_LIVE_DATA: false
};

exports.default = Config;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = { "type": "mastery", "version": "7.6.1", "tree": { "Ferocity": [[{ "masteryId": "6111", "prereq": "0" }, { "masteryId": "6114", "prereq": "0" }], [{ "masteryId": "6121", "prereq": "0" }, { "masteryId": "6122", "prereq": "0" }, { "masteryId": "6123", "prereq": "0" }], [{ "masteryId": "6131", "prereq": "0" }, { "masteryId": "6134", "prereq": "0" }], [{ "masteryId": "6141", "prereq": "0" }, { "masteryId": "6142", "prereq": "0" }, { "masteryId": "6143", "prereq": "0" }], [{ "masteryId": "6151", "prereq": "0" }, { "masteryId": "6154", "prereq": "0" }], [{ "masteryId": "6161", "prereq": "0" }, { "masteryId": "6162", "prereq": "0" }, { "masteryId": "6164", "prereq": "0" }]], "Cunning": [[{ "masteryId": "6311", "prereq": "0" }, { "masteryId": "6312", "prereq": "0" }], [{ "masteryId": "6321", "prereq": "0" }, { "masteryId": "6322", "prereq": "0" }, { "masteryId": "6323", "prereq": "0" }], [{ "masteryId": "6331", "prereq": "0" }, { "masteryId": "6332", "prereq": "0" }], [{ "masteryId": "6341", "prereq": "0" }, { "masteryId": "6342", "prereq": "0" }, { "masteryId": "6343", "prereq": "0" }], [{ "masteryId": "6351", "prereq": "0" }, { "masteryId": "6352", "prereq": "0" }], [{ "masteryId": "6361", "prereq": "0" }, { "masteryId": "6362", "prereq": "0" }, { "masteryId": "6363", "prereq": "0" }]], "Resolve": [[{ "masteryId": "6211", "prereq": "0" }, { "masteryId": "6212", "prereq": "0" }], [{ "masteryId": "6221", "prereq": "0" }, { "masteryId": "6223", "prereq": "0" }, { "masteryId": "6222", "prereq": "0" }], [{ "masteryId": "6231", "prereq": "0" }, { "masteryId": "6232", "prereq": "0" }], [{ "masteryId": "6241", "prereq": "0" }, { "masteryId": "6242", "prereq": "0" }, { "masteryId": "6243", "prereq": "0" }], [{ "masteryId": "6251", "prereq": "0" }, { "masteryId": "6252", "prereq": "0" }], [{ "masteryId": "6261", "prereq": "0" }, { "masteryId": "6262", "prereq": "0" }, { "masteryId": "6263", "prereq": "0" }]] }, "data": { "6111": { "id": 6111, "name": "Fury", "description": ["+0.8% Attack Speed", "+1.6% Attack Speed", "+2.4% Attack Speed", "+3.2% Attack Speed", "+4% Attack Speed"], "image": { "full": "6111.png", "sprite": "mastery0.png", "group": "mastery", "x": 0, "y": 0, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6114": { "id": 6114, "name": "Sorcery", "description": ["+0.4% increased Ability damage", "+0.8% increased Ability damage", "+1.2% increased Ability damage", "+1.6% increased Ability damage", "+2.0% increased Ability damage"], "image": { "full": "6114.png", "sprite": "mastery0.png", "group": "mastery", "x": 48, "y": 0, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6121": { "id": 6121, "name": "Fresh Blood", "description": ["Your first basic attack against a champion deals an additional 10 +1 per level damage (6 second cooldown)"], "image": { "full": "6121.png", "sprite": "mastery0.png", "group": "mastery", "x": 96, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6122": { "id": 6122, "name": "Feast", "description": ["Killing a unit restores 20 Health (30 second cooldown)"], "image": { "full": "6122.png", "sprite": "mastery0.png", "group": "mastery", "x": 144, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6123": { "id": 6123, "name": "Expose Weakness", "description": ["Damaging enemy champions causes them to take 3% more damage from your allies"], "image": { "full": "6123.png", "sprite": "mastery0.png", "group": "mastery", "x": 192, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6131": { "id": 6131, "name": "Vampirism", "description": ["+0.4% Lifesteal and Spell Vamp", "+0.8% Lifesteal and Spell Vamp", "+1.2% Lifesteal and Spell Vamp", "+1.6% Lifesteal and Spell Vamp", "+2.0% Lifesteal and Spell Vamp"], "image": { "full": "6131.png", "sprite": "mastery0.png", "group": "mastery", "x": 240, "y": 0, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6134": { "id": 6134, "name": "Natural Talent", "description": ["Gain 0.4 + 0.09 per level Attack Damage, and 0.6 + 0.13 per level Ability Power (+2 Attack Damage and 3 Ability Power at level 18)", "Gain 0.8 + 0.18 per level Attack Damage, and 1.2 + 0.27 per level Ability Power (+4 Attack Damage and 6 Ability Power at level 18)", "Gain 1.2 + 0.27 per level Attack Damage, and 1.8 + 0.4 per level Ability Power (+6 Attack Damage and 9 Ability Power at level 18)", "Gain 1.6 + 0.36 per level Attack Damage, and 2.4 + 0.53 per level Ability Power (+8 Attack Damage and 12 Ability Power at level 18)", "Gain 2 + 0.44 per level Attack Damage, and 3 + 0.67 per level Ability Power (+10 Attack Damage and 15 Ability Power at level 18)"], "image": { "full": "6134.png", "sprite": "mastery0.png", "group": "mastery", "x": 288, "y": 0, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6141": { "id": 6141, "name": "Bounty Hunter", "description": ["Deal 1% increased damage for each unique enemy champion you have killed"], "image": { "full": "6141.png", "sprite": "mastery0.png", "group": "mastery", "x": 336, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6142": { "id": 6142, "name": "Double Edged Sword", "description": ["Deal 3% additional damage, take 1.5% additional damage."], "image": { "full": "6142.png", "sprite": "mastery0.png", "group": "mastery", "x": 384, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6143": { "id": 6143, "name": "Battle Trance", "description": ["Gain up to 3% increased damage over 3 seconds when in combat with enemy Champions"], "image": { "full": "6143.png", "sprite": "mastery0.png", "group": "mastery", "x": 432, "y": 0, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6151": { "id": 6151, "name": "Battering Blows", "description": ["+1.4% Armor Penetration", "+2.8% Armor Penetration", "+4.2% Armor Penetration", "+5.6% Armor Penetration", "+7% Armor Penetration"], "image": { "full": "6151.png", "sprite": "mastery0.png", "group": "mastery", "x": 0, "y": 48, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6154": { "id": 6154, "name": "Piercing Thoughts", "description": ["+1.4% Magic Penetration", "+2.8% Magic Penetration", "+4.2% Magic Penetration", "+5.6% Magic Penetration", "+7% Magic Penetration"], "image": { "full": "6154.png", "sprite": "mastery0.png", "group": "mastery", "x": 48, "y": 48, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6161": { "id": 6161, "name": "Warlord's Bloodlust", "description": ["Moving or attacking will charge an Energized attack. Energized attacks heal for 5-40% of your total Attack Damage (amplified by Critical Strikes) and grant 30% Movement Speed for 0.75 seconds."], "image": { "full": "6161.png", "sprite": "mastery0.png", "group": "mastery", "x": 96, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6162": { "id": 6162, "name": "Fervor of Battle", "description": ["Hitting champions with basic attacks generates a Fervor stack (2 for melee attacks). Stacks of Fervor last 8 seconds (max 8 stacks)and increase your AD by 1-8 for each stack."], "image": { "full": "6162.png", "sprite": "mastery0.png", "group": "mastery", "x": 144, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6164": { "id": 6164, "name": "Deathfire Touch", "description": ["Your damaging abilities cause enemy champions to take magic damage over 4 seconds.<br><br>Damage: 8 + 45% Bonus Attack Damage and 25% Ability Power<br><br>Deathfire Touch's duration is reduced for:<br>     - Area of Effect: 2 second duration. <br>     - Damage over Time: 1 second duration."], "image": { "full": "6164.png", "sprite": "mastery0.png", "group": "mastery", "x": 192, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6311": { "id": 6311, "name": "Wanderer", "description": ["+0.6% Movement Speed out of combat", "+1.2% Movement Speed out of combat", "+1.8% Movement Speed out of combat", "+2.4% Movement Speed out of combat", "+3% Movement Speed out of combat"], "image": { "full": "6311.png", "sprite": "mastery0.png", "group": "mastery", "x": 240, "y": 48, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6312": { "id": 6312, "name": "Savagery", "description": ["Single target attacks and spells deal 1 bonus damage to minions and monsters", "Single target attacks and spells deal 2 bonus damage to minions and monsters", "Single target attacks and spells deal 3 bonus damage to minions and monsters", "Single target attacks and spells deal 4 bonus damage to minions and monsters", "Single target attacks and spells deal 5 bonus damage to minions and monsters"], "image": { "full": "6312.png", "sprite": "mastery0.png", "group": "mastery", "x": 288, "y": 48, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6321": { "id": 6321, "name": "Runic Affinity", "description": ["Buffs from neutral monsters last 15% longer"], "image": { "full": "6321.png", "sprite": "mastery0.png", "group": "mastery", "x": 336, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6322": { "id": 6322, "name": "Secret Stash", "description": ["Your Potions and Elixirs last 10% longer.<br><br>Your Health Potions are replaced with Biscuits that restore 15 Health and Mana instantly on use"], "image": { "full": "6322.png", "sprite": "mastery0.png", "group": "mastery", "x": 384, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6323": { "id": 6323, "name": "Assassin", "description": ["Deal 2% increased damage to champions when no allied champions are nearby"], "image": { "full": "6323.png", "sprite": "mastery0.png", "group": "mastery", "x": 432, "y": 48, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6331": { "id": 6331, "name": "Merciless", "description": ["Deal 0.6% increased damage to champions below 40% Health", "Deal 1.2% increased damage to champions below 40% Health", "Deal 1.8% increased damage to champions below 40% Health", "Deal 2.4% increased damage to champions below 40% Health", "Deal 3% increased damage to champions below 40% Health"], "image": { "full": "6331.png", "sprite": "mastery0.png", "group": "mastery", "x": 0, "y": 96, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6332": { "id": 6332, "name": "Meditation", "description": ["Regenerate 0.25% of your missing Mana every 5 seconds", "Regenerate 0.5% of your missing Mana every 5 seconds", "Regenerate 0.75% of your missing Mana every 5 seconds", "Regenerate 1.0% of your missing Mana every 5 seconds", "Regenerate 1.25% of your missing Mana every 5 seconds"], "image": { "full": "6332.png", "sprite": "mastery0.png", "group": "mastery", "x": 48, "y": 96, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6341": { "id": 6341, "name": "Greenfather's Gift", "description": ["Stepping into brush causes your next damaging attack or ability to deal 3% of your target's current health as bonus magic damage (9s Cooldown)"], "image": { "full": "6341.png", "sprite": "mastery0.png", "group": "mastery", "x": 96, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6342": { "id": 6342, "name": "Bandit", "description": ["Gain 1 gold for each nearby minion killed by an ally. <br><br>Gain 3 gold (10 if melee) when hitting an enemy champion with a basic attack (5 second cooldown)"], "image": { "full": "6342.png", "sprite": "mastery0.png", "group": "mastery", "x": 144, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6343": { "id": 6343, "name": "Dangerous Game", "description": ["Champion kills and assists restore 5% of your missing Health and Mana"], "image": { "full": "6343.png", "sprite": "mastery0.png", "group": "mastery", "x": 192, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6351": { "id": 6351, "name": "Precision", "description": ["Gain 1.2 Lethality and 0.3 + 0.05 per level Magic Penetration", "Gain 2.4 Lethality and 0.6 + 0.10 per level Magic Penetration", "Gain 3.6 Lethality and 0.9 + 0.15 per level Magic Penetration", "Gain 4.8 Lethality and 1.2 + 0.20 per level Magic Penetration", "Gain 6 Lethality and 1.5 + 0.25 per level Magic Penetration"], "image": { "full": "6351.png", "sprite": "mastery0.png", "group": "mastery", "x": 240, "y": 96, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6352": { "id": 6352, "name": "Intelligence", "description": ["Your Cooldown Reduction cap is increased to 41% and you gain 1% Cooldown Reduction", "Your Cooldown Reduction cap is increased to 42% and you gain 2% Cooldown Reduction", "Your Cooldown Reduction cap is increased to 43% and you gain 3% Cooldown Reduction", "Your Cooldown Reduction cap is increased to 44% and you gain 4% Cooldown Reduction", "Your Cooldown Reduction cap is increased to 45% and you gain 5% Cooldown Reduction"], "image": { "full": "6352.png", "sprite": "mastery0.png", "group": "mastery", "x": 288, "y": 96, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6361": { "id": 6361, "name": "Stormraider's Surge", "description": ["Dealing 30% of a champion's max Health within 2.5 seconds grants you 40% Movement Speed and 75% Slow Resistance for 3 seconds (10 second cooldown)."], "image": { "full": "6361.png", "sprite": "mastery0.png", "group": "mastery", "x": 336, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6362": { "id": 6362, "name": "Thunderlord's Decree", "description": ["Your 3rd attack or damaging spell against the same enemy champion calls down a lightning strike, dealing magic damage in the area. <br><br>Damage: 10 per level, plus 30% of your Bonus Attack Damage, and 10% of your Ability Power (25-15 second cooldown, based on level)."], "image": { "full": "6362.png", "sprite": "mastery0.png", "group": "mastery", "x": 384, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6363": { "id": 6363, "name": "Windspeaker's Blessing", "description": ["Your heals and shields are 10% stronger. Additionally, your shields and heals on other allies increase their armor by 5-22 (based on level) and their magic resistance by half that amount for 3 seconds."], "image": { "full": "6363.png", "sprite": "mastery0.png", "group": "mastery", "x": 432, "y": 96, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6211": { "id": 6211, "name": "Recovery", "description": ["+0.4 Health per 5 seconds", "+0.8 Health per 5 seconds", "+1.2 Health per 5 seconds", "+1.6 Health per 5 seconds", "+2.0 Health per 5 seconds"], "image": { "full": "6211.png", "sprite": "mastery0.png", "group": "mastery", "x": 0, "y": 144, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6212": { "id": 6212, "name": "Unyielding", "description": ["+1% Bonus Armor and Magic Resist", "+2% Bonus Armor and Magic Resist", "+3% Bonus Armor and Magic Resist", "+4% Bonus Armor and Magic Resist", "+5% Bonus Armor and Magic Resist"], "image": { "full": "6212.png", "sprite": "mastery0.png", "group": "mastery", "x": 48, "y": 144, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6221": { "id": 6221, "name": "Explorer", "description": ["+15 Movement Speed in Brush and River"], "image": { "full": "6221.png", "sprite": "mastery0.png", "group": "mastery", "x": 96, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6223": { "id": 6223, "name": "Tough Skin", "description": ["You take 2 less damage from champion and neutral monster basic attacks"], "image": { "full": "6223.png", "sprite": "mastery0.png", "group": "mastery", "x": 144, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6222": { "id": 6222, "name": "Siegemaster", "description": ["Gain 8 Armor and Magic Resistance when near an allied tower"], "image": { "full": "6222.png", "sprite": "mastery0.png", "group": "mastery", "x": 192, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6231": { "id": 6231, "name": "Runic Armor", "description": ["Shields, healing, regeneration, and lifesteal on you are 1.6% stronger", "Shields, healing, regeneration, and lifesteal on you are 3.2% stronger", "Shields, healing, regeneration, and lifesteal on you are 4.8% stronger", "Shields, healing, regeneration, and lifesteal on you are 6.4% stronger", "Shields, healing, regeneration, and lifesteal on you are 8% stronger"], "image": { "full": "6231.png", "sprite": "mastery0.png", "group": "mastery", "x": 240, "y": 144, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6232": { "id": 6232, "name": "Veteran's Scars", "description": ["+10 Health", "+20 Health", "+30 Health", "+40 Health", "+50 Health"], "image": { "full": "6232.png", "sprite": "mastery0.png", "group": "mastery", "x": 288, "y": 144, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6241": { "id": 6241, "name": "Insight", "description": ["Reduces the cooldown of Summoner Spells by 15%"], "image": { "full": "6241.png", "sprite": "mastery0.png", "group": "mastery", "x": 336, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6242": { "id": 6242, "name": "Perseverance", "description": ["+50% Base Health Regen, increased to +200% when below 25% Health"], "image": { "full": "6242.png", "sprite": "mastery0.png", "group": "mastery", "x": 384, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6243": { "id": 6243, "name": "Fearless", "description": ["Gain 10% +1.5 per level bonus Armor and Magic Resist when damaged by an enemy champion for 2 seconds (9s Cooldown)"], "image": { "full": "6243.png", "sprite": "mastery0.png", "group": "mastery", "x": 432, "y": 144, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6251": { "id": 6251, "name": "Swiftness", "description": ["+3% Tenacity and Slow Resist", "+6% Tenacity and Slow Resist", "+9% Tenacity and Slow Resist", "+12% Tenacity and Slow Resist", "+15% Tenacity and Slow Resist"], "image": { "full": "6251.png", "sprite": "mastery0.png", "group": "mastery", "x": 0, "y": 192, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6252": { "id": 6252, "name": "Legendary Guardian", "description": ["+0.6 Armor and Magic Resist for each nearby enemy champion", "+1.2 Armor and Magic Resist for each nearby enemy champion", "+1.8 Armor and Magic Resist for each nearby enemy champion", "+2.4 Armor and Magic Resist for each nearby enemy champion", "+3 Armor and Magic Resist for each nearby enemy champion"], "image": { "full": "6252.png", "sprite": "mastery0.png", "group": "mastery", "x": 48, "y": 192, "w": 48, "h": 48 }, "ranks": 5, "prereq": "0" }, "6261": { "id": 6261, "name": "Grasp of the Undying", "description": ["Every 4 seconds in combat, your next attack against an enemy champion deals damage equal to 3% of your max Health and heals you for 1.5% of your max Health (halved for ranged champions, deals magic damage)"], "image": { "full": "6261.png", "sprite": "mastery0.png", "group": "mastery", "x": 96, "y": 192, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6262": { "id": 6262, "name": "Courage of the Colossus", "description": ["Gain a shield for 3-54 (+5%  of your maximum health) for each nearby enemy champion for 3 seconds after hitting an enemy champion with a stun, taunt, snare, or knock up (45-30 second cooldown, based on level)."], "image": { "full": "6262.png", "sprite": "mastery0.png", "group": "mastery", "x": 144, "y": 192, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" }, "6263": { "id": 6263, "name": "Stoneborn Pact", "description": ["Gain 5% total health.<br>Your movement impairing effects brand enemy champions with an earthen rune for 4 seconds. Other allied champions who attack branded enemies heal for 5 + 2.5% of your maximum health over 2 seconds (halved if you are ranged)."], "image": { "full": "6263.png", "sprite": "mastery0.png", "group": "mastery", "x": 192, "y": 192, "w": 48, "h": 48 }, "ranks": 1, "prereq": "0" } } };

},{}],4:[function(require,module,exports){
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

},{"./objects":5}],5:[function(require,module,exports){
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

},{"fnjs":1}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope) {
    var _this = this;

    _lodash2.default.extend(this, {
        masteries: _masteries2.default.data,

        reset: function reset() {
            this.masteries.trees.forEach(function (tree) {
                return _masteries2.default.reset(tree);
            });
            this.masteries.points = 0;
            $rootScope.$broadcast('masteries.updated', flatten(this.masteries.trees));
        }
    });

    $scope.$on('mastery.attempt.spend', function ($event, _ref) {
        var mastery = _ref.mastery;
        var tree = _ref.tree;
        var points = _ref.points;

        var changed = _masteries2.default.addPoints(_this.masteries, { tree: tree, mastery: mastery, points: points });

        if (changed) {
            $scope.$emit('mastery.updated', mastery);
        }
    });

    $scope.$on('mastery.attempt.refund', function ($event, _ref2) {
        var mastery = _ref2.mastery;
        var tree = _ref2.tree;
        var points = _ref2.points;

        var changed = _masteries2.default.removePoints(_this.masteries, { tree: tree, mastery: mastery, points: points });

        if (changed) {
            $scope.$emit('mastery.updated', mastery);
        }
    });

    $scope.$on('mastery.updated', function ($event, mastery) {
        $rootScope.$broadcast('masteries.updated', flatten(_this.masteries.trees));
    });

    if (_general2.default.LOAD_LIVE_DATA) {
        _masteries2.default.loadLiveData().then(function (data) {
            return _this.masteries = data;
        }).then(function (data) {
            return console.log('data loaded from live', data);
        }).then(function (data) {
            return $scope.$apply();
        });
    }
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _general = require('config/general');

var _general2 = _interopRequireDefault(_general);

var _masteries = require('services/masteries');

var _masteries2 = _interopRequireDefault(_masteries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function flatten(trees) {
    return trees.reduce(function (masteries, tree) {
        return masteries.concat(tree.talents.filter(function (t) {
            return t.points > 0;
        }));
    }, []);
}

;

},{"config/general":2,"lodash":"lodash","services/masteries":28}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'masteries/components/app/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components.app', []).directive('suMasteriesApp', _directive2.default);

},{"./directive":8,"angular":"angular"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components', [require('./tooltip').default.name, require('./talent').default.name, require('./tree').default.name, require('./app').default.name]);

},{"./app":9,"./talent":17,"./tooltip":20,"./tree":23,"angular":"angular"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($scope) {
    _lodash2.default.extend(this, {
        total: $scope.$parent.$parent.points,

        spend: function spend($event, mastery) {
            var points = $event.ctrlKey || $event.metaKey ? mastery.ranks - mastery.points : 1;

            $scope.$emit('mastery.attempt.spend', { mastery: mastery, points: points, tree: $scope.tree });

            _analytics2.default.trackEvent({
                category: _analytics.EventCategories.MASTERY,
                action: _analytics.EventActions.CLICK,
                label: _analytics.EventLabels.ADDED,
                value: mastery.id
            });
        },
        refund: function refund($event, mastery) {
            var points = $event.ctrlKey || $event.metaKey ? mastery.points : 1;

            $scope.$emit('mastery.attempt.refund', { mastery: mastery, points: points, tree: $scope.tree });

            _analytics2.default.trackEvent({
                category: _analytics.EventCategories.MASTERY,
                action: _analytics.EventActions.CLICK,
                label: _analytics.EventLabels.REMOVED,
                value: mastery.id
            });
        }
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _analytics = require('services/analytics');

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"lodash":"lodash","services/analytics":25}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            talent: '=',
            tree: '='
        },
        templateUrl: 'masteries/components/talent/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (talent, tree) {
        return talent.points == talent.ranks ? 'complete' : talent.points > 0 ? 'partial' : _masteries2.default.available(talent, tree) ? 'available' : 'unavailable';
    };
};

var _masteries = require('services/masteries');

var _masteries2 = _interopRequireDefault(_masteries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"services/masteries":28}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components.talent.filters', []).filter('style', require('./style').default).filter('sprite', require('./sprite').default).filter('classname', require('./classname').default);

},{"./classname":13,"./sprite":15,"./style":16,"angular":"angular"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (talent) {
        var image = _ddragon2.default.imageURL(_masteries2.default.data.version, 'sprite/' + talent.image.sprite);

        return {
            backgroundImage: 'url(' + image + ')',
            backgroundPosition: '-' + talent.image.x + 'px -' + talent.image.y + 'px'
        };
    };
};

var _ddragon = require('services/ddragon');

var _ddragon2 = _interopRequireDefault(_ddragon);

var _masteries = require('services/masteries');

var _masteries2 = _interopRequireDefault(_masteries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"services/ddragon":26,"services/masteries":28}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (talent, tree) {
        var p = coords(talent, tree.talents);

        return {
            left: p.x + 'px',
            top: p.y + 'px'
        };
    };
};

var _masteries = require('services/masteries');

var _masteries2 = _interopRequireDefault(_masteries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dimens = {
    Y_MARGIN: 25,
    X_MARGIN: 60,
    X_MARGIN_KEYSTONE: 87,

    Y_DIST: 80,
    X_DIST: 120,
    X_DIST_KEYSTONE: 66
};

function coords(talent, talents) {
    var keystone = talent.tier % 2 != 0;
    var tripleRow = talents.filter(function (t) {
        return t.tier == talent.tier;
    }).length == 3;

    var xIndex = _masteries2.default.tierIndex(talent, talents);
    var yIndex = talent.tier;

    var xDist = keystone ? Dimens.X_DIST_KEYSTONE : Dimens.X_DIST;
    var xMargin = keystone ? Dimens.X_MARGIN_KEYSTONE : Dimens.X_MARGIN;

    var x = xIndex * xDist + xMargin - (tripleRow ? 33 : 0);
    var y = yIndex * Dimens.Y_DIST + Dimens.Y_MARGIN;

    return { x: x, y: y };
}

},{"services/masteries":28}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components.talent', [require('./filters').default.name]).directive('suMasteriesTalent', _directive2.default);

},{"./directive":12,"./filters":14,"angular":"angular"}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = /*@ngInject*/function ($scope) {};

;

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            talent: '='
        },
        templateUrl: 'masteries/components/tooltip/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":18}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components.tooltip', []).directive('suMasteriesTooltip', _directive2.default);

},{"./directive":19,"angular":"angular"}],21:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tree: '='
        },
        templateUrl: 'masteries/components/tree/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":21}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries.components.tree', []).directive('suMasteriesTree', _directive2.default);

},{"./directive":22,"angular":"angular"}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularRaven = require('angular-raven');

var _angularRaven2 = _interopRequireDefault(_angularRaven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('masteries', ['ngRaven', 'common', 'masteries.templates', require('./components').default.name]);

},{"./components":10,"angular":"angular","angular-raven":"angular-raven"}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"lib/http":4,"lib/strings":6,"services/globals":27}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    version: '7.6.1'
};

exports.default = config;

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _masteries = require('data/7.6.1/masteries');

var _masteries2 = _interopRequireDefault(_masteries);

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

var _ddragon = require('services/ddragon');

var _ddragon2 = _interopRequireDefault(_ddragon);

var _masteries3 = require('transformers/masteries');

var _masteries4 = _interopRequireDefault(_masteries3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: (0, _masteries4.default)(_masteries2.default),

    loadLiveData: function loadLiveData() {
        var _this = this;

        return _ddragon2.default.fetchData(_globals2.default.version, _ddragon.DataTargets.MASTERIES).then(function (rawdata) {
            return (0, _masteries4.default)(rawdata);
        }).then(function (data) {
            return _this.data = data;
        });
    },
    reset: function reset(tree) {
        tree.points = 0;
        tree.talents.forEach(function (t) {
            return t.points = 0;
        });
    },
    available: function available(talent, tree) {
        var reqs = [0, 5, 6, 11, 12, 17];
        return tree.points >= reqs[talent.tier];
    },
    tierIndex: function tierIndex(talent, talents) {
        return talents.filter(function (t) {
            return t.tier == talent.tier;
        }).indexOf(talent);
    },
    addPoints: function addPoints(masteries, _ref) {
        var tree = _ref.tree;
        var mastery = _ref.mastery;
        var points = _ref.points;

        var changed = false;

        if (!this.available(mastery, tree)) return changed;

        var tierPoints = tree.talents.filter(function (t) {
            return t.tier == mastery.tier && t.points > 0;
        }).reduce(function (points, t) {
            return points + t.points;
        }, 0);

        // Add while points are freely available (and the tier does not go above the max)
        while (masteries.points < 30 && tree.points < 18 && mastery.points < mastery.ranks && points > 0 && tierPoints < mastery.ranks) {
            mastery.points += 1;
            tree.points += 1;
            masteries.points += 1;
            tierPoints += 1;
            points -= 1;
            changed = true;
        }

        var tier = tree.talents.filter(function (t) {
            return t.tier == mastery.tier && t.id != mastery.id && t.points > 0;
        });
        tierPoints = tier.reduce(function (points, t) {
            return points + t.points;
        }, 0);

        // If the tier is at the max, or no points are available elsewhere - pull from the current tier.
        while (points > 0 && tierPoints > 0) {
            tier[0].points -= 1;
            mastery.points += 1;
            points -= 1;

            tier = tier.filter(function (t) {
                return t.points > 0;
            });
            tierPoints = tier.reduce(function (points, mastery) {
                return points + mastery.points;
            }, 0);
            changed = true;
        }

        return changed;
    },
    removePoints: function removePoints(masteries, _ref2) {
        var tree = _ref2.tree;
        var mastery = _ref2.mastery;
        var points = _ref2.points;

        var higherClaimedTalents = tree.talents.filter(function (t) {
            return t.tier > mastery.tier;
        }).filter(function (t) {
            return t.points > 0;
        });

        var canAdd = mastery.points > 0 && higherClaimedTalents.length == 0;

        if (canAdd) {
            masteries.points -= points;
            tree.points -= points;
            mastery.points -= points;
        }

        return canAdd && points > 0;
    }
};

},{"data/7.6.1/masteries":3,"services/ddragon":26,"services/globals":27,"transformers/masteries":30}],29:[function(require,module,exports){
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

},{"lib/objects":5}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objects = require('lib/objects');

var _modifiers = require('services/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MasteryMods = {
    '6111': [(0, _objects.mix)(_modifiers.Mods.FLAT_ATTACK_SPEED_PCT, { value: 0.008 })],
    '6114': [(0, _objects.mix)(_modifiers.Mods.ABILITY_DAMAGE, { value: 0.004 })],
    '6131': [(0, _objects.mix)(_modifiers.Mods.FLAT_LIFE_STEAL, { value: 0.004 }), (0, _objects.mix)(_modifiers.Mods.FLAT_SPELL_VAMP, { value: 0.004 })],
    '6134': [(0, _objects.mix)(_modifiers.Mods.SCALING_MAGIC_DAMAGE, { value: 0.166 }), (0, _objects.mix)(_modifiers.Mods.SCALING_ATTACK_DAMAGE, { value: 0.11 })],
    '6151': [(0, _objects.mix)(_modifiers.Mods.FLAT_PCT_ARMOR_PEN, { value: 0.014 })],
    '6154': [(0, _objects.mix)(_modifiers.Mods.FLAT_PCT_MAGIC_PEN, { value: 0.014 })],
    '6211': [(0, _objects.mix)(_modifiers.Mods.FLAT_HP_REGEN, { value: 0.004 })],
    '6232': [(0, _objects.mix)(_modifiers.Mods.FLAT_HP_POOL, { value: 9 })],
    '6251': [(0, _objects.mix)(_modifiers.Mods.FLAT_TENACITY, { value: 0.03 })],
    '6351': [(0, _objects.mix)(_modifiers.Mods.FLAT_ARMOR_PEN, { value: 0.6 }), (0, _objects.mix)(_modifiers.Mods.FLAT_MAGIC_PEN, { value: 0.6 }), (0, _objects.mix)(_modifiers.Mods.SCALING_ARMOR_PEN, { value: 0.006 }), (0, _objects.mix)(_modifiers.Mods.SCALING_MAGIC_PEN, { value: 0.006 })],
    '6352': [(0, _objects.mix)(_modifiers.Mods.FLAT_CDR, { value: 0.01 }), (0, _objects.mix)(_modifiers.Mods.FLAT_MAX_CDR, { value: 0.01 })]
};

function transform(rawMasteries) {
    var talents = _lodash2.default.mapValues(rawMasteries.data, function (talent) {
        return {
            id: talent.id,
            name: talent.name,
            description: talent.description,
            ranks: talent.ranks,
            image: talent.image,
            points: 0
        };
    });

    var trees = _lodash2.default.values(_lodash2.default.mapValues(rawMasteries.tree, function (tree, name) {
        return {
            name: name,
            points: 0,
            talents: tree.map(function (talentRow, tier) {
                return talentRow.filter(function (talent) {
                    return !!talent;
                }).map(function (talent) {
                    return talents[talent.masteryId];
                }).map(function (talent) {
                    return _lodash2.default.extend(talent, {
                        tier: tier,
                        mods: MasteryMods[talent.id] || []
                    });
                });
            }).reduce(function (talents, row) {
                return talents.concat(row);
            }, [])
        };
    }));

    return {
        version: rawMasteries.version,
        trees: trees,
        talents: talents,
        points: 0
    };
}

exports.default = transform;

},{"lib/objects":5,"lodash":"lodash","services/modifiers":29}]},{},[24])

//# sourceMappingURL=masteries.js.map
