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
"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default={"type":"champion","format":"standAloneComplex","version":"7.6.1","data":{"Aatrox":{"version":"7.6.1","id":"Aatrox","key":"266","name":"Aatrox","title":"the Darkin Blade","blurb":"Aatrox is a legendary warrior, one of only five that remain of an ancient race known as the Darkin. He wields his massive blade with grace and poise, slicing through legions in a style that is hypnotic to behold. With each foe felled, Aatrox's seemingly...","info":{"attack":8,"defense":4,"magic":3,"difficulty":4},"image":{"full":"Aatrox.png","sprite":"champion0.png","group":"champion","x":0,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Blood Well","stats":{"hp":580,"hpperlevel":85,"mp":100,"mpperlevel":0,"movespeed":345,"armor":24.384,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":150,"hpregen":6.59,"hpregenperlevel":0.5,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":60.376,"attackdamageperlevel":3.2,"attackspeedoffset":-0.04,"attackspeedperlevel":3}},"Ahri":{"version":"7.6.1","id":"Ahri","key":"103","name":"Ahri","title":"the Nine-Tailed Fox","blurb":"Unlike other foxes that roamed the woods of southern Ionia, Ahri had always felt a strange connection to the magical world around her; a connection that was somehow incomplete. Deep inside, she felt the skin she had been born into was an ill fit for her...","info":{"attack":3,"defense":4,"magic":8,"difficulty":5},"image":{"full":"Ahri.png","sprite":"champion0.png","group":"champion","x":48,"y":0,"w":48,"h":48},"tags":["Mage","Assassin"],"partype":"Mana","stats":{"hp":514.4,"hpperlevel":80,"mp":334,"mpperlevel":50,"movespeed":330,"armor":20.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.508,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.04,"attackdamageperlevel":3,"attackspeedoffset":-0.065,"attackspeedperlevel":2}},"Akali":{"version":"7.6.1","id":"Akali","key":"84","name":"Akali","title":"the Fist of Shadow","blurb":"There exists an ancient order originating in the Ionian Isles dedicated to the preservation of balance. Order, chaos, light, darkness -- all things must exist in perfect harmony for such is the way of the universe. This order is known as the Kinkou and...","info":{"attack":5,"defense":3,"magic":8,"difficulty":7},"image":{"full":"Akali.png","sprite":"champion0.png","group":"champion","x":96,"y":0,"w":48,"h":48},"tags":["Assassin"],"partype":"Energy","stats":{"hp":587.8,"hpperlevel":85,"mp":200,"mpperlevel":0,"movespeed":350,"armor":26.38,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.342,"hpregenperlevel":0.65,"mpregen":50,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":58.376,"attackdamageperlevel":3.2,"attackspeedoffset":-0.1,"attackspeedperlevel":3.1}},"Alistar":{"version":"7.6.1","id":"Alistar","key":"12","name":"Alistar","title":"the Minotaur","blurb":"As the mightiest warrior to ever emerge from the Minotaur tribes of the Great Barrier, Alistar defended his tribe from Valoran's many dangers; that is, until the coming of the Noxian army. Alistar was lured from his village by the machinations of Keiran...","info":{"attack":6,"defense":9,"magic":5,"difficulty":7},"image":{"full":"Alistar.png","sprite":"champion0.png","group":"champion","x":144,"y":0,"w":48,"h":48},"tags":["Tank","Support"],"partype":"Mana","stats":{"hp":613.36,"hpperlevel":106,"mp":278.84,"mpperlevel":38,"movespeed":330,"armor":24.38,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.678,"hpregenperlevel":0.85,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":61.1116,"attackdamageperlevel":3.62,"attackspeedoffset":0,"attackspeedperlevel":2.125}},"Amumu":{"version":"7.6.1","id":"Amumu","key":"32","name":"Amumu","title":"the Sad Mummy","blurb":"''Solitude can be lonelier than death.''<br><br>A lonely and melancholy soul from ancient Shurima, Amumu roams the world in search of a friend. Cursed by an ancient spell, he is doomed to remain alone forever, as his touch is death and his affection...","info":{"attack":2,"defense":6,"magic":8,"difficulty":3},"image":{"full":"Amumu.png","sprite":"champion0.png","group":"champion","x":192,"y":0,"w":48,"h":48},"tags":["Tank","Mage"],"partype":"Mana","stats":{"hp":613.12,"hpperlevel":84,"mp":287.2,"mpperlevel":40,"movespeed":335,"armor":23.544,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.878,"hpregenperlevel":0.85,"mpregen":7.382,"mpregenperlevel":0.525,"crit":0,"critperlevel":0,"attackdamage":53.384,"attackdamageperlevel":3.8,"attackspeedoffset":-0.02,"attackspeedperlevel":2.18}},"Anivia":{"version":"7.6.1","id":"Anivia","key":"34","name":"Anivia","title":"the Cryophoenix","blurb":"Anivia is a being of the coldest winter, a mystical embodiment of ice magic, and an ancient protector of the Freljord. She commands all the power and fury of the land itself, calling the snow and bitter wind to defend her home from those who would harm...","info":{"attack":1,"defense":4,"magic":10,"difficulty":10},"image":{"full":"Anivia.png","sprite":"champion0.png","group":"champion","x":240,"y":0,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":467.6,"hpperlevel":70,"mp":396.04,"mpperlevel":50,"movespeed":325,"armor":21.22,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":600,"hpregen":5.574,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":51.376,"attackdamageperlevel":3.2,"attackspeedoffset":0,"attackspeedperlevel":1.68}},"Annie":{"version":"7.6.1","id":"Annie","key":"1","name":"Annie","title":"the Dark Child","blurb":"There have always been those within Noxus who did not agree with the evils perpetrated by the Noxian High Command. The High Command had just put down a coup attempt from the self-proclaimed Crown Prince Raschallion, and a crackdown on any form of...","info":{"attack":2,"defense":3,"magic":10,"difficulty":6},"image":{"full":"Annie.png","sprite":"champion0.png","group":"champion","x":288,"y":0,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":511.68,"hpperlevel":76,"mp":334,"mpperlevel":50,"movespeed":335,"armor":19.22,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":575,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":50.41,"attackdamageperlevel":2.625,"attackspeedoffset":0.08,"attackspeedperlevel":1.36}},"Ashe":{"version":"7.6.1","id":"Ashe","key":"22","name":"Ashe","title":"the Frost Archer","blurb":"With each arrow she fires from her ancient ice-enchanted bow, Ashe proves she is a master archer. She chooses each target carefully, waits for the right moment, and then strikes with power and precision. It is with this same vision and focus that she...","info":{"attack":7,"defense":3,"magic":2,"difficulty":4},"image":{"full":"Ashe.png","sprite":"champion0.png","group":"champion","x":336,"y":0,"w":48,"h":48},"tags":["Marksman","Support"],"partype":"Mana","stats":{"hp":527.72,"hpperlevel":79,"mp":280,"mpperlevel":32,"movespeed":325,"armor":21.212,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":600,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6.972,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":56.508,"attackdamageperlevel":2.26,"attackspeedoffset":-0.05,"attackspeedperlevel":3.33}},"AurelionSol":{"version":"7.6.1","id":"AurelionSol","key":"136","name":"Aurelion Sol","title":"The Star Forger","blurb":"Aurelion Sol once graced the vast emptiness of the cosmos with celestial wonders of his own devising. Now, he is forced to wield his awesome power at the behest of a space-faring empire that tricked him into servitude. Desiring a return to his...","info":{"attack":2,"defense":3,"magic":8,"difficulty":7},"image":{"full":"AurelionSol.png","sprite":"champion0.png","group":"champion","x":384,"y":0,"w":48,"h":48},"tags":["Mage","Fighter"],"partype":"Mana","stats":{"hp":550,"hpperlevel":80,"mp":350,"mpperlevel":50,"movespeed":325,"armor":19,"armorperlevel":3.6,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.5,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":57,"attackdamageperlevel":3.2,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Azir":{"version":"7.6.1","id":"Azir","key":"268","name":"Azir","title":"the Emperor of the Sands","blurb":"''Shurima was once the glory of Runeterra. I will make it so again.''<br><br>Azir was a mortal emperor of Shurima in a far distant age, a proud man who stood at the cusp of immortality. His hubris saw him betrayed and murdered at the moment of his...","info":{"attack":6,"defense":3,"magic":8,"difficulty":9},"image":{"full":"Azir.png","sprite":"champion0.png","group":"champion","x":432,"y":0,"w":48,"h":48},"tags":["Mage","Marksman"],"partype":"Mana","stats":{"hp":524.4,"hpperlevel":80,"mp":350.56,"mpperlevel":42,"movespeed":325,"armor":19.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":6.924,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":52,"attackdamageperlevel":2.8,"attackspeedoffset":-0.02,"attackspeedperlevel":1.5}},"Bard":{"version":"7.6.1","id":"Bard","key":"432","name":"Bard","title":"the Wandering Caretaker","blurb":"Bard travels through realms beyond the imagination of mortal beings. Some of Valoran's greatest scholars have spent their lives trying to understand the mysteries he embodies. This enigmatic spirit has been given many names throughout the history of...","info":{"attack":4,"defense":4,"magic":5,"difficulty":9},"image":{"full":"Bard.png","sprite":"champion0.png","group":"champion","x":0,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":535,"hpperlevel":89,"mp":350,"mpperlevel":50,"movespeed":330,"armor":25,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":5.4,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":52,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2}},"Blitzcrank":{"version":"7.6.1","id":"Blitzcrank","key":"53","name":"Blitzcrank","title":"the Great Steam Golem","blurb":"Zaun is a place where both magic and science have gone awry, and the unchecked nature of experimentation has taken its toll. However, Zaun's lenient restrictions allow their researchers and inventors the leeway to push the bounds of science at an...","info":{"attack":4,"defense":8,"magic":5,"difficulty":4},"image":{"full":"Blitzcrank.png","sprite":"champion0.png","group":"champion","x":48,"y":48,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":582.6,"hpperlevel":95,"mp":267.2,"mpperlevel":40,"movespeed":325,"armor":24.38,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.51,"hpregenperlevel":0.75,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":61.54,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":1.13}},"Brand":{"version":"7.6.1","id":"Brand","key":"63","name":"Brand","title":"the Burning Vengeance","blurb":"In a faraway place known as Lokfar there was a seafaring marauder called Kegan Rodhe. As was his people's way, Kegan sailed far and wide with his fellows, stealing treasures from those unlucky enough to catch their attention. To some, he was a monster;...","info":{"attack":2,"defense":2,"magic":9,"difficulty":4},"image":{"full":"Brand.png","sprite":"champion0.png","group":"champion","x":96,"y":48,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":507.68,"hpperlevel":76,"mp":375.6,"mpperlevel":42,"movespeed":340,"armor":21.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":8.008,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":57.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Braum":{"version":"7.6.1","id":"Braum","key":"201","name":"Braum","title":"the Heart of the Freljord","blurb":"''Would you like a bedtime story?''<br><br>''Grandma, I'm too old for that.''<br><br>''You're never too old to be told a story.''<br><br>The girl reluctantly crawls into bed and waits, knowing she won't win this battle. A bitter wind howls outside...","info":{"attack":3,"defense":9,"magic":4,"difficulty":3},"image":{"full":"Braum.png","sprite":"champion0.png","group":"champion","x":144,"y":48,"w":48,"h":48},"tags":["Support","Tank"],"partype":"Mana","stats":{"hp":576.16,"hpperlevel":87,"mp":310.6,"mpperlevel":45,"movespeed":335,"armor":26.72,"armorperlevel":4.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.18,"hpregenperlevel":1,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55.376,"attackdamageperlevel":3.2,"attackspeedoffset":-0.03,"attackspeedperlevel":3.5}},"Caitlyn":{"version":"7.6.1","id":"Caitlyn","key":"51","name":"Caitlyn","title":"the Sheriff of Piltover","blurb":"''Go ahead, run. I'll give you a five minute head start.''<br><br>One of the reasons Piltover is known as the City of Progress is because it has an extraordinarily low crime rate. This hasn't always been the case; brigands and thieves of all sorts used...","info":{"attack":8,"defense":2,"magic":2,"difficulty":6},"image":{"full":"Caitlyn.png","sprite":"champion0.png","group":"champion","x":192,"y":48,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":524.4,"hpperlevel":80,"mp":313.7,"mpperlevel":35,"movespeed":325,"armor":22.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":650,"hpregen":5.674,"hpregenperlevel":0.55,"mpregen":7.4,"mpregenperlevel":0.55,"crit":0,"critperlevel":0,"attackdamage":53.66,"attackdamageperlevel":2.18,"attackspeedoffset":0.1,"attackspeedperlevel":4}},"Camille":{"version":"7.6.1","id":"Camille","key":"164","name":"Camille","title":"the Steel Shadow","blurb":"Weaponized to execute outside the boundaries of the law, Camille Ferros is an elegant and elite operative who ensures the commerce of the Piltover machine with its Zaunite underbelly runs smoothly. Raised among manners and money, she is the Principal...","info":{"attack":8,"defense":6,"magic":3,"difficulty":4},"image":{"full":"Camille.png","sprite":"champion0.png","group":"champion","x":240,"y":48,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":575.6,"hpperlevel":85,"mp":338.8,"mpperlevel":32,"movespeed":340,"armor":26,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.5,"hpregenperlevel":0.8,"mpregen":8.15,"mpregenperlevel":0.75,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Cassiopeia":{"version":"7.6.1","id":"Cassiopeia","key":"69","name":"Cassiopeia","title":"the Serpent's Embrace","blurb":"Cassiopeia is a terrifying creature - half woman, half snake - whose slightest glance brings death. The youngest daughter of one of Noxus' most influential families, she was once a beautiful and cunning temptress capable of manipulating the hardest...","info":{"attack":2,"defense":3,"magic":9,"difficulty":10},"image":{"full":"Cassiopeia.png","sprite":"champion0.png","group":"champion","x":288,"y":48,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":525,"hpperlevel":75,"mp":375,"mpperlevel":60,"movespeed":328,"armor":25,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.5,"hpregenperlevel":0.5,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53,"attackdamageperlevel":3,"attackspeedoffset":-0.034,"attackspeedperlevel":1.5}},"Chogath":{"version":"7.6.1","id":"Chogath","key":"31","name":"Cho'Gath","title":"the Terror of the Void","blurb":"There is a place between dimensions, between worlds. To some it is known as the Outside, to others it is the Unknown. To those that truly know, however, it is called the Void. Despite its name, the Void is not an empty place, but rather the home of...","info":{"attack":3,"defense":7,"magic":7,"difficulty":5},"image":{"full":"Chogath.png","sprite":"champion0.png","group":"champion","x":336,"y":48,"w":48,"h":48},"tags":["Tank","Mage"],"partype":"Mana","stats":{"hp":574.4,"hpperlevel":80,"mp":272.2,"mpperlevel":40,"movespeed":345,"armor":28.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.928,"hpregenperlevel":0.85,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":61.156,"attackdamageperlevel":4.2,"attackspeedoffset":0,"attackspeedperlevel":1.44}},"Corki":{"version":"7.6.1","id":"Corki","key":"42","name":"Corki","title":"the Daring Bombardier","blurb":"When Heimerdinger and his yordle colleagues migrated to Piltover, they embraced science as a way of life, and they immediately made several groundbreaking contributions to the techmaturgical community. What yordles lack in stature, they make up for with...","info":{"attack":8,"defense":3,"magic":6,"difficulty":6},"image":{"full":"Corki.png","sprite":"champion0.png","group":"champion","x":384,"y":48,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":512.76,"hpperlevel":82,"mp":350.16,"mpperlevel":34,"movespeed":325,"armor":23.38,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":7.424,"mpregenperlevel":0.55,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":2.3}},"Darius":{"version":"7.6.1","id":"Darius","key":"122","name":"Darius","title":"the Hand of Noxus","blurb":"There is no greater symbol of Noxian might than Darius, the nation's most feared and battle-hardened warrior. Orphaned at a young age, Darius had to fight to keep himself and his younger brother alive. By the time he joined the military, he had already...","info":{"attack":9,"defense":5,"magic":1,"difficulty":2},"image":{"full":"Darius.png","sprite":"champion0.png","group":"champion","x":432,"y":48,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":582.24,"hpperlevel":100,"mp":263,"mpperlevel":37.5,"movespeed":340,"armor":30,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":9.846,"hpregenperlevel":0.95,"mpregen":6.588,"mpregenperlevel":0.35,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":5,"attackspeedoffset":0,"attackspeedperlevel":1}},"Diana":{"version":"7.6.1","id":"Diana","key":"131","name":"Diana","title":"Scorn of the Moon","blurb":"''I am the light coursing in the soul of the moon.''<br><br>Bearing her crescent moonblade, Diana fights as a warrior of the Lunari, a faith all but quashed in the lands around Mount Targon. Clad in shimmering armor the color of winter snow at night...","info":{"attack":7,"defense":6,"magic":8,"difficulty":4},"image":{"full":"Diana.png","sprite":"champion0.png","group":"champion","x":0,"y":96,"w":48,"h":48},"tags":["Fighter","Mage"],"partype":"Mana","stats":{"hp":589.2,"hpperlevel":90,"mp":297.2,"mpperlevel":40,"movespeed":345,"armor":26.048,"armorperlevel":3.6,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":150,"hpregen":7.428,"hpregenperlevel":0.85,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.25}},"Draven":{"version":"7.6.1","id":"Draven","key":"119","name":"Draven","title":"the Glorious Executioner","blurb":"Unlike his brother Darius, victory in battle was never enough for Draven. He craved recognition, acclaim, and glory. He first sought greatness in the Noxian military, but his flair for the dramatic went severely underappreciated. Thirsting for a method...","info":{"attack":9,"defense":3,"magic":1,"difficulty":8},"image":{"full":"Draven.png","sprite":"champion0.png","group":"champion","x":48,"y":96,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":557.76,"hpperlevel":82,"mp":360.56,"mpperlevel":39,"movespeed":330,"armor":25.544,"armorperlevel":3.3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.176,"hpregenperlevel":0.7,"mpregen":8.042,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":55.8,"attackdamageperlevel":2.91,"attackspeedoffset":-0.08,"attackspeedperlevel":2.7}},"DrMundo":{"version":"7.6.1","id":"DrMundo","key":"36","name":"Dr. Mundo","title":"the Madman of Zaun","blurb":"''Beware the Madman of Zaun. In his eyes, you are already dead''<br><br>It is said that the man now known as Dr. Mundo was born without any sort of conscience. Instead, he had an unquenchable desire to inflict pain through experimentation. By the time...","info":{"attack":5,"defense":7,"magic":6,"difficulty":5},"image":{"full":"DrMundo.png","sprite":"champion0.png","group":"champion","x":96,"y":96,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"None","stats":{"hp":582.52,"hpperlevel":89,"mp":0,"mpperlevel":0,"movespeed":345,"armor":26.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.76,"hpregenperlevel":0.75,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":61.27,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.8}},"Ekko":{"version":"7.6.1","id":"Ekko","key":"245","name":"Ekko","title":"the Boy Who Shattered Time","blurb":"A prodigy from the rough streets of Zaun, Ekko manipulates time to spin any situation to his advantage. Using his own invention, the Zero-Drive, he explores the branching possibilities of reality. As well as experimenting with multi-dimensional...","info":{"attack":5,"defense":3,"magic":7,"difficulty":8},"image":{"full":"Ekko.png","sprite":"champion0.png","group":"champion","x":144,"y":96,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":580,"hpperlevel":80,"mp":280,"mpperlevel":50,"movespeed":340,"armor":27,"armorperlevel":3,"spellblock":32,"spellblockperlevel":1.25,"attackrange":125,"hpregen":9,"hpregenperlevel":0.9,"mpregen":7,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":3.3}},"Elise":{"version":"7.6.1","id":"Elise","key":"60","name":"Elise","title":"the Spider Queen","blurb":"''Beauty is power too, and can strike swifter than any sword.''<br><br>Elise is a deadly predator who dwells in a shuttered, lightless palace, deep in the Immortal Bastion of Noxus. Once she was mortal, the mistress of a once-powerful house, but the...","info":{"attack":6,"defense":5,"magic":7,"difficulty":9},"image":{"full":"Elise.png","sprite":"champion0.png","group":"champion","x":192,"y":96,"w":48,"h":48},"tags":["Mage","Fighter"],"partype":"Mana","stats":{"hp":529.4,"hpperlevel":80,"mp":324,"mpperlevel":50,"movespeed":325,"armor":22.128,"armorperlevel":3.35,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.708,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":50.54,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":1.75}},"Evelynn":{"version":"7.6.1","id":"Evelynn","key":"28","name":"Evelynn","title":"the Widowmaker","blurb":"Swift and lethal, Evelynn is one of the most deadly - and expensive - assassins in all of Runeterra. Able to merge with the shadows at will, she patiently stalks her prey, waiting for the right moment to strike. While Evelynn is clearly not entirely...","info":{"attack":4,"defense":2,"magic":7,"difficulty":10},"image":{"full":"Evelynn.png","sprite":"champion0.png","group":"champion","x":240,"y":96,"w":48,"h":48},"tags":["Assassin","Mage"],"partype":"Mana","stats":{"hp":531.2,"hpperlevel":90,"mp":315.6,"mpperlevel":42,"movespeed":340,"armor":26.5,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":9.824,"hpregenperlevel":0.55,"mpregen":8.108,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":53.88,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":3.6}},"Ezreal":{"version":"7.6.1","id":"Ezreal","key":"81","name":"Ezreal","title":"the Prodigal Explorer","blurb":"The intrepid young adventurer Ezreal has explored some of the most remote and abandoned locations on Runeterra. During an expedition to the buried ruins of ancient Shurima, he recovered an amulet of incredible mystical power. Likely constructed to be...","info":{"attack":7,"defense":2,"magic":6,"difficulty":7},"image":{"full":"Ezreal.png","sprite":"champion0.png","group":"champion","x":288,"y":96,"w":48,"h":48},"tags":["Marksman","Mage"],"partype":"Mana","stats":{"hp":484.4,"hpperlevel":80,"mp":360.6,"mpperlevel":42,"movespeed":325,"armor":21.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.424,"hpregenperlevel":0.55,"mpregen":8.092,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":55.66,"attackdamageperlevel":2.41,"attackspeedoffset":0,"attackspeedperlevel":2.8}},"Fiddlesticks":{"version":"7.6.1","id":"Fiddlesticks","key":"9","name":"Fiddlesticks","title":"the Harbinger of Doom","blurb":"For nearly twenty years, Fiddlesticks has stood alone in the easternmost summoning chamber of the Institute of War. Only the burning emerald light of his unearthly gaze pierces the musty darkness of his dust-covered home. It is here that the Harbinger...","info":{"attack":2,"defense":3,"magic":9,"difficulty":9},"image":{"full":"Fiddlesticks.png","sprite":"champion0.png","group":"champion","x":336,"y":96,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":524.4,"hpperlevel":80,"mp":400.12,"mpperlevel":56,"movespeed":335,"armor":20.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":480,"hpregen":5.608,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":48.36,"attackdamageperlevel":2.625,"attackspeedoffset":0,"attackspeedperlevel":2.11}},"Fiora":{"version":"7.6.1","id":"Fiora","key":"114","name":"Fiora","title":"the Grand Duelist","blurb":"''I have come to kill you for the sake of honor. And though you possess none, still you die.''<br>The most feared duelist in all Valoran, Fiora is as renowned for her brusque manner and cunning mind as she is for the speed of her bluesteel rapier. Born...","info":{"attack":10,"defense":4,"magic":2,"difficulty":3},"image":{"full":"Fiora.png","sprite":"champion0.png","group":"champion","x":384,"y":96,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":550,"hpperlevel":85,"mp":300,"mpperlevel":40,"movespeed":345,"armor":24,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":150,"hpregen":8.25,"hpregenperlevel":0.55,"mpregen":8,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":3.3,"attackspeedoffset":0,"attackspeedperlevel":3.2}},"Fizz":{"version":"7.6.1","id":"Fizz","key":"105","name":"Fizz","title":"the Tidal Trickster","blurb":"Centuries ago, an ancient water-dwelling race built a hidden city beneath a mountain in the sea. Though these creatures had their enemies, the city was an impenetrable fortress, and, in the safety it provided, they grew complacent. Fizz, however...","info":{"attack":6,"defense":4,"magic":7,"difficulty":6},"image":{"full":"Fizz.png","sprite":"champion0.png","group":"champion","x":432,"y":96,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":558.48,"hpperlevel":86,"mp":317.2,"mpperlevel":37,"movespeed":335,"armor":22.412,"armorperlevel":3.4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":8.176,"hpregenperlevel":0.7,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":58.04,"attackdamageperlevel":3,"attackspeedoffset":-0.05,"attackspeedperlevel":3.1}},"Galio":{"version":"7.6.1","id":"Galio","key":"3","name":"Galio","title":"the Colossus","blurb":"Outside the gleaming city of Demacia, the stone colossus Galio keeps vigilant watch. Built as a bulwark against enemy mages, he often stands motionless for decades until the presence of powerful magic stirs him to life. Once activated, Galio makes the...","info":{"attack":1,"defense":10,"magic":6,"difficulty":5},"image":{"full":"Galio.png","sprite":"champion1.png","group":"champion","x":0,"y":0,"w":48,"h":48},"tags":["Tank","Mage"],"partype":"Mana","stats":{"hp":550,"hpperlevel":100,"mp":400,"mpperlevel":40,"movespeed":335,"armor":27,"armorperlevel":3.5,"spellblock":32,"spellblockperlevel":1.25,"attackrange":150,"hpregen":8,"hpregenperlevel":0.8,"mpregen":7,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":59,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":1.5}},"Gangplank":{"version":"7.6.1","id":"Gangplank","key":"41","name":"Gangplank","title":"the Saltwater Scourge","blurb":"''I was cutting throats and sinking Noxian war galleys when you were still pissing your britches, boy. You don't want to take me on.''<br><br>As unpredictable as he is brutal, the dethroned reaver king known as Gangplank is feared far and wide. Where he...","info":{"attack":7,"defense":6,"magic":4,"difficulty":9},"image":{"full":"Gangplank.png","sprite":"champion1.png","group":"champion","x":48,"y":0,"w":48,"h":48},"tags":["Fighter"],"partype":"Mana","stats":{"hp":540,"hpperlevel":82,"mp":282,"mpperlevel":40,"movespeed":345,"armor":26,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":6,"hpregenperlevel":0.6,"mpregen":7.5,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":3.2}},"Garen":{"version":"7.6.1","id":"Garen","key":"86","name":"Garen","title":"The Might of Demacia","blurb":"Throughout Valoran, the resolve of Demacia's military is alternately celebrated or despised, but always respected. Their ''zero tolerance'' moral code is strictly upheld by civilians and soldiers alike. In combat, this means Demacian troops may not make...","info":{"attack":7,"defense":7,"magic":1,"difficulty":5},"image":{"full":"Garen.png","sprite":"champion1.png","group":"champion","x":96,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"None","stats":{"hp":616.28,"hpperlevel":84.25,"mp":0,"mpperlevel":0,"movespeed":340,"armor":27.536,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":7.84,"hpregenperlevel":0.5,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":57.88,"attackdamageperlevel":4.5,"attackspeedoffset":0,"attackspeedperlevel":2.9}},"Gnar":{"version":"7.6.1","id":"Gnar","key":"150","name":"Gnar","title":"the Missing Link","blurb":"The jungle does not forgive blindness. Every broken branch tells a story.<br><br>I've hunted every creature this jungle has to offer. I was certain there were no challenges left here, but now there is something new. Each track is the size of a tusklord;...","info":{"attack":6,"defense":5,"magic":5,"difficulty":8},"image":{"full":"Gnar.png","sprite":"champion1.png","group":"champion","x":144,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Rage","stats":{"hp":540,"hpperlevel":65,"mp":100,"mpperlevel":0,"movespeed":325,"armor":23,"armorperlevel":2.5,"spellblock":30,"spellblockperlevel":0,"attackrange":175,"hpregen":4.5,"hpregenperlevel":1.75,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":51,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":6}},"Gragas":{"version":"7.6.1","id":"Gragas","key":"79","name":"Gragas","title":"the Rabble Rouser","blurb":"The only thing more important to Gragas than fighting is drinking. His unquenchable thirst for stronger ale has led him in search of the most potent and unconventional ingredients to toss in his still. Impulsive and unpredictable, this rowdy carouser...","info":{"attack":4,"defense":7,"magic":6,"difficulty":5},"image":{"full":"Gragas.png","sprite":"champion1.png","group":"champion","x":192,"y":0,"w":48,"h":48},"tags":["Fighter","Mage"],"partype":"Mana","stats":{"hp":583.52,"hpperlevel":89,"mp":400,"mpperlevel":47,"movespeed":330,"armor":29.05,"armorperlevel":3.6,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":5.5,"hpregenperlevel":0.5,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":61.38,"attackdamageperlevel":3.5,"attackspeedoffset":-0.04,"attackspeedperlevel":2.05}},"Graves":{"version":"7.6.1","id":"Graves","key":"104","name":"Graves","title":"the Outlaw","blurb":"Malcolm Graves is a wanted man in every realm, city and empire he has visited. Tough, strong-willed, and above all, relentless, through his life of crime he has amassed (then invariably lost) a small fortune.","info":{"attack":8,"defense":5,"magic":3,"difficulty":3},"image":{"full":"Graves.png","sprite":"champion1.png","group":"champion","x":240,"y":0,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":551.12,"hpperlevel":84,"mp":322.2,"mpperlevel":40,"movespeed":340,"armor":24.376,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":425,"hpregen":6.676,"hpregenperlevel":0.7,"mpregen":7.9,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":60.83,"attackdamageperlevel":2.41,"attackspeedoffset":0.3,"attackspeedperlevel":2.6}},"Hecarim":{"version":"7.6.1","id":"Hecarim","key":"120","name":"Hecarim","title":"the Shadow of War","blurb":"''Break their ranks and ride them down without mercy. Crush the living and feast on their terror.''<br><br>Hecarim is an armored colossus who charges from the Shadow Isles at the head of a deathly host of spectral horsemen to hunt the living. A...","info":{"attack":8,"defense":6,"magic":4,"difficulty":6},"image":{"full":"Hecarim.png","sprite":"champion1.png","group":"champion","x":288,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":580,"hpperlevel":90,"mp":277.2,"mpperlevel":40,"movespeed":345,"armor":26.72,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":7,"hpregenperlevel":0.75,"mpregen":6.5,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":58,"attackdamageperlevel":3.2,"attackspeedoffset":-0.0672,"attackspeedperlevel":2.5}},"Heimerdinger":{"version":"7.6.1","id":"Heimerdinger","key":"74","name":"Heimerdinger","title":"the Revered Inventor","blurb":"From the Journal of Professor Cecil B. Heimerdinger<br><br>10.14<br><br>09:15<br><br>Current meteorological conditions in Bandle City seem optimal. Atmospheric pressure is ideal for today's experiments!<br><br>Running a fifth trial for my...","info":{"attack":2,"defense":6,"magic":8,"difficulty":8},"image":{"full":"Heimerdinger.png","sprite":"champion1.png","group":"champion","x":336,"y":0,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":476,"hpperlevel":75,"mp":307.2,"mpperlevel":40,"movespeed":340,"armor":19.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":11.008,"hpregenperlevel":1.75,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55.536,"attackdamageperlevel":2.7,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Illaoi":{"version":"7.6.1","id":"Illaoi","key":"420","name":"Illaoi","title":"the Kraken Priestess","blurb":"''I'm not big on sermons. Broken bones teach better lessons.''<br>Illaoi's powerful physique is dwarfed only by her indomitable faith. As the prophet of the Great Kraken, she uses a huge, golden idol to rip her foes' spirits from their bodies and...","info":{"attack":8,"defense":6,"magic":3,"difficulty":4},"image":{"full":"Illaoi.png","sprite":"champion1.png","group":"champion","x":384,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":585.6,"hpperlevel":95,"mp":300,"mpperlevel":40,"movespeed":340,"armor":26,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":9.5,"hpregenperlevel":0.8,"mpregen":7.5,"mpregenperlevel":0.75,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":5,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Irelia":{"version":"7.6.1","id":"Irelia","key":"39","name":"Irelia","title":"the Will of the Blades","blurb":"''The sword flourishes, as though painting with blood.''<br><br>The Ionians have developed some of the most breathtaking and deadly martial arts in all of Runeterra - just one manifestation of their pursuit of enlightenment. The most remarkable blade...","info":{"attack":7,"defense":4,"magic":5,"difficulty":5},"image":{"full":"Irelia.png","sprite":"champion1.png","group":"champion","x":432,"y":0,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":607.2,"hpperlevel":90,"mp":338.8,"mpperlevel":32,"movespeed":345,"armor":25.3,"armorperlevel":3.75,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.592,"hpregenperlevel":0.65,"mpregen":8.1,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":61.544,"attackdamageperlevel":3.3,"attackspeedoffset":-0.06,"attackspeedperlevel":3.2}},"Ivern":{"version":"7.6.1","id":"Ivern","key":"427","name":"Ivern","title":"the Green Father","blurb":"Ivern Bramblefoot, known to many as the Green Father, is a peculiar half man, half tree who roams Runeterra's forests, cultivating life everywhere he goes. He knows the secrets of the natural world, and holds deep friendships with all things that grow...","info":{"attack":3,"defense":5,"magic":7,"difficulty":7},"image":{"full":"Ivern.png","sprite":"champion1.png","group":"champion","x":0,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":580,"hpperlevel":90,"mp":450,"mpperlevel":60,"movespeed":330,"armor":22,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":6.9,"hpregenperlevel":0.85,"mpregen":6,"mpregenperlevel":0.75,"crit":0,"critperlevel":0,"attackdamage":50,"attackdamageperlevel":3,"attackspeedoffset":-0.03,"attackspeedperlevel":3.4}},"Janna":{"version":"7.6.1","id":"Janna","key":"40","name":"Janna","title":"the Storm's Fury","blurb":"There are those sorcerers who give themselves over to the primal powers of nature, forgoing the learned practice of magic. Such a sorceress is Janna, who first learned magic as an orphan growing up amidst the chaos that is the city-state of Zaun. Janna...","info":{"attack":3,"defense":5,"magic":7,"difficulty":7},"image":{"full":"Janna.png","sprite":"champion1.png","group":"champion","x":48,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":487.04,"hpperlevel":78,"mp":409.52,"mpperlevel":64,"movespeed":335,"armor":19.384,"armorperlevel":3.8,"spellblock":30,"spellblockperlevel":0,"attackrange":475,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":11.5,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":51.956,"attackdamageperlevel":2.95,"attackspeedoffset":0,"attackspeedperlevel":2.61}},"JarvanIV":{"version":"7.6.1","id":"JarvanIV","key":"59","name":"Jarvan IV","title":"the Exemplar of Demacia","blurb":"''There is only one truth, and you will find it at the point of my lance.''<br><br>As the royal family of Demacia for centuries, members of the Lightshield line have spent their lives waging war against any who opposed Demacian ethics. It is said that...","info":{"attack":6,"defense":8,"magic":3,"difficulty":5},"image":{"full":"JarvanIV.png","sprite":"champion1.png","group":"champion","x":96,"y":48,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":571.2,"hpperlevel":90,"mp":302.2,"mpperlevel":40,"movespeed":340,"armor":29,"armorperlevel":3.6,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":8.176,"hpregenperlevel":0.7,"mpregen":6.756,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":55.712,"attackdamageperlevel":3.4,"attackspeedoffset":-0.05,"attackspeedperlevel":2.5}},"Jax":{"version":"7.6.1","id":"Jax","key":"24","name":"Jax","title":"Grandmaster at Arms","blurb":"It is seldom the case where a champion is defined by his actions after joining the League of Legends rather than before. Such is the case with Jax, for whom the argument could be made that he is the most prolific tournament fighter currently at the...","info":{"attack":7,"defense":5,"magic":7,"difficulty":5},"image":{"full":"Jax.png","sprite":"champion1.png","group":"champion","x":144,"y":48,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":592.8,"hpperlevel":85,"mp":338.8,"mpperlevel":32,"movespeed":350,"armor":27.04,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.374,"hpregenperlevel":0.55,"mpregen":7.576,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":61.97,"attackdamageperlevel":3.375,"attackspeedoffset":-0.02,"attackspeedperlevel":3.4}},"Jayce":{"version":"7.6.1","id":"Jayce","key":"126","name":"Jayce","title":"the Defender of Tomorrow","blurb":"Armed with wit, charm, and his signature transforming hammer, Jayce lives to protect his native Piltover. Long before his nation called him a hero, however, he was a promising young inventor. When Piltover commissioned him to study a rare arcane crystal...","info":{"attack":8,"defense":4,"magic":3,"difficulty":7},"image":{"full":"Jayce.png","sprite":"champion1.png","group":"champion","x":192,"y":48,"w":48,"h":48},"tags":["Fighter","Marksman"],"partype":"Mana","stats":{"hp":571.2,"hpperlevel":90,"mp":357.2,"mpperlevel":37,"movespeed":335,"armor":22.38,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":125,"hpregen":7.344,"hpregenperlevel":0.8,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":50.38,"attackdamageperlevel":3.5,"attackspeedoffset":-0.05,"attackspeedperlevel":3}},"Jhin":{"version":"7.6.1","id":"Jhin","key":"202","name":"Jhin","title":"the Virtuoso","blurb":"''Art requires a certain...cruelty.''<br><br>Jhin is a meticulous criminal psychopath who believes murder is art. Once an Ionian prisoner, but freed by shadowy elements within Ionia's ruling council, the serial killer now works as their cabal's assassin...","info":{"attack":10,"defense":2,"magic":6,"difficulty":6},"image":{"full":"Jhin.png","sprite":"champion1.png","group":"champion","x":240,"y":48,"w":48,"h":48},"tags":["Marksman","Assassin"],"partype":"Mana","stats":{"hp":540,"hpperlevel":85,"mp":300,"mpperlevel":50,"movespeed":330,"armor":20,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53,"attackdamageperlevel":4,"attackspeedoffset":0,"attackspeedperlevel":0}},"Jinx":{"version":"7.6.1","id":"Jinx","key":"222","name":"Jinx","title":"the Loose Cannon","blurb":"Jinx lives to wreak havoc without a thought for the consequences, leaving a trail of mayhem and panic in her wake. A manic and impulsive criminal, she despises nothing more than boredom, and gleefully brings her own volatile brand of pandemonium to the...","info":{"attack":9,"defense":2,"magic":4,"difficulty":6},"image":{"full":"Jinx.png","sprite":"champion1.png","group":"champion","x":288,"y":48,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":517.76,"hpperlevel":82,"mp":245.6,"mpperlevel":45,"movespeed":325,"armor":22.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.84,"hpregenperlevel":0.5,"mpregen":6.68,"mpregenperlevel":1,"crit":0,"critperlevel":0,"attackdamage":58.46,"attackdamageperlevel":2.41,"attackspeedoffset":0,"attackspeedperlevel":1}},"Kalista":{"version":"7.6.1","id":"Kalista","key":"429","name":"Kalista","title":"the Spear of Vengeance","blurb":"''When wronged, we seek justice. When hurt, we strike back. When betrayed, the Spear of Vengeance strikes!''<br><br>A specter of wrath and retribution, Kalista is the undying spirit of vengeance, an armored nightmare summoned from the Shadow Isles to...","info":{"attack":8,"defense":2,"magic":4,"difficulty":7},"image":{"full":"Kalista.png","sprite":"champion1.png","group":"champion","x":336,"y":48,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":517.76,"hpperlevel":83,"mp":231.8,"mpperlevel":35,"movespeed":325,"armor":19.012,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6,"hpregenperlevel":0.55,"mpregen":6.3,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":63,"attackdamageperlevel":2.9,"attackspeedoffset":-0.03,"attackspeedperlevel":2.5}},"Karma":{"version":"7.6.1","id":"Karma","key":"43","name":"Karma","title":"the Enlightened One","blurb":"Karma is a woman of indomitable will and unbound spiritual power. She is the soul of Ionia made manifest and an inspiring presence on the battlefield, shielding her allies and turning back her foes. A strong leader torn between tradition and revolution...","info":{"attack":1,"defense":7,"magic":8,"difficulty":5},"image":{"full":"Karma.png","sprite":"champion1.png","group":"champion","x":384,"y":48,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":522.44,"hpperlevel":83,"mp":374,"mpperlevel":50,"movespeed":335,"armor":20.384,"armorperlevel":3.8,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.624,"hpregenperlevel":0.55,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.544,"attackdamageperlevel":3.3,"attackspeedoffset":0,"attackspeedperlevel":2.3}},"Karthus":{"version":"7.6.1","id":"Karthus","key":"30","name":"Karthus","title":"the Deathsinger","blurb":"''Death is not the end of the journey, it is just the beginning...''<br><br>The harbinger of oblivion, Karthus is an undying spirit whose haunting songs are a prelude to the horror of his nightmarish appearance. The living fear the eternity of undeath...","info":{"attack":2,"defense":2,"magic":10,"difficulty":7},"image":{"full":"Karthus.png","sprite":"champion1.png","group":"champion","x":432,"y":48,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":516,"hpperlevel":75,"mp":372.48,"mpperlevel":61,"movespeed":335,"armor":20.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":450,"hpregen":6.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":45.66,"attackdamageperlevel":3.25,"attackspeedoffset":0,"attackspeedperlevel":2.11}},"Kassadin":{"version":"7.6.1","id":"Kassadin","key":"38","name":"Kassadin","title":"the Void Walker","blurb":"There is a place between dimensions and between worlds. To some it is known as the Outside, to others it is the Unknown. To most, however, it is called the Void. Despite its name, the Void is not an empty place, but rather the home of unspeakable things...","info":{"attack":3,"defense":5,"magic":8,"difficulty":8},"image":{"full":"Kassadin.png","sprite":"champion1.png","group":"champion","x":0,"y":96,"w":48,"h":48},"tags":["Assassin","Mage"],"partype":"Mana","stats":{"hp":564.04,"hpperlevel":78,"mp":397.6,"mpperlevel":67,"movespeed":340,"armor":23.376,"armorperlevel":3.2,"spellblock":30,"spellblockperlevel":0,"attackrange":150,"hpregen":7.79,"hpregenperlevel":0.5,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":58.852,"attackdamageperlevel":3.9,"attackspeedoffset":-0.023,"attackspeedperlevel":3.7}},"Katarina":{"version":"7.6.1","id":"Katarina","key":"55","name":"Katarina","title":"the Sinister Blade","blurb":"Driven by an intense killer instinct, Katarina uses her talents as an assassin for the glory of Noxus, and the continued elevation of her family. While her fervor drives her to ever-greater feats, it can sometimes lead her astray.<br><br>From childhood...","info":{"attack":4,"defense":3,"magic":9,"difficulty":8},"image":{"full":"Katarina.png","sprite":"champion1.png","group":"champion","x":48,"y":96,"w":48,"h":48},"tags":["Assassin","Mage"],"partype":"None","stats":{"hp":590,"hpperlevel":82,"mp":0,"mpperlevel":0,"movespeed":340,"armor":27.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.5,"hpregenperlevel":0.7,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":58,"attackdamageperlevel":3.2,"attackspeedoffset":-0.05,"attackspeedperlevel":2.74}},"Kayle":{"version":"7.6.1","id":"Kayle","key":"10","name":"Kayle","title":"The Judicator","blurb":"In a world far away where an ancient war still rages, Kayle was a great hero - the strongest of an immortal race committed to destroying evil wherever it could be found. For ten thousand years, Kayle fought tirelessly for her people, wielding her...","info":{"attack":6,"defense":6,"magic":7,"difficulty":7},"image":{"full":"Kayle.png","sprite":"champion1.png","group":"champion","x":96,"y":96,"w":48,"h":48},"tags":["Fighter","Support"],"partype":"Mana","stats":{"hp":574.24,"hpperlevel":93,"mp":322.2,"mpperlevel":40,"movespeed":335,"armor":26.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":125,"hpregen":8.26,"hpregenperlevel":0.75,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":51,"attackdamageperlevel":2.8,"attackspeedoffset":-0.02,"attackspeedperlevel":2.2}},"Kennen":{"version":"7.6.1","id":"Kennen","key":"85","name":"Kennen","title":"the Heart of the Tempest","blurb":"There exists an ancient order originating in the Ionian Isles dedicated to the preservation of balance. Order, chaos, light, darkness -- all things must exist in perfect harmony for such is the way of the universe. This order is known as the Kinkou and...","info":{"attack":6,"defense":4,"magic":7,"difficulty":4},"image":{"full":"Kennen.png","sprite":"champion1.png","group":"champion","x":144,"y":96,"w":48,"h":48},"tags":["Mage","Marksman"],"partype":"Energy","stats":{"hp":535.72,"hpperlevel":79,"mp":200,"mpperlevel":0,"movespeed":335,"armor":24.3,"armorperlevel":3.75,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.592,"hpregenperlevel":0.65,"mpregen":50,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":50.544,"attackdamageperlevel":3.3,"attackspeedoffset":-0.0947,"attackspeedperlevel":3.4}},"Khazix":{"version":"7.6.1","id":"Khazix","key":"121","name":"Kha'Zix","title":"the Voidreaver","blurb":"A vicious Void predator, Kha'Zix infiltrated Valoran to devour the land's most promising creatures. With each kill he absorbs his prey's strength, evolving to grow more powerful. Kha'Zix hungers most to conquer and consume Rengar, the one beast he...","info":{"attack":9,"defense":4,"magic":3,"difficulty":6},"image":{"full":"Khazix.png","sprite":"champion1.png","group":"champion","x":192,"y":96,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":572.8,"hpperlevel":85,"mp":327.2,"mpperlevel":40,"movespeed":350,"armor":27,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.51,"hpregenperlevel":0.75,"mpregen":7.59,"mpregenperlevel":0.5,"crit":0,"critperlevel":0,"attackdamage":55.21,"attackdamageperlevel":3.1,"attackspeedoffset":-0.065,"attackspeedperlevel":2.7}},"Kindred":{"version":"7.6.1","id":"Kindred","key":"203","name":"Kindred","title":"The Eternal Hunters","blurb":"''Tell me again, little Lamb, which things are ours to take?''<br>''All things, Dear Wolf.''<br>Separate, but never parted, Kindred represents the twin essences of death. Lamb's arrow offers a swift release for those who accept their fate. Wolf hunts...","info":{"attack":8,"defense":2,"magic":2,"difficulty":4},"image":{"full":"Kindred.png","sprite":"champion1.png","group":"champion","x":240,"y":96,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":540,"hpperlevel":85,"mp":300,"mpperlevel":35,"movespeed":325,"armor":20,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":7,"hpregenperlevel":0.55,"mpregen":6.972,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":54,"attackdamageperlevel":1.7,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Kled":{"version":"7.6.1","id":"Kled","key":"240","name":"Kled","title":"the Cantankerous Cavalier","blurb":"''A sane man would run . . . but I ain't the runnin' kind!''<br><br>A warrior as fearless as he is ornery, Kled is a popular folk hero in Noxus. Embodying the furious bravado of his nation, he is an icon beloved by the empire's soldiers, distrusted by...","info":{"attack":8,"defense":2,"magic":2,"difficulty":7},"image":{"full":"Kled.png","sprite":"champion1.png","group":"champion","x":288,"y":96,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Courage","stats":{"hp":340,"hpperlevel":70,"mp":100,"mpperlevel":0,"movespeed":345,"armor":26,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":6,"hpregenperlevel":0.75,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":55,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":3.5}},"KogMaw":{"version":"7.6.1","id":"KogMaw","key":"96","name":"Kog'Maw","title":"the Mouth of the Abyss","blurb":"''If that's just hungry, I don't want to see angry.''<br><br>When the prophet Malzahar was reborn in Icathia, he was led there by an ominous voice which thereafter anchored itself to his psyche. From within, this voice bestowed upon him terrible purpose...","info":{"attack":8,"defense":2,"magic":5,"difficulty":6},"image":{"full":"KogMaw.png","sprite":"champion1.png","group":"champion","x":336,"y":96,"w":48,"h":48},"tags":["Marksman","Mage"],"partype":"Mana","stats":{"hp":517.76,"hpperlevel":82,"mp":322.2,"mpperlevel":40,"movespeed":325,"armor":19.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":5.924,"hpregenperlevel":0.55,"mpregen":8.676,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":57.46,"attackdamageperlevel":2.41,"attackspeedoffset":-0.06,"attackspeedperlevel":2.65}},"Leblanc":{"version":"7.6.1","id":"Leblanc","key":"7","name":"LeBlanc","title":"the Deceiver","blurb":"Every city has its dark side, even one whose reputation is already of a questionable hue. Noxus - though its name is already invoked with a mixture of reverence and revulsion - is no exception to this simple truth. Deep within the winding dungeons that...","info":{"attack":1,"defense":4,"magic":10,"difficulty":9},"image":{"full":"Leblanc.png","sprite":"champion1.png","group":"champion","x":384,"y":96,"w":48,"h":48},"tags":["Assassin","Mage"],"partype":"Mana","stats":{"hp":516,"hpperlevel":80,"mp":334,"mpperlevel":50,"movespeed":340,"armor":21.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":7.4,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":54.88,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":1.4}},"LeeSin":{"version":"7.6.1","id":"LeeSin","key":"64","name":"Lee Sin","title":"the Blind Monk","blurb":"As a young teen, Lee Sin was intent on becoming a summoner. His will and dedication were unmatched by any of his peers, and his skill drew the attention of Reginald Ashram, the League's High Councilor at the time. While studying at the Arcanum Majoris...","info":{"attack":8,"defense":5,"magic":3,"difficulty":6},"image":{"full":"LeeSin.png","sprite":"champion1.png","group":"champion","x":432,"y":96,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Energy","stats":{"hp":570.8,"hpperlevel":85,"mp":200,"mpperlevel":0,"movespeed":350,"armor":24.216,"armorperlevel":3.7,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.426,"hpregenperlevel":0.7,"mpregen":50,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":61.176,"attackdamageperlevel":3.2,"attackspeedoffset":-0.04,"attackspeedperlevel":3}},"Leona":{"version":"7.6.1","id":"Leona","key":"89","name":"Leona","title":"the Radiant Dawn","blurb":"''If you would shine like a sun, first you must burn like one.''<br><br>Imbued with the fire of the sun, Leona is a warrior templar of the Solari who defends Mount Targon with her Zenith Blade and Shield of Daybreak. Her skin shimmers with starfire...","info":{"attack":4,"defense":8,"magic":3,"difficulty":4},"image":{"full":"Leona.png","sprite":"champion2.png","group":"champion","x":0,"y":0,"w":48,"h":48},"tags":["Tank","Support"],"partype":"Mana","stats":{"hp":576.16,"hpperlevel":87,"mp":302.2,"mpperlevel":40,"movespeed":335,"armor":27.208,"armorperlevel":3.6,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.428,"hpregenperlevel":0.85,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":60.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.9}},"Lissandra":{"version":"7.6.1","id":"Lissandra","key":"127","name":"Lissandra","title":"the Ice Witch","blurb":"Lissandra's magic twists the pure power of ice into something dark and terrible. With the force of her black ice, she does more than freeze - she impales and crushes those who oppose her. To the terrified denizens of the north, she is known only as...","info":{"attack":2,"defense":5,"magic":8,"difficulty":6},"image":{"full":"Lissandra.png","sprite":"champion2.png","group":"champion","x":48,"y":0,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":506.12,"hpperlevel":75,"mp":304,"mpperlevel":50,"movespeed":325,"armor":20.216,"armorperlevel":3.7,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.924,"hpregenperlevel":0.55,"mpregen":5.672,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":50.536,"attackdamageperlevel":2.7,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Lucian":{"version":"7.6.1","id":"Lucian","key":"236","name":"Lucian","title":"the Purifier","blurb":"Lucian wields relic weapons imbued with ancient power and stands a stalwart guardian against the undead. His cold conviction never wavers, even in the face of the maddening horrors he destroys beneath his hail of purifying fire. Lucian walks alone on a...","info":{"attack":8,"defense":5,"magic":3,"difficulty":6},"image":{"full":"Lucian.png","sprite":"champion2.png","group":"champion","x":96,"y":0,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":554.4,"hpperlevel":80,"mp":348.88,"mpperlevel":38,"movespeed":335,"armor":24.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":6.192,"hpregenperlevel":0.65,"mpregen":8.176,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":57.46,"attackdamageperlevel":2.41,"attackspeedoffset":-0.02,"attackspeedperlevel":3.3}},"Lulu":{"version":"7.6.1","id":"Lulu","key":"117","name":"Lulu","title":"the Fae Sorceress","blurb":"Perhaps more than any other champion in the League, Lulu marches to the beat of her own drum. During her youth in Bandle City, she spent most of her time wandering alone in the forest or lost in a daydream. It wasn't that she was antisocial; the...","info":{"attack":4,"defense":5,"magic":7,"difficulty":5},"image":{"full":"Lulu.png","sprite":"champion2.png","group":"champion","x":144,"y":0,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":552.76,"hpperlevel":74,"mp":350,"mpperlevel":55,"movespeed":330,"armor":19.216,"armorperlevel":3.7,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.008,"hpregenperlevel":0.6,"mpregen":11,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":46.368,"attackdamageperlevel":2.6,"attackspeedoffset":0,"attackspeedperlevel":2.25}},"Lux":{"version":"7.6.1","id":"Lux","key":"99","name":"Lux","title":"the Lady of Luminosity","blurb":"Born to the prestigious Crownguards, the paragon family of Demacian service, Luxanna was destined for greatness. She grew up as the family's only daughter, and she immediately took to the advanced education and lavish parties required of families as...","info":{"attack":2,"defense":4,"magic":9,"difficulty":5},"image":{"full":"Lux.png","sprite":"champion2.png","group":"champion","x":192,"y":0,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":477.72,"hpperlevel":79,"mp":384,"mpperlevel":47,"movespeed":330,"armor":18.72,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.544,"attackdamageperlevel":3.3,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Malphite":{"version":"7.6.1","id":"Malphite","key":"54","name":"Malphite","title":"Shard of the Monolith","blurb":"There is a world of perfect harmony, where all are part of the whole. The Monolith is the essence of all creation, and its denizens are but singular pieces of it. It is beautiful in its symmetry, and in its almost complete lack of uncertainty. The rocky...","info":{"attack":5,"defense":9,"magic":7,"difficulty":2},"image":{"full":"Malphite.png","sprite":"champion2.png","group":"champion","x":240,"y":0,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":574.2,"hpperlevel":90,"mp":282.2,"mpperlevel":40,"movespeed":335,"armor":28.3,"armorperlevel":3.75,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7,"hpregenperlevel":0.55,"mpregen":7.324,"mpregenperlevel":0.55,"crit":0,"critperlevel":0,"attackdamage":61.97,"attackdamageperlevel":3.375,"attackspeedoffset":-0.02,"attackspeedperlevel":3.4}},"Malzahar":{"version":"7.6.1","id":"Malzahar","key":"90","name":"Malzahar","title":"the Prophet of the Void","blurb":"Many men have gone mad beneath the glare of the Shurima sun, but it was during the night's chilling embrace that Malzahar relinquished his sanity. Malzahar was born a seer, blessed with the gift of prophecy. His talent, though unrefined, promised to be...","info":{"attack":2,"defense":2,"magic":9,"difficulty":6},"image":{"full":"Malzahar.png","sprite":"champion2.png","group":"champion","x":288,"y":0,"w":48,"h":48},"tags":["Mage","Assassin"],"partype":"Mana","stats":{"hp":525,"hpperlevel":75,"mp":300,"mpperlevel":55,"movespeed":335,"armor":20,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":6,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":1.5}},"Maokai":{"version":"7.6.1","id":"Maokai","key":"57","name":"Maokai","title":"the Twisted Treant","blurb":"''All around me are empty husks, soulless and unafraid... but I will bring them fear.''<br><br>Maokai is a rageful, towering treant who fights the unnatural horrors of the Shadow Isles. He was twisted into a force of vengeance after a magical cataclysm...","info":{"attack":3,"defense":8,"magic":6,"difficulty":3},"image":{"full":"Maokai.png","sprite":"champion2.png","group":"champion","x":336,"y":0,"w":48,"h":48},"tags":["Tank","Mage"],"partype":"Mana","stats":{"hp":572.2,"hpperlevel":90,"mp":377.28,"mpperlevel":43,"movespeed":335,"armor":28.72,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7,"hpregenperlevel":0.75,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":63.544,"attackdamageperlevel":3.3,"attackspeedoffset":-0.1,"attackspeedperlevel":2.125}},"MasterYi":{"version":"7.6.1","id":"MasterYi","key":"11","name":"Master Yi","title":"the Wuju Bladesman","blurb":"Through the ancient martial art of Wuju, Master Yi has tempered his body and sharpened his mind until thought and action have become one. Though he chooses to enter into violence as a last resort, the grace and speed with which he wields his blade...","info":{"attack":10,"defense":4,"magic":2,"difficulty":4},"image":{"full":"MasterYi.png","sprite":"champion2.png","group":"champion","x":384,"y":0,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":598.56,"hpperlevel":92,"mp":250.56,"mpperlevel":42,"movespeed":355,"armor":24.04,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.592,"hpregenperlevel":0.65,"mpregen":7.256,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":60.04,"attackdamageperlevel":3,"attackspeedoffset":-0.08,"attackspeedperlevel":2}},"MissFortune":{"version":"7.6.1","id":"MissFortune","key":"21","name":"Miss Fortune","title":"the Bounty Hunter","blurb":"''The bigger the risk, the bigger the bounty.''<br><br>Beauty and danger: There are few who can match Miss Fortune in either. One of Bilgewater's most infamous bounty hunters, she built her legend upon a swathe of bullet-riddled corpses and captured...","info":{"attack":8,"defense":2,"magic":5,"difficulty":1},"image":{"full":"MissFortune.png","sprite":"champion2.png","group":"champion","x":432,"y":0,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":530,"hpperlevel":85,"mp":325.84,"mpperlevel":35,"movespeed":325,"armor":24.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.192,"hpregenperlevel":0.65,"mpregen":8.042,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":46,"attackdamageperlevel":1,"attackspeedoffset":-0.0473,"attackspeedperlevel":3}},"MonkeyKing":{"version":"7.6.1","id":"MonkeyKing","key":"62","name":"Wukong","title":"the Monkey King","blurb":"During the chaos of the Rune Wars, an enormous runestone was lost deep within the Plague Jungles. It remained there, untouched for centuries, emanating a potent magic which infused nearby wildlife with sentience and vitality. A group of monkeys who were...","info":{"attack":8,"defense":5,"magic":2,"difficulty":3},"image":{"full":"MonkeyKing.png","sprite":"champion2.png","group":"champion","x":0,"y":48,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":577.8,"hpperlevel":85,"mp":265.84,"mpperlevel":38,"movespeed":345,"armor":24.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":6.192,"hpregenperlevel":0.65,"mpregen":8.042,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":59.876,"attackdamageperlevel":3.2,"attackspeedoffset":-0.05,"attackspeedperlevel":3}},"Mordekaiser":{"version":"7.6.1","id":"Mordekaiser","key":"82","name":"Mordekaiser","title":"the Iron Revenant","blurb":"''All things must die... and yet I live on.''<br><br>The baleful revenant Mordekaiser is among the most terrifying and hateful spirits haunting the Shadow Isles. He has existed for countless centuries, shielded from true death by necromantic sorcery and...","info":{"attack":4,"defense":6,"magic":7,"difficulty":4},"image":{"full":"Mordekaiser.png","sprite":"champion2.png","group":"champion","x":48,"y":48,"w":48,"h":48},"tags":["Fighter"],"partype":"Shield","stats":{"hp":525,"hpperlevel":73,"mp":0,"mpperlevel":0,"movespeed":325,"armor":20,"armorperlevel":3.75,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":4,"hpregenperlevel":0.3,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":61,"attackdamageperlevel":5,"attackspeedoffset":0.04,"attackspeedperlevel":2.2}},"Morgana":{"version":"7.6.1","id":"Morgana","key":"25","name":"Morgana","title":"Fallen Angel","blurb":"There is a world far away populated by graceful and beautiful winged beings gifted with immortality, where an ancient conflict still rages. Like so many conflicts, this war split families. One side proclaimed themselves as beings of perfect order and...","info":{"attack":1,"defense":6,"magic":8,"difficulty":1},"image":{"full":"Morgana.png","sprite":"champion2.png","group":"champion","x":96,"y":48,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":547.48,"hpperlevel":86,"mp":340.8,"mpperlevel":60,"movespeed":335,"armor":25.384,"armorperlevel":3.8,"spellblock":30,"spellblockperlevel":0,"attackrange":450,"hpregen":5.708,"hpregenperlevel":0.6,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55.46,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":1.53}},"Nami":{"version":"7.6.1","id":"Nami","key":"267","name":"Nami","title":"the Tidecaller","blurb":"Nami channels the primal energies of the ocean, harnessing its mystical restorative properties and commanding the raw power of the tides themselves. Though many doubted her, Nami had the bravery and determination to take on a dangerous quest when no one...","info":{"attack":4,"defense":3,"magic":7,"difficulty":5},"image":{"full":"Nami.png","sprite":"champion2.png","group":"champion","x":144,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":489.32,"hpperlevel":74,"mp":377.24,"mpperlevel":43,"movespeed":335,"armor":19.72,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":11.5,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":51.208,"attackdamageperlevel":3.1,"attackspeedoffset":-0.03,"attackspeedperlevel":2.61}},"Nasus":{"version":"7.6.1","id":"Nasus","key":"75","name":"Nasus","title":"the Curator of the Sands","blurb":"''What was fallen will be great again.''<br><br>Nasus is an imposing, jackal-headed Ascended being from ancient Shurima, a heroic figure regarded as a demigod by the people of the desert. Fiercely intelligent, he was a guardian of knowledge and peerless...","info":{"attack":7,"defense":5,"magic":6,"difficulty":6},"image":{"full":"Nasus.png","sprite":"champion2.png","group":"champion","x":192,"y":48,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":561.2,"hpperlevel":90,"mp":325.6,"mpperlevel":42,"movespeed":350,"armor":24.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":9.012,"hpregenperlevel":0.9,"mpregen":7.44,"mpregenperlevel":0.5,"crit":0,"critperlevel":0,"attackdamage":59.18,"attackdamageperlevel":3.5,"attackspeedoffset":-0.02,"attackspeedperlevel":3.48}},"Nautilus":{"version":"7.6.1","id":"Nautilus","key":"111","name":"Nautilus","title":"the Titan of the Depths","blurb":"Once, Nautilus was a sailor commissioned by the Institute of War to explore the uncharted reaches of the Guardian's Sea. This expedition took him deep into unknown waters where he and his crew found a vast section of black oozing liquid that none of the...","info":{"attack":4,"defense":6,"magic":6,"difficulty":6},"image":{"full":"Nautilus.png","sprite":"champion2.png","group":"champion","x":240,"y":48,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":576.48,"hpperlevel":86,"mp":334,"mpperlevel":47,"movespeed":325,"armor":26.46,"armorperlevel":3.75,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":8.374,"hpregenperlevel":0.55,"mpregen":8.626,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":57.544,"attackdamageperlevel":3.3,"attackspeedoffset":0.02,"attackspeedperlevel":1}},"Nidalee":{"version":"7.6.1","id":"Nidalee","key":"76","name":"Nidalee","title":"the Bestial Huntress","blurb":"There are few dwellers, let alone champions, residing in the blasted and dangerous lands that lie south of the Great Barrier. Much of that world still bears the scars of past Runes Wars, especially the mysterious Kumungu Jungle. There are long-forgotten...","info":{"attack":5,"defense":4,"magic":7,"difficulty":8},"image":{"full":"Nidalee.png","sprite":"champion2.png","group":"champion","x":288,"y":48,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":540,"hpperlevel":80,"mp":295.6,"mpperlevel":45,"movespeed":335,"armor":22.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":6.008,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53,"attackdamageperlevel":3.5,"attackspeedoffset":-0.02,"attackspeedperlevel":3.22}},"Nocturne":{"version":"7.6.1","id":"Nocturne","key":"56","name":"Nocturne","title":"the Eternal Nightmare","blurb":"Before Nocturne, people believed that dreams were figments of their imagination, meaningless images that flashed through the mind when one slept. This belief was put to the test when a rash of sleep-related incidents started afflicting summoners of the...","info":{"attack":9,"defense":5,"magic":2,"difficulty":4},"image":{"full":"Nocturne.png","sprite":"champion2.png","group":"champion","x":336,"y":48,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":582.8,"hpperlevel":85,"mp":273.8,"mpperlevel":35,"movespeed":345,"armor":26.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.26,"hpregenperlevel":0.75,"mpregen":6.756,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":59.208,"attackdamageperlevel":3.1,"attackspeedoffset":-0.065,"attackspeedperlevel":2.7}},"Nunu":{"version":"7.6.1","id":"Nunu","key":"20","name":"Nunu","title":"the Yeti Rider","blurb":"Sometimes bonds of friendship become stronger than even bonds of blood. When those bonds link a fearless boy to a fearsome Yeti, the bond becomes a force to be reckoned with. Given the responsibility of taming a terrifying beast, Nunu forged a...","info":{"attack":4,"defense":6,"magic":7,"difficulty":4},"image":{"full":"Nunu.png","sprite":"champion2.png","group":"champion","x":384,"y":48,"w":48,"h":48},"tags":["Support","Fighter"],"partype":"Mana","stats":{"hp":598.28,"hpperlevel":90,"mp":283.56,"mpperlevel":42,"movespeed":350,"armor":26.38,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.394,"hpregenperlevel":0.8,"mpregen":7.44,"mpregenperlevel":0.5,"crit":0,"critperlevel":0,"attackdamage":59,"attackdamageperlevel":4,"attackspeedoffset":0,"attackspeedperlevel":2.25}},"Olaf":{"version":"7.6.1","id":"Olaf","key":"2","name":"Olaf","title":"the Berserker","blurb":"Most men would say that death is a thing to be feared; none of those men would be Olaf. The Berserker lives only for the roar of a battle cry and the clash of steel. Spurred on by his hunger for glory and the looming curse of a forgettable death, Olaf...","info":{"attack":9,"defense":5,"magic":3,"difficulty":3},"image":{"full":"Olaf.png","sprite":"champion2.png","group":"champion","x":432,"y":48,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":597.24,"hpperlevel":93,"mp":315.6,"mpperlevel":42,"movespeed":350,"armor":26.04,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.512,"hpregenperlevel":0.9,"mpregen":7.466,"mpregenperlevel":0.575,"crit":0,"critperlevel":0,"attackdamage":59.98,"attackdamageperlevel":3.5,"attackspeedoffset":-0.1,"attackspeedperlevel":2.7}},"Orianna":{"version":"7.6.1","id":"Orianna","key":"61","name":"Orianna","title":"the Lady of Clockwork","blurb":"There once was a Piltovian man named Corin Reveck who had a daughter named Orianna, whom he loved more than anything else in the world. Though Orianna had incredible talent for dancing, she was deeply fascinated by the champions of the League of Legends...","info":{"attack":4,"defense":3,"magic":9,"difficulty":7},"image":{"full":"Orianna.png","sprite":"champion2.png","group":"champion","x":0,"y":96,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":517.72,"hpperlevel":79,"mp":334,"mpperlevel":50,"movespeed":325,"armor":17.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":6.874,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":40.368,"attackdamageperlevel":2.6,"attackspeedoffset":-0.05,"attackspeedperlevel":3.5}},"Pantheon":{"version":"7.6.1","id":"Pantheon","key":"80","name":"Pantheon","title":"the Artisan of War","blurb":"''Bring forth one true champion, or a hundred more like you, and then we shall have a battle that will be spoken of until the end of time.''<br><br>The peerless warrior known as Pantheon is a nigh-unstoppable paragon of battle. He was born among the...","info":{"attack":9,"defense":4,"magic":3,"difficulty":4},"image":{"full":"Pantheon.png","sprite":"champion2.png","group":"champion","x":48,"y":96,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":579.16,"hpperlevel":87,"mp":317.12,"mpperlevel":31,"movespeed":355,"armor":27.652,"armorperlevel":3.9,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":150,"hpregen":7.842,"hpregenperlevel":0.65,"mpregen":7.356,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":55.572,"attackdamageperlevel":2.9,"attackspeedoffset":-0.03,"attackspeedperlevel":2.95}},"Poppy":{"version":"7.6.1","id":"Poppy","key":"78","name":"Poppy","title":"Keeper of the Hammer","blurb":"''I'm no hero. Just a yordle with a hammer.''<br><br>Runeterra has no shortage of valiant champions, but few are as tenacious as Poppy. Bearing a hammer twice the length of her body, this determined yordle has spent untold years searching for the ''Hero...","info":{"attack":6,"defense":7,"magic":2,"difficulty":6},"image":{"full":"Poppy.png","sprite":"champion2.png","group":"champion","x":96,"y":96,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":540,"hpperlevel":90,"mp":280,"mpperlevel":40,"movespeed":345,"armor":29,"armorperlevel":3.5,"spellblock":32,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8,"hpregenperlevel":0.8,"mpregen":7,"mpregenperlevel":0.7,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":4,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Quinn":{"version":"7.6.1","id":"Quinn","key":"133","name":"Quinn","title":"Demacia's Wings","blurb":"Quinn and Valor are an elite ranger team. With crossbow and claw, they undertake their nation's most dangerous missions deep within enemy territory, from swift reconnaissance to lethal strikes. The pair's unbreakable bond is deadly on the battlefield...","info":{"attack":9,"defense":4,"magic":2,"difficulty":5},"image":{"full":"Quinn.png","sprite":"champion2.png","group":"champion","x":144,"y":96,"w":48,"h":48},"tags":["Marksman","Fighter"],"partype":"Mana","stats":{"hp":532.8,"hpperlevel":85,"mp":268.8,"mpperlevel":35,"movespeed":335,"armor":23.38,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6.972,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":54.46,"attackdamageperlevel":2.41,"attackspeedoffset":-0.065,"attackspeedperlevel":3.1}},"Rammus":{"version":"7.6.1","id":"Rammus","key":"33","name":"Rammus","title":"the Armordillo","blurb":"''OK.''<br><br>Idolized by many, dismissed by some, mystifying to all, the curious being, Rammus, is an enigma. Protected by a spiked shell, Rammus inspires increasingly disparate theories on his origin wherever he goes - from demigod, to sacred oracle...","info":{"attack":4,"defense":10,"magic":5,"difficulty":5},"image":{"full":"Rammus.png","sprite":"champion2.png","group":"champion","x":192,"y":96,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":564.48,"hpperlevel":86,"mp":310.44,"mpperlevel":33,"movespeed":335,"armor":31.384,"armorperlevel":4.3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.924,"hpregenperlevel":0.55,"mpregen":7.84,"mpregenperlevel":0.5,"crit":0,"critperlevel":0,"attackdamage":55.88,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":2.215}},"RekSai":{"version":"7.6.1","id":"RekSai","key":"421","name":"Rek'Sai","title":"the Void Burrower","blurb":"The largest and fiercest of her species, Rek'Sai is a merciless predator that tunnels through the earth to ambush and devour her prey. Her insatiable hunger has laid waste to entire regions of the once-great Shuriman empire. Merchants, traders and armed...","info":{"attack":8,"defense":5,"magic":2,"difficulty":3},"image":{"full":"RekSai.png","sprite":"champion2.png","group":"champion","x":240,"y":96,"w":48,"h":48},"tags":["Fighter"],"partype":"Fury","stats":{"hp":570,"hpperlevel":90,"mp":100,"mpperlevel":0,"movespeed":335,"armor":24,"armorperlevel":3.4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":7.342,"hpregenperlevel":0.65,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":55.628,"attackdamageperlevel":3.35,"attackspeedoffset":0,"attackspeedperlevel":2}},"Renekton":{"version":"7.6.1","id":"Renekton","key":"58","name":"Renekton","title":"the Butcher of the Sands","blurb":"''Blood and vengeance.''<br><br>Renekton is a terrifying, rage-fueled Ascended being from the scorched deserts of Shurima. Once, he was his empire's most esteemed warrior, leading the armies of Shurima to countless victories. However, after the empire's...","info":{"attack":8,"defense":5,"magic":2,"difficulty":3},"image":{"full":"Renekton.png","sprite":"champion2.png","group":"champion","x":288,"y":96,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Fury","stats":{"hp":572.16,"hpperlevel":87,"mp":100,"mpperlevel":0,"movespeed":345,"armor":25.584,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.96,"hpregenperlevel":0.75,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":58.328,"attackdamageperlevel":3.1,"attackspeedoffset":-0.06,"attackspeedperlevel":2.65}},"Rengar":{"version":"7.6.1","id":"Rengar","key":"107","name":"Rengar","title":"the Pridestalker","blurb":"On every wall of his den, the trophy hunter Rengar mounts the heads, horns, claws, and fangs of the most lethal creatures in Valoran. Though his collection is extensive, he remains unsatisfied, tirelessly seeking greater game. He takes time with every...","info":{"attack":7,"defense":4,"magic":2,"difficulty":8},"image":{"full":"Rengar.png","sprite":"champion2.png","group":"champion","x":336,"y":96,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Ferocity","stats":{"hp":586.2,"hpperlevel":90,"mp":4,"mpperlevel":0,"movespeed":345,"armor":22,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7,"hpregenperlevel":0.5,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":1.5,"attackspeedoffset":0,"attackspeedperlevel":3.5}},"Riven":{"version":"7.6.1","id":"Riven","key":"92","name":"Riven","title":"the Exile","blurb":"''There is a place between war and murder in which our demons lurk.''<br><br>In Noxus, any citizen may rise to power regardless of race, gender, or social standing - strength is all that matters. It was with committed faith in this ideal that Riven...","info":{"attack":8,"defense":5,"magic":1,"difficulty":8},"image":{"full":"Riven.png","sprite":"champion2.png","group":"champion","x":384,"y":96,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"None","stats":{"hp":558.48,"hpperlevel":86,"mp":0,"mpperlevel":0,"movespeed":340,"armor":24.376,"armorperlevel":3.2,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":5.34,"hpregenperlevel":0.5,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":56.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":3.5}},"Rumble":{"version":"7.6.1","id":"Rumble","key":"68","name":"Rumble","title":"the Mechanized Menace","blurb":"''Ugh, it's gonna take forever to scrape your face off my suit!''<br><br>Even amongst yordles, Rumble was always the runt of the litter. As such, he was used to being bullied. In order to survive, he had to be scrappier and more resourceful than his...","info":{"attack":3,"defense":6,"magic":8,"difficulty":10},"image":{"full":"Rumble.png","sprite":"champion2.png","group":"champion","x":432,"y":96,"w":48,"h":48},"tags":["Fighter","Mage"],"partype":"Heat","stats":{"hp":584.4,"hpperlevel":80,"mp":100,"mpperlevel":0,"movespeed":345,"armor":25.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.008,"hpregenperlevel":0.6,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":61.036,"attackdamageperlevel":3.2,"attackspeedoffset":-0.03,"attackspeedperlevel":1.85}},"Ryze":{"version":"7.6.1","id":"Ryze","key":"13","name":"Ryze","title":"the Rune Mage","blurb":"''Take care with this world. What is made can be unmade.''<br><br>Widely considered one of the most adept sorcerers on Runeterra, Ryze is an ancient, hard-bitten archmage with an impossibly heavy burden to bear. Armed with a boundless constitution and a...","info":{"attack":2,"defense":2,"magic":10,"difficulty":7},"image":{"full":"Ryze.png","sprite":"champion3.png","group":"champion","x":0,"y":0,"w":48,"h":48},"tags":["Mage","Fighter"],"partype":"Mana","stats":{"hp":558.48,"hpperlevel":86,"mp":400,"mpperlevel":50,"movespeed":340,"armor":21.552,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":7,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":55.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.112}},"Sejuani":{"version":"7.6.1","id":"Sejuani","key":"113","name":"Sejuani","title":"the Winter's Wrath","blurb":"Sejuani was weaned on hardship and reared on barbarity. Where others succumbed to the harshness of the Freljord, she was tempered by it until pain became power, hunger an encouragement, and frost an ally in culling the weak. Through her ordeals, she...","info":{"attack":5,"defense":7,"magic":6,"difficulty":4},"image":{"full":"Sejuani.png","sprite":"champion3.png","group":"champion","x":48,"y":0,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":600,"hpperlevel":95,"mp":400,"mpperlevel":40,"movespeed":340,"armor":29.54,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.678,"hpregenperlevel":0.85,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":57.544,"attackdamageperlevel":3.3,"attackspeedoffset":-0.0672,"attackspeedperlevel":1.44}},"Shaco":{"version":"7.6.1","id":"Shaco","key":"35","name":"Shaco","title":"the Demon Jester","blurb":"Most would say that death isn't funny. It isn't, unless you're Shaco - then it's hysterical. He is Valoran's first fully functioning homicidal comic; he jests until someone dies, and then he laughs. The figure that has come to be known as the Demon...","info":{"attack":8,"defense":4,"magic":6,"difficulty":9},"image":{"full":"Shaco.png","sprite":"champion3.png","group":"champion","x":96,"y":0,"w":48,"h":48},"tags":["Assassin"],"partype":"Mana","stats":{"hp":582.12,"hpperlevel":84,"mp":297.2,"mpperlevel":40,"movespeed":350,"armor":24.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.374,"hpregenperlevel":0.55,"mpregen":7.156,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":57.58,"attackdamageperlevel":3.5,"attackspeedoffset":-0.1,"attackspeedperlevel":3}},"Shen":{"version":"7.6.1","id":"Shen","key":"98","name":"Shen","title":"the Eye of Twilight","blurb":"''The Eye is blind to fear, to hate, to love - to all things that would sway equilibrium.''<br><br>Leader of a secret clan of mystic warriors, Shen serves as the Eye of Twilight, entrusted to enforce equilibrium in the world. Longing to remain free from...","info":{"attack":3,"defense":9,"magic":3,"difficulty":4},"image":{"full":"Shen.png","sprite":"champion3.png","group":"champion","x":144,"y":0,"w":48,"h":48},"tags":["Tank,melee"],"partype":"Energy","stats":{"hp":540,"hpperlevel":85,"mp":400,"mpperlevel":0,"movespeed":340,"armor":25,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.5,"hpregenperlevel":0.75,"mpregen":50,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2}},"Shyvana":{"version":"7.6.1","id":"Shyvana","key":"102","name":"Shyvana","title":"the Half-Dragon","blurb":"A half-breed born from the union between dragon and human, Shyvana searched all her life for belonging. Persecution forged her into a brutal warrior, and those who dare stand against Shyvana face the fiery beast lurking just beneath her skin...","info":{"attack":8,"defense":6,"magic":3,"difficulty":4},"image":{"full":"Shyvana.png","sprite":"champion3.png","group":"champion","x":192,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Fury","stats":{"hp":595,"hpperlevel":95,"mp":100,"mpperlevel":0,"movespeed":350,"armor":27.628,"armorperlevel":3.35,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.6,"hpregenperlevel":0.8,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":60.712,"attackdamageperlevel":3.4,"attackspeedoffset":-0.05,"attackspeedperlevel":2.5}},"Singed":{"version":"7.6.1","id":"Singed","key":"27","name":"Singed","title":"the Mad Chemist","blurb":"Singed descended from a long line of Zaun's revered chemists. Even in his youth, his talent for concocting potions far outstripped that of his peers, and he quickly distinguished himself from his less extraordinary chemist compatriots. It came as no...","info":{"attack":4,"defense":8,"magic":7,"difficulty":5},"image":{"full":"Singed.png","sprite":"champion3.png","group":"champion","x":240,"y":0,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":542.76,"hpperlevel":82,"mp":290.6,"mpperlevel":45,"movespeed":345,"armor":27.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.024,"hpregenperlevel":0.55,"mpregen":7.524,"mpregenperlevel":0.55,"crit":0,"critperlevel":0,"attackdamage":62.32,"attackdamageperlevel":3.375,"attackspeedoffset":0.02,"attackspeedperlevel":1.81}},"Sion":{"version":"7.6.1","id":"Sion","key":"14","name":"Sion","title":"The Undead Juggernaut","blurb":"BLOOD.<br><br>SMELL IT.<br><br>WANT. ACHING. NEED!<br><br>CLOSE NOW. THEY COME.<br><br>NO CHAINS? FREE! KILL!<br><br>IN REACH. YES! DIE! DIE!<br><br>Gone. Too quick. No fight. More. I want... more.<br><br>A voice? Unfamiliar. I see him. The Grand...","info":{"attack":5,"defense":9,"magic":3,"difficulty":5},"image":{"full":"Sion.png","sprite":"champion3.png","group":"champion","x":288,"y":0,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"Mana","stats":{"hp":542.64,"hpperlevel":73,"mp":325.6,"mpperlevel":42,"movespeed":345,"armor":23.04,"armorperlevel":3,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":10.18,"hpregenperlevel":0.8,"mpregen":8.008,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":59.72,"attackdamageperlevel":4,"attackspeedoffset":-0.08,"attackspeedperlevel":1.3}},"Sivir":{"version":"7.6.1","id":"Sivir","key":"15","name":"Sivir","title":"the Battle Mistress","blurb":"''I don't care what face is on your coin, as long as it pays.''<br><br>Sivir is a renowned fortune hunter and mercenary captain who plies her trade in the deserts of Shurima. Armed with her legendary jeweled crossblade, she has fought and won countless...","info":{"attack":9,"defense":3,"magic":1,"difficulty":4},"image":{"full":"Sivir.png","sprite":"champion3.png","group":"champion","x":336,"y":0,"w":48,"h":48},"tags":["Marksman"],"partype":"Mana","stats":{"hp":515.76,"hpperlevel":82,"mp":284,"mpperlevel":50,"movespeed":335,"armor":22.21,"armorperlevel":3.25,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":5.174,"hpregenperlevel":0.55,"mpregen":8.012,"mpregenperlevel":0.9,"crit":0,"critperlevel":0,"attackdamage":57.46,"attackdamageperlevel":2.41,"attackspeedoffset":0,"attackspeedperlevel":1.6}},"Skarner":{"version":"7.6.1","id":"Skarner","key":"72","name":"Skarner","title":"the Crystal Vanguard","blurb":"''We are one. We cannot be shattered.''<br><br>Skarner is an immense crystalline scorpion from a hidden valley in Shurima. Part of the ancient Brackern race, Skarner and his kin are known for their great wisdom and deep connection to the land, as their...","info":{"attack":7,"defense":6,"magic":5,"difficulty":5},"image":{"full":"Skarner.png","sprite":"champion3.png","group":"champion","x":384,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":601.28,"hpperlevel":90,"mp":272.2,"mpperlevel":40,"movespeed":335,"armor":29.384,"armorperlevel":3.8,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.928,"hpregenperlevel":0.85,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":57.156,"attackdamageperlevel":4.5,"attackspeedoffset":0,"attackspeedperlevel":2.1}},"Sona":{"version":"7.6.1","id":"Sona","key":"37","name":"Sona","title":"Maven of the Strings","blurb":"Sona has no memories of her true parents. As an infant, she was found abandoned on the doorstep of an Ionian adoption house, nestled atop an ancient instrument in an exquisite case of unknown origins. She was an unusually well-behaved child, always...","info":{"attack":5,"defense":2,"magic":8,"difficulty":4},"image":{"full":"Sona.png","sprite":"champion3.png","group":"champion","x":432,"y":0,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":482.36,"hpperlevel":77,"mp":340.6,"mpperlevel":45,"movespeed":325,"armor":20.544,"armorperlevel":3.3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":11.5,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":50.04,"attackdamageperlevel":3,"attackspeedoffset":-0.03,"attackspeedperlevel":2.3}},"Soraka":{"version":"7.6.1","id":"Soraka","key":"16","name":"Soraka","title":"the Starchild","blurb":"A healer gifted with the magic of the stars, Soraka holds all living creatures close to her heart. She was once a celestial being, but she sacrificed her immortality and entered the world of mortals. So long as evil threatens life in Valoran, Soraka...","info":{"attack":2,"defense":5,"magic":7,"difficulty":3},"image":{"full":"Soraka.png","sprite":"champion3.png","group":"champion","x":0,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":529.04,"hpperlevel":78,"mp":350.8,"mpperlevel":60,"movespeed":325,"armor":23.384,"armorperlevel":3.8,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":2.5,"hpregenperlevel":0.5,"mpregen":11.5,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":50.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.14}},"Swain":{"version":"7.6.1","id":"Swain","key":"50","name":"Swain","title":"the Master Tactician","blurb":"The earliest account of Swain's existence comes from a Noxian infirmary doctor's notes. According to them, Swain limped into the ward without cry or complaint; his right leg was snapped in half, with bone protruding from the skin. A small, scowling bird...","info":{"attack":2,"defense":6,"magic":9,"difficulty":8},"image":{"full":"Swain.png","sprite":"champion3.png","group":"champion","x":48,"y":48,"w":48,"h":48},"tags":["Mage","Fighter"],"partype":"Mana","stats":{"hp":516.04,"hpperlevel":90,"mp":374,"mpperlevel":47,"movespeed":335,"armor":22.72,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":7.842,"hpregenperlevel":0.65,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":52.04,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.11}},"Syndra":{"version":"7.6.1","id":"Syndra","key":"134","name":"Syndra","title":"the Dark Sovereign","blurb":"Born with immense magical potential, Syndra loves nothing more than exercising the incredible power at her command. With each passing day, her mastery of magical force grows more potent and devastating. Refusing any notion of balance or restraint...","info":{"attack":2,"defense":3,"magic":9,"difficulty":8},"image":{"full":"Syndra.png","sprite":"champion3.png","group":"champion","x":96,"y":48,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":511.04,"hpperlevel":78,"mp":384,"mpperlevel":60,"movespeed":330,"armor":24.712,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.508,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.872,"attackdamageperlevel":2.9,"attackspeedoffset":0,"attackspeedperlevel":2}},"TahmKench":{"version":"7.6.1","id":"TahmKench","key":"223","name":"Tahm Kench","title":"the River King","blurb":"''The whole world's a river, and I'm its king.''<br>Tahm Kench travels Runeterra's waterways, feeding his insatiable appetite with the misery of the unsuspecting. The singularly charming gourmand savors every moment of his victims' suffering.  A deal...","info":{"attack":3,"defense":9,"magic":6,"difficulty":5},"image":{"full":"TahmKench.png","sprite":"champion3.png","group":"champion","x":144,"y":48,"w":48,"h":48},"tags":["Support","Tank"],"partype":"Mana","stats":{"hp":610,"hpperlevel":95,"mp":325,"mpperlevel":40,"movespeed":335,"armor":27,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":6.5,"hpregenperlevel":0.55,"mpregen":8,"mpregenperlevel":1,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":3.2,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Taliyah":{"version":"7.6.1","id":"Taliyah","key":"163","name":"Taliyah","title":"the Stoneweaver","blurb":"Taliyah is a nomadic mage from Shurima who weaves stone with energetic enthusiasm and raw determination. Torn between teenage wonder and adult responsibility, she has crossed nearly all of Valoran on a journey to learn the true nature of her growing...","info":{"attack":1,"defense":7,"magic":8,"difficulty":5},"image":{"full":"Taliyah.png","sprite":"champion3.png","group":"champion","x":192,"y":48,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":520,"hpperlevel":75,"mp":340,"mpperlevel":60,"movespeed":325,"armor":20,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":7,"hpregenperlevel":0.7,"mpregen":7,"mpregenperlevel":0.85,"crit":0,"critperlevel":0,"attackdamage":56,"attackdamageperlevel":3.3,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Talon":{"version":"7.6.1","id":"Talon","key":"91","name":"Talon","title":"the Blade's Shadow","blurb":"''The three deadliest blademasters in all of Valoran are bound to the house of Du Couteau: my father, myself, and Talon. Challenge us, if you dare.''<br>-- Katarina Du Couteau<br><br>Talon's earliest memories are the darkness of Noxus' underground...","info":{"attack":9,"defense":3,"magic":1,"difficulty":7},"image":{"full":"Talon.png","sprite":"champion3.png","group":"champion","x":240,"y":48,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Mana","stats":{"hp":583,"hpperlevel":90,"mp":377.2,"mpperlevel":37,"movespeed":335,"armor":26.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.51,"hpregenperlevel":0.75,"mpregen":7.6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":60,"attackdamageperlevel":3.1,"attackspeedoffset":-0.065,"attackspeedperlevel":2.9}},"Taric":{"version":"7.6.1","id":"Taric","key":"44","name":"Taric","title":"the Shield of Valoran","blurb":"''The best weapons are beautiful.''<br><br>Taric is the Aspect of the Protector, wielding incredible power as Runeterra's guardian of life, love, and beauty. Shamed by a dereliction of duty and exiled from his homeland Demacia, Taric ascended Mount...","info":{"attack":4,"defense":8,"magic":5,"difficulty":3},"image":{"full":"Taric.png","sprite":"champion3.png","group":"champion","x":288,"y":48,"w":48,"h":48},"tags":["Support","Fighter"],"partype":"Mana","stats":{"hp":575,"hpperlevel":90,"mp":300,"mpperlevel":60,"movespeed":340,"armor":25,"armorperlevel":3.4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":150,"hpregen":6,"hpregenperlevel":0.5,"mpregen":5,"mpregenperlevel":1,"crit":0,"critperlevel":0,"attackdamage":55,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":2}},"Teemo":{"version":"7.6.1","id":"Teemo","key":"17","name":"Teemo","title":"the Swift Scout","blurb":"Teemo is a legend among his yordle brothers and sisters in Bandle City. As far as yordles are concerned, there is something just slightly off about him. While Teemo enjoys the companionship of other yordles, he also insists on frequent solo missions in...","info":{"attack":5,"defense":3,"magic":7,"difficulty":6},"image":{"full":"Teemo.png","sprite":"champion3.png","group":"champion","x":336,"y":48,"w":48,"h":48},"tags":["Marksman","Assassin"],"partype":"Mana","stats":{"hp":515.76,"hpperlevel":82,"mp":267.2,"mpperlevel":40,"movespeed":330,"armor":24.3,"armorperlevel":3.75,"spellblock":30,"spellblockperlevel":0,"attackrange":500,"hpregen":5.742,"hpregenperlevel":0.65,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":49.54,"attackdamageperlevel":3,"attackspeedoffset":-0.0947,"attackspeedperlevel":3.38}},"Thresh":{"version":"7.6.1","id":"Thresh","key":"412","name":"Thresh","title":"the Chain Warden","blurb":"''The mind is a wondrous thing to tear apart.''<br><br>Sadistic and cunning, Thresh is a restless spirit who prides himself on tormenting mortals and breaking them with slow, excruciating inventiveness. His victims suffer far beyond the point of death...","info":{"attack":5,"defense":6,"magic":6,"difficulty":7},"image":{"full":"Thresh.png","sprite":"champion3.png","group":"champion","x":384,"y":48,"w":48,"h":48},"tags":["Support","Fighter"],"partype":"Mana","stats":{"hp":560.52,"hpperlevel":93,"mp":273.92,"mpperlevel":44,"movespeed":335,"armor":16,"armorperlevel":0,"spellblock":30,"spellblockperlevel":0,"attackrange":450,"hpregen":6.924,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":47.696,"attackdamageperlevel":2.2,"attackspeedoffset":0,"attackspeedperlevel":3.5}},"Tristana":{"version":"7.6.1","id":"Tristana","key":"18","name":"Tristana","title":"the Yordle Gunner","blurb":"Greatness comes in all shapes and sizes, as proven by this diminutive, cannon-wielding yordle. In a world fraught with turmoil, Tristana refuses to back down from any challenge. She represents the pinnacle of martial proficiency, unwavering courage, and...","info":{"attack":9,"defense":3,"magic":5,"difficulty":4},"image":{"full":"Tristana.png","sprite":"champion3.png","group":"champion","x":432,"y":48,"w":48,"h":48},"tags":["Marksman","Assassin"],"partype":"Mana","stats":{"hp":542.76,"hpperlevel":82,"mp":246.76,"mpperlevel":32,"movespeed":325,"armor":22,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.192,"hpregenperlevel":0.65,"mpregen":7.206,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":56.96,"attackdamageperlevel":2.41,"attackspeedoffset":-0.0473,"attackspeedperlevel":1.5}},"Trundle":{"version":"7.6.1","id":"Trundle","key":"48","name":"Trundle","title":"the Troll King","blurb":"Trundle is a hulking and devious troll with a mischievous streak. There is nothing he can't beat into submission and bend to his will, not even the ice itself. With his massive, frozen club, he chills his enemies to the core and runs them through with...","info":{"attack":7,"defense":6,"magic":2,"difficulty":5},"image":{"full":"Trundle.png","sprite":"champion3.png","group":"champion","x":0,"y":96,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":616.28,"hpperlevel":96,"mp":281.6,"mpperlevel":45,"movespeed":350,"armor":27.536,"armorperlevel":2.7,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":6,"hpregenperlevel":0.75,"mpregen":7.508,"mpregenperlevel":0.6,"crit":0,"critperlevel":0,"attackdamage":60.04,"attackdamageperlevel":3,"attackspeedoffset":-0.0672,"attackspeedperlevel":2.9}},"Tryndamere":{"version":"7.6.1","id":"Tryndamere","key":"23","name":"Tryndamere","title":"the Barbarian King","blurb":"Fueled by his unbridled fury and rage, Tryndamere cuts his way through the tundra, mastering the art of battle by challenging the Freljord's greatest warriors. The wrathful barbarian seeks revenge on the one who decimated his clan and strikes down all...","info":{"attack":10,"defense":5,"magic":2,"difficulty":5},"image":{"full":"Tryndamere.png","sprite":"champion3.png","group":"champion","x":48,"y":96,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Fury","stats":{"hp":625.64,"hpperlevel":98,"mp":100,"mpperlevel":0,"movespeed":345,"armor":24.108,"armorperlevel":3.1,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.512,"hpregenperlevel":0.9,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":61.376,"attackdamageperlevel":3.2,"attackspeedoffset":-0.0672,"attackspeedperlevel":2.9}},"TwistedFate":{"version":"7.6.1","id":"TwistedFate","key":"4","name":"Twisted Fate","title":"the Card Master","blurb":"Twisted Fate is an infamous card sharp and swindler who has gambled and charmed his way across much of the known world, earning the enmity and admiration of the rich and foolish alike. He rarely takes things seriously, greeting each day with a mocking...","info":{"attack":6,"defense":2,"magic":6,"difficulty":9},"image":{"full":"TwistedFate.png","sprite":"champion3.png","group":"champion","x":96,"y":96,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":521.76,"hpperlevel":82,"mp":265.84,"mpperlevel":38,"movespeed":330,"armor":20.542,"armorperlevel":3.15,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.508,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":49.954,"attackdamageperlevel":3.3,"attackspeedoffset":-0.04,"attackspeedperlevel":3.22}},"Twitch":{"version":"7.6.1","id":"Twitch","key":"29","name":"Twitch","title":"the Plague Rat","blurb":"H.I.V.E. Incident Report<br>Code Violation: Industrial Homicide<br>Casefile Status: Unsolved<br>Investigating Agent: Rol, P.<br><br>Team responded to report of suspicious character, criminal activity; proceeded to Sump Works, Sector 90TZ. Sector 90TZ...","info":{"attack":9,"defense":2,"magic":3,"difficulty":6},"image":{"full":"Twitch.png","sprite":"champion3.png","group":"champion","x":144,"y":96,"w":48,"h":48},"tags":["Marksman","Assassin"],"partype":"Mana","stats":{"hp":525.08,"hpperlevel":81,"mp":287.2,"mpperlevel":40,"movespeed":330,"armor":23.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.008,"hpregenperlevel":0.6,"mpregen":7.256,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":55.46,"attackdamageperlevel":2.41,"attackspeedoffset":-0.08,"attackspeedperlevel":3.38}},"Udyr":{"version":"7.6.1","id":"Udyr","key":"77","name":"Udyr","title":"the Spirit Walker","blurb":"Udyr is more than a man; he is a vessel for the untamed power of four primal animal spirits. When tapping into the spirits' bestial natures, Udyr can harness their unique strengths: the tiger grants him speed and ferocity, the turtle resilience, the...","info":{"attack":8,"defense":7,"magic":4,"difficulty":7},"image":{"full":"Udyr.png","sprite":"champion3.png","group":"champion","x":192,"y":96,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":593.32,"hpperlevel":99,"mp":270.4,"mpperlevel":30,"movespeed":345,"armor":25.47,"armorperlevel":4,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":6,"hpregenperlevel":0.75,"mpregen":7.506,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":58.286,"attackdamageperlevel":3.2,"attackspeedoffset":-0.05,"attackspeedperlevel":2.67}},"Urgot":{"version":"7.6.1","id":"Urgot","key":"6","name":"Urgot","title":"the Headsman's Pride","blurb":"There are warriors who become great for their strength, cunning, or skill with arms. Others simply refuse to die. Urgot, once a great soldier of Noxus, may constitute a case in support of the latter. Prone to diving headlong into enemy battle lines...","info":{"attack":8,"defense":5,"magic":3,"difficulty":8},"image":{"full":"Urgot.png","sprite":"champion3.png","group":"champion","x":240,"y":96,"w":48,"h":48},"tags":["Marksman","Fighter"],"partype":"Mana","stats":{"hp":586.52,"hpperlevel":89,"mp":312.4,"mpperlevel":55,"movespeed":335,"armor":24.544,"armorperlevel":3.3,"spellblock":30,"spellblockperlevel":0,"attackrange":425,"hpregen":6.508,"hpregenperlevel":0.6,"mpregen":8.592,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":54.05,"attackdamageperlevel":3.6,"attackspeedoffset":-0.03,"attackspeedperlevel":2.9}},"Varus":{"version":"7.6.1","id":"Varus","key":"110","name":"Varus","title":"the Arrow of Retribution","blurb":"''The life of an arrow is fleeting, built of nothing but direction and intent.''<br><br>For his incomparable skill with the bow and his unquestioned sense of honor, Varus was chosen to be the warden of a sacred Ionian temple. The temple was built to...","info":{"attack":7,"defense":3,"magic":4,"difficulty":2},"image":{"full":"Varus.png","sprite":"champion3.png","group":"champion","x":288,"y":96,"w":48,"h":48},"tags":["Marksman","Mage"],"partype":"Mana","stats":{"hp":537.76,"hpperlevel":82,"mp":360.48,"mpperlevel":33,"movespeed":330,"armor":23.212,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":575,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":7.34,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":54.66,"attackdamageperlevel":2.41,"attackspeedoffset":-0.05,"attackspeedperlevel":3}},"Vayne":{"version":"7.6.1","id":"Vayne","key":"67","name":"Vayne","title":"the Night Hunter","blurb":"The world is not always as civilized as people might think. There are still those who would follow the blackest paths of magic and become corrupted by the darker powers that flow through Runeterra. Shauna Vayne knows this fact well.<br><br>As a young...","info":{"attack":10,"defense":1,"magic":1,"difficulty":8},"image":{"full":"Vayne.png","sprite":"champion3.png","group":"champion","x":336,"y":96,"w":48,"h":48},"tags":["Marksman","Assassin"],"partype":"Mana","stats":{"hp":498.44,"hpperlevel":83,"mp":231.8,"mpperlevel":35,"movespeed":330,"armor":19.012,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6.972,"mpregenperlevel":0.4,"crit":0,"critperlevel":0,"attackdamage":55.88,"attackdamageperlevel":1.66,"attackspeedoffset":-0.05,"attackspeedperlevel":4}},"Veigar":{"version":"7.6.1","id":"Veigar","key":"45","name":"Veigar","title":"the Tiny Master of Evil","blurb":"To most, thoughts of yordles do not conjure images to be feared. The easygoing half-pint race, though fierce, is often regarded with some degree of joviality. Their high-pitched voices and naturally cute forms inspire something of a protective instinct...","info":{"attack":2,"defense":2,"magic":10,"difficulty":7},"image":{"full":"Veigar.png","sprite":"champion3.png","group":"champion","x":384,"y":96,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":492.76,"hpperlevel":82,"mp":392.4,"mpperlevel":52,"movespeed":340,"armor":22.55,"armorperlevel":3.75,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":50.71,"attackdamageperlevel":2.625,"attackspeedoffset":0,"attackspeedperlevel":2.24}},"Velkoz":{"version":"7.6.1","id":"Velkoz","key":"161","name":"Vel'Koz","title":"the Eye of the Void","blurb":"I pass into the sudden glare. Blink. Blink, blink, blink. My eyes adjust and evaluate the landscape before me.<br><br>There's a scurrying. I look down to find a small, white creature standing on its hind legs, sniffing at my body. It intrigues me...","info":{"attack":2,"defense":2,"magic":10,"difficulty":8},"image":{"full":"Velkoz.png","sprite":"champion3.png","group":"champion","x":432,"y":96,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":507.68,"hpperlevel":76,"mp":375.6,"mpperlevel":42,"movespeed":340,"armor":21.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":54.9379,"attackdamageperlevel":3.1416,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"Vi":{"version":"7.6.1","id":"Vi","key":"254","name":"Vi","title":"the Piltover Enforcer","blurb":"To Vi, every problem is just another brick wall to punch through with her gigantic hextech gauntlets. Though she grew up on the wrong side of the law, Vi now uses her criminal know-how to serve Piltover's police force. Vi's brash attitude, abrasive...","info":{"attack":8,"defense":5,"magic":3,"difficulty":4},"image":{"full":"Vi.png","sprite":"champion4.png","group":"champion","x":0,"y":0,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":582.8,"hpperlevel":85,"mp":295.6,"mpperlevel":45,"movespeed":340,"armor":25.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":9.012,"hpregenperlevel":0.9,"mpregen":8.092,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":55.88,"attackdamageperlevel":3.5,"attackspeedoffset":0,"attackspeedperlevel":2.5}},"Viktor":{"version":"7.6.1","id":"Viktor","key":"112","name":"Viktor","title":"the Machine Herald","blurb":"Early in life, Viktor discovered his passion for science and invention, particularly in the field of mechanical automation. He attended Zaun's prestigious College of Techmaturgy and led the team that constructed Blitzcrank - a scientific breakthrough...","info":{"attack":2,"defense":4,"magic":10,"difficulty":9},"image":{"full":"Viktor.png","sprite":"champion4.png","group":"champion","x":48,"y":0,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":516.04,"hpperlevel":78,"mp":324,"mpperlevel":50,"movespeed":335,"armor":22.72,"armorperlevel":4,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":7.842,"hpregenperlevel":0.65,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":52.04,"attackdamageperlevel":3,"attackspeedoffset":-0.05,"attackspeedperlevel":2.11}},"Vladimir":{"version":"7.6.1","id":"Vladimir","key":"8","name":"Vladimir","title":"the Crimson Reaper","blurb":"There is a temple hidden in the mountains between Noxus and the Tempest Flats, where the secrets of an ancient and terrifying sorcery are kept. The area surrounding the temple is littered with the exsanguinated corpses of those who have mistakenly...","info":{"attack":2,"defense":6,"magic":8,"difficulty":7},"image":{"full":"Vladimir.png","sprite":"champion4.png","group":"champion","x":96,"y":0,"w":48,"h":48},"tags":["Mage","Tank"],"partype":"Crimson Rush","stats":{"hp":525,"hpperlevel":84,"mp":2,"mpperlevel":0,"movespeed":330,"armor":23,"armorperlevel":3.3,"spellblock":30,"spellblockperlevel":0,"attackrange":450,"hpregen":7.008,"hpregenperlevel":0.6,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":55,"attackdamageperlevel":3,"attackspeedoffset":-0.05,"attackspeedperlevel":2}},"Volibear":{"version":"7.6.1","id":"Volibear","key":"106","name":"Volibear","title":"the Thunder's Roar","blurb":"The unforgiving northern reaches of the Freljord are home to the Ursine, a fierce and warlike race that has endured the barren tundra for thousands of years. Their leader is a furious adversary who commands the force of lightning to strike fear within...","info":{"attack":7,"defense":7,"magic":4,"difficulty":3},"image":{"full":"Volibear.png","sprite":"champion4.png","group":"champion","x":144,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":584.48,"hpperlevel":86,"mp":270.4,"mpperlevel":30,"movespeed":345,"armor":26.38,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":8.092,"hpregenperlevel":0.65,"mpregen":8.092,"mpregenperlevel":0.65,"crit":0,"critperlevel":0,"attackdamage":59.544,"attackdamageperlevel":3.3,"attackspeedoffset":-0.05,"attackspeedperlevel":2.67}},"Warwick":{"version":"7.6.1","id":"Warwick","key":"19","name":"Warwick","title":"the Uncaged Wrath of Zaun","blurb":"Warwick is a monster who hunts the gray alleys of Zaun. Transformed by agonizing experiments, his body is fused with an intricate system of chambers and pumps, machinery filling his veins with alchemical rage. Bursting out of the shadows, he preys upon...","info":{"attack":9,"defense":5,"magic":3,"difficulty":3},"image":{"full":"Warwick.png","sprite":"champion4.png","group":"champion","x":192,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":550,"hpperlevel":85,"mp":280,"mpperlevel":35,"movespeed":335,"armor":24.04,"armorperlevel":3.2,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":3.75,"hpregenperlevel":0.75,"mpregen":7.466,"mpregenperlevel":0.575,"crit":0,"critperlevel":0,"attackdamage":58,"attackdamageperlevel":3,"attackspeedoffset":-0.02,"attackspeedperlevel":2.3}},"Xerath":{"version":"7.6.1","id":"Xerath","key":"101","name":"Xerath","title":"the Magus Ascendant","blurb":"''A lifetime as a slave has prepared me for eternity as your master.''<br><br>Xerath is an Ascended Magus of ancient Shurima, a being of arcane energy writhing in the broken shards of a magical sarcophagus. For millennia, he was trapped beneath the...","info":{"attack":1,"defense":3,"magic":10,"difficulty":8},"image":{"full":"Xerath.png","sprite":"champion4.png","group":"champion","x":240,"y":0,"w":48,"h":48},"tags":["Mage","Assassin"],"partype":"Mana","stats":{"hp":514.4,"hpperlevel":80,"mp":366.96,"mpperlevel":44,"movespeed":340,"armor":21.88,"armorperlevel":3.5,"spellblock":30,"spellblockperlevel":0,"attackrange":525,"hpregen":5.424,"hpregenperlevel":0.55,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":54.7,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":1.36}},"XinZhao":{"version":"7.6.1","id":"XinZhao","key":"5","name":"Xin Zhao","title":"the Seneschal of Demacia","blurb":"''Death is inevitable, one can only avoid defeat.''<br><br>Whenever Jarvan III, the king of Demacia, delivers one of his rallying speeches from the glinting marble balcony atop the Royal Palace, Xin Zhao is at his side. Coined the Seneschal of Demacia...","info":{"attack":8,"defense":6,"magic":3,"difficulty":2},"image":{"full":"XinZhao.png","sprite":"champion4.png","group":"champion","x":288,"y":0,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Mana","stats":{"hp":600,"hpperlevel":92,"mp":273.8,"mpperlevel":35,"movespeed":345,"armor":25.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":8.176,"hpregenperlevel":0.7,"mpregen":7.256,"mpregenperlevel":0.45,"crit":0,"critperlevel":0,"attackdamage":57.544,"attackdamageperlevel":3.3,"attackspeedoffset":0,"attackspeedperlevel":2.6}},"Yasuo":{"version":"7.6.1","id":"Yasuo","key":"157","name":"Yasuo","title":"the Unforgiven","blurb":"Yasuo is a man of resolve, an agile swordsman who wields the wind itself to cut down his foes. This once-proud warrior has been disgraced by a false accusation and forced into a desperate fight for survival. With the world turned against him, he will do...","info":{"attack":8,"defense":4,"magic":4,"difficulty":10},"image":{"full":"Yasuo.png","sprite":"champion4.png","group":"champion","x":336,"y":0,"w":48,"h":48},"tags":["Fighter","Assassin"],"partype":"Flow","stats":{"hp":517.76,"hpperlevel":82,"mp":100,"mpperlevel":0,"movespeed":345,"armor":24.712,"armorperlevel":3.4,"spellblock":30,"spellblockperlevel":0,"attackrange":175,"hpregen":6.512,"hpregenperlevel":0.9,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":55.376,"attackdamageperlevel":3.2,"attackspeedoffset":-0.067,"attackspeedperlevel":2.5}},"Yorick":{"version":"7.6.1","id":"Yorick","key":"83","name":"Yorick","title":"Shepherd of Souls","blurb":"''These isles… How they scream.''<br>The last survivor of a long-forgotten religious order, Yorick is both blessed and cursed with power over the dead. Trapped on the Shadow Isles, his only companions are the rotting corpses and shrieking spirits that...","info":{"attack":6,"defense":6,"magic":4,"difficulty":6},"image":{"full":"Yorick.png","sprite":"champion4.png","group":"champion","x":384,"y":0,"w":48,"h":48},"tags":["Fighter","Tank"],"partype":"Mana","stats":{"hp":580,"hpperlevel":100,"mp":300,"mpperlevel":40,"movespeed":340,"armor":30,"armorperlevel":4,"spellblock":32,"spellblockperlevel":1.25,"attackrange":175,"hpregen":8,"hpregenperlevel":0.8,"mpregen":7.5,"mpregenperlevel":0.75,"crit":0,"critperlevel":0,"attackdamage":57,"attackdamageperlevel":5,"attackspeedoffset":0,"attackspeedperlevel":2}},"Zac":{"version":"7.6.1","id":"Zac","key":"154","name":"Zac","title":"the Secret Weapon","blurb":"Zac is the product of a Zaun experiment to manufacture a hexchem-engineered supersoldier - the Zaun Amorphous Combatant. Combining brute strength with limitless flexibility, he is a versatile juggernaut: a creative fighter who bounces over obstacles and...","info":{"attack":3,"defense":7,"magic":7,"difficulty":8},"image":{"full":"Zac.png","sprite":"champion4.png","group":"champion","x":432,"y":0,"w":48,"h":48},"tags":["Tank","Fighter"],"partype":"None","stats":{"hp":614.6,"hpperlevel":95,"mp":0,"mpperlevel":0,"movespeed":340,"armor":23.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":175,"hpregen":7.924,"hpregenperlevel":0.55,"mpregen":0,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":59.67,"attackdamageperlevel":3.375,"attackspeedoffset":-0.02,"attackspeedperlevel":1.6}},"Zed":{"version":"7.6.1","id":"Zed","key":"238","name":"Zed","title":"the Master of Shadows","blurb":"Zed is the first ninja in 200 years to unlock the ancient, forbidden ways. He defied his clan and master, casting off the balance and discipline that had shackled him all his life. Zed now offers power to those who embrace knowledge of the shadows, and...","info":{"attack":9,"defense":2,"magic":1,"difficulty":7},"image":{"full":"Zed.png","sprite":"champion4.png","group":"champion","x":0,"y":48,"w":48,"h":48},"tags":["Assassin","Fighter"],"partype":"Energy","stats":{"hp":579.4,"hpperlevel":80,"mp":200,"mpperlevel":0,"movespeed":345,"armor":26.88,"armorperlevel":3.5,"spellblock":32.1,"spellblockperlevel":1.25,"attackrange":125,"hpregen":7.092,"hpregenperlevel":0.65,"mpregen":50,"mpregenperlevel":0,"crit":0,"critperlevel":0,"attackdamage":54.712,"attackdamageperlevel":3.4,"attackspeedoffset":-0.03,"attackspeedperlevel":2.1}},"Ziggs":{"version":"7.6.1","id":"Ziggs","key":"115","name":"Ziggs","title":"the Hexplosives Expert","blurb":"Ziggs was born with a talent for tinkering, but his chaotic, hyperactive nature was unusual among yordle scientists. Aspiring to be a revered inventor like Heimerdinger, he rattled through ambitious projects with manic zeal, emboldened by both his...","info":{"attack":2,"defense":4,"magic":9,"difficulty":4},"image":{"full":"Ziggs.png","sprite":"champion4.png","group":"champion","x":48,"y":48,"w":48,"h":48},"tags":["Mage"],"partype":"Mana","stats":{"hp":524.4,"hpperlevel":80,"mp":384,"mpperlevel":47,"movespeed":325,"armor":21.544,"armorperlevel":3.3,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":6.258,"hpregenperlevel":0.6,"mpregen":6,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":54.208,"attackdamageperlevel":3.1,"attackspeedoffset":-0.0473,"attackspeedperlevel":2}},"Zilean":{"version":"7.6.1","id":"Zilean","key":"26","name":"Zilean","title":"the Chronokeeper","blurb":"In the wastelands of Urtistan, there was once a great city. It perished long ago in a terrible Rune War, like most of the lands below the Great Barrier. Nevertheless, one man survived: a sorcerer named Zilean. Being obsessed with time, it was only...","info":{"attack":2,"defense":5,"magic":8,"difficulty":6},"image":{"full":"Zilean.png","sprite":"champion4.png","group":"champion","x":96,"y":48,"w":48,"h":48},"tags":["Support","Mage"],"partype":"Mana","stats":{"hp":499.28,"hpperlevel":77,"mp":360.8,"mpperlevel":60,"movespeed":335,"armor":19.134,"armorperlevel":3.8,"spellblock":30,"spellblockperlevel":0,"attackrange":550,"hpregen":5.44,"hpregenperlevel":0.5,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":51.64,"attackdamageperlevel":3,"attackspeedoffset":0,"attackspeedperlevel":2.13}},"Zyra":{"version":"7.6.1","id":"Zyra","key":"143","name":"Zyra","title":"Rise of the Thorns","blurb":"Longing to take control of her fate, the ancient, dying plant Zyra transferred her consciousness into a human body for a second chance at life. Centuries ago, she and her kind dominated the Kumungu Jungle, using thorns and vines to consume any animal...","info":{"attack":4,"defense":3,"magic":8,"difficulty":7},"image":{"full":"Zyra.png","sprite":"champion4.png","group":"champion","x":144,"y":48,"w":48,"h":48},"tags":["Mage","Support"],"partype":"Mana","stats":{"hp":499.32,"hpperlevel":74,"mp":334,"mpperlevel":50,"movespeed":340,"armor":20.04,"armorperlevel":3,"spellblock":30,"spellblockperlevel":0,"attackrange":575,"hpregen":5.69,"hpregenperlevel":0.5,"mpregen":8.5,"mpregenperlevel":0.8,"crit":0,"critperlevel":0,"attackdamage":53.376,"attackdamageperlevel":3.2,"attackspeedoffset":0,"attackspeedperlevel":2.11}}}};

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

exports.default = /*@ngInject*/function ($scope) {
    _lodash2.default.extend(this, {
        reset: function reset() {
            $scope.$broadcast('champion.clicked', null);
        }
    });

    _lodash2.default.extend($scope, {
        champions: _champions2.default.data
    });

    if (_general2.default.LOAD_LIVE_DATA) {
        _champions2.default.loadLiveData().then(function (data) {
            return $scope.champions = data;
        }).then(function (data) {
            return console.log('Data loaded from live', data);
        }).then(function (data) {
            return $scope.$apply();
        });
    }
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _general = require('config/general');

var _general2 = _interopRequireDefault(_general);

var _champions = require('services/champions');

var _champions2 = _interopRequireDefault(_champions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"config/general":2,"lodash":"lodash","services/champions":24}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'champions/components/app/template.html',
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

exports.default = _angular2.default.module('champions.components.app', []).directive('suChampionsApp', _directive2.default);

},{"./directive":8,"angular":"angular"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope) {
    _lodash2.default.extend(this, {
        select: function select(champion) {
            $scope.$emit('champion.clicked', champion);
            _analytics2.default.trackEvent({
                category: _analytics.EventCategories.CHAMPION,
                action: _analytics.EventActions.CLICK,
                value: champion.id
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

},{"lodash":"lodash","services/analytics":23}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            champion: '='
        },
        templateUrl: 'champions/components/card/template.html',
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

exports.default = _angular2.default.module('champions.components.card', []).directive('suChampionsCard', _directive2.default);

},{"./directive":11,"angular":"angular"}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope) {
    var _this = this;

    _lodash2.default.extend(this, {
        select: function select(champion) {
            if ($scope.currentChampion != champion) {
                $rootScope.$broadcast('champion.updated', champion);
            }
            $scope.currentChampion = champion;
        }
    });

    $scope.$on('champion.clicked', function ($event, champion) {
        _this.select(champion);
    });

    $scope.currentChampion = null;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"lodash":"lodash"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            champions: '='
        },
        templateUrl: 'champions/components/grid/template.html',
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

exports.default = _angular2.default.module('champions.components.grid', []).directive('suChampionsGrid', _directive2.default);

},{"./directive":14,"angular":"angular"}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('champions.components', [require('./card').default.name, require('./grid').default.name, require('./app').default.name]);

},{"./app":9,"./card":12,"./grid":15,"angular":"angular"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (champion) {
        var image = _ddragon2.default.imageURL(_globals2.default.version, 'sprite/' + champion.image.sprite);

        return {
            backgroundImage: 'url(' + image + ')',
            backgroundPosition: '-' + champion.image.x + 'px -' + champion.image.y + 'px'
        };
    };
};

var _ddragon = require('services/ddragon');

var _ddragon2 = _interopRequireDefault(_ddragon);

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"services/ddragon":25,"services/globals":26}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('champions.filters', []).filter('championIcon', require('./champion-icon').default).filter('stats', require('./stats').default).filter('statIcon', require('./stat-icon').default).filter('statRange', require('./stat-range').default);

},{"./champion-icon":17,"./stat-icon":19,"./stat-range":20,"./stats":21,"angular":"angular"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (stat) {
        return stat && stat.image ? {
            'background-image': 'url(/images/stats/sprite.png)',
            'background-position': '-' + stat.image.x + 'px -' + stat.image.y + 'px'
        } : {};
    };
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function (decimalFilter) {
    return function (stat) {
        if (!stat) return '';

        var lvl1 = decimalFilter(_champions2.default.calculateStat(stat, stat.values, 1), stat.decimals);
        var lvl18 = decimalFilter(_champions2.default.calculateStat(stat, stat.values, 18), stat.decimals);

        return stat.values.growth ? lvl1 + ' - ' + lvl18 : '' + lvl1;
    };
};

var _fnjs = require('fnjs');

var _fnjs2 = _interopRequireDefault(_fnjs);

var _champions = require('services/champions');

var _champions2 = _interopRequireDefault(_champions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"fnjs":1,"services/champions":24}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (champion) {
        if (!champion.stats) {
            console.error('nochampstats', champion);
        }

        return _fnjs2.default.map(PreviewStats, function (previewStat) {
            var stat = null;

            if (Array.isArray(previewStat)) {
                stat = previewStat.map(function (stat) {
                    return champion.stats[stat.id];
                }).filter(function (stat) {
                    return !!stat;
                })[0];
            } else {
                stat = champion.stats[previewStat.id];
            }

            return stat;
        });
    };
};

var _fnjs = require('fnjs');

var _fnjs2 = _interopRequireDefault(_fnjs);

var _modifiers = require('services/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PreviewStats = {
    HEALTH: _modifiers.Stats.HEALTH_POOL,

    RESOURCE: [_modifiers.Stats.MANA_POOL, _modifiers.Stats.ENERGY_POOL, _modifiers.Stats.BLOODWELL],

    HEALTH_REGEN: _modifiers.Stats.HEALTH_REGEN,

    RESOURCE_REGEN: [_modifiers.Stats.MANA_REGEN, _modifiers.Stats.ENERGY_REGEN],

    ARMOR: _modifiers.Stats.ARMOR,

    MAGIC_RESIST: _modifiers.Stats.MAGIC_RESIST,

    ATTACK_DAMAGE: _modifiers.Stats.ATTACK_DAMAGE,

    ATTACK_SPEED: _modifiers.Stats.ATTACK_SPEED,

    ATTACK_RANGE: _modifiers.Stats.ATTACK_RANGE,

    MOVE_SPEED: _modifiers.Stats.MOVE_SPEED
};

},{"fnjs":1,"services/modifiers":27}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularRaven = require('angular-raven');

var _angularRaven2 = _interopRequireDefault(_angularRaven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('champions', ['ngRaven', 'champions.templates', 'common', require('./filters').default.name, require('./components').default.name]);

},{"./components":16,"./filters":18,"angular":"angular","angular-raven":"angular-raven"}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _champions = require('data/7.6.1/champions');

var _champions2 = _interopRequireDefault(_champions);

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

var _ddragon = require('services/ddragon');

var _ddragon2 = _interopRequireDefault(_ddragon);

var _modifiers = require('services/modifiers');

var _champions3 = require('transformers/champions');

var _champions4 = _interopRequireDefault(_champions3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: (0, _champions4.default)(_champions2.default),

    loadLiveData: function loadLiveData() {
        var _this = this;

        return _ddragon2.default.fetchData(_globals2.default.version, _ddragon.DataTargets.CHAMPIONS).then(function (rawdata) {
            return (0, _champions4.default)(rawdata);
        }).then(function (data) {
            return _this.data = data;
        });
    },
    calculateAttackSpeed: function calculateAttackSpeed(offset) {
        return 0.625 / (1 + offset);
    },
    calculateStat: function calculateStat(stat, _ref, level) {
        var base = _ref.base;
        var growth = _ref.growth;

        if (!growth) return base;
        var value = base + growth * (level - 1) * (0.685 + 0.0175 * level);
        return stat.id == _modifiers.Stats.ATTACK_SPEED.id ? this.calculateAttackSpeed(base) * (1 + value / 100) : value;
    }
};

},{"data/7.6.1/champions":3,"services/ddragon":25,"services/globals":26,"services/modifiers":27,"transformers/champions":28}],25:[function(require,module,exports){
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

},{"lib/http":4,"lib/strings":6,"services/globals":26}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    version: '7.6.1'
};

exports.default = config;

},{}],27:[function(require,module,exports){
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

},{"lib/objects":5}],28:[function(require,module,exports){
'use strict';

var _mp, _mpperlevel, _mpregen, _mpregenperlevel;

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fnjs = require('fnjs');

var _fnjs2 = _interopRequireDefault(_fnjs);

var _objects = require('lib/objects');

var _modifiers = require('services/modifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResourceMappings = {
    'MP': _modifiers.Resources.MANA,
    'Mana': _modifiers.Resources.MANA,
    'Energy': _modifiers.Resources.ENERGY,
    'BloodWell': _modifiers.Resources.BLOODWELL,
    'Rage': _modifiers.Resources.RAGE
};

var ResourceStats = ['mp', 'mpperlevel', 'mpregen', 'mpregenperlevel'];

var ChampionStatMods = {
    'hp': _modifiers.Mods.FLAT_HP_POOL,
    'hpperlevel': _modifiers.Mods.SCALING_HP_POOL,
    'mp': (_mp = {}, _defineProperty(_mp, _modifiers.Resources.MANA, _modifiers.Mods.FLAT_MP_POOL), _defineProperty(_mp, _modifiers.Resources.ENERGY, _modifiers.Mods.FLAT_ENERGY_POOL), _defineProperty(_mp, _modifiers.Resources.BLOODWELL, _modifiers.Mods.FLAT_BLOODWELL), _mp),
    'mpperlevel': (_mpperlevel = {}, _defineProperty(_mpperlevel, _modifiers.Resources.MANA, _modifiers.Mods.SCALING_MP_POOL), _defineProperty(_mpperlevel, _modifiers.Resources.ENERGY, _modifiers.Mods.SCALING_ENERGY_POOL), _defineProperty(_mpperlevel, _modifiers.Resources.BLOODWELL, _modifiers.Mods.SCALING_BLOODWELL), _mpperlevel),
    'movespeed': _modifiers.Mods.FLAT_MOVE_SPEED,
    'armor': _modifiers.Mods.FLAT_ARMOR,
    'armorperlevel': _modifiers.Mods.SCALING_ARMOR,
    'spellblock': _modifiers.Mods.FLAT_MR,
    'spellblockperlevel': _modifiers.Mods.SCALING_MR,
    'attackrange': _modifiers.Mods.FLAT_ATTACK_RANGE,
    'hpregen': _modifiers.Mods.FLAT_HP_REGEN,
    'hpregenperlevel': _modifiers.Mods.SCALING_HP_REGEN,
    'mpregen': (_mpregen = {}, _defineProperty(_mpregen, _modifiers.Resources.MANA, _modifiers.Mods.FLAT_MP_REGEN), _defineProperty(_mpregen, _modifiers.Resources.ENERGY, _modifiers.Mods.FLAT_ENERGY_REGEN), _mpregen),
    'mpregenperlevel': (_mpregenperlevel = {}, _defineProperty(_mpregenperlevel, _modifiers.Resources.MANA, _modifiers.Mods.SCALING_MP_REGEN), _defineProperty(_mpregenperlevel, _modifiers.Resources.ENERGY, _modifiers.Mods.SCALING_ENERGY_REGEN), _mpregenperlevel),
    'crit': _modifiers.Mods.FLAT_CRIT_CHANCE,
    'critperlevel': _modifiers.Mods.SCALING_CRIT_CHANCE,
    'attackdamage': _modifiers.Mods.FLAT_ATTACK_DAMAGE,
    'attackdamageperlevel': _modifiers.Mods.SCALING_ATTACK_DAMAGE,
    'attackspeedoffset': _modifiers.Mods.FLAT_ATTACK_SPEED,
    'attackspeedperlevel': _modifiers.Mods.SCALING_ATTACK_SPEED
};

function transform(rawChampions) {
    var champions = _fnjs2.default.map(rawChampions.data, function (champion, id) {
        var resource = ResourceMappings[champion.partype];

        return {
            id: id,
            resource: resource,
            name: champion.name,
            stats: _fnjs2.default.chain(champion.stats).map(function (value, stat) {
                var mod = ChampionStatMods[stat];

                if (ResourceStats.indexOf(stat) > -1) {
                    mod = mod[resource];
                }

                return mod ? (0, _objects.mix)(mod, { value: value }) : null;
            }).filter(function (mod) {
                return !!mod;
            }).reduce(function (stats, mod) {
                var id = mod.stat.id;

                if (!stats[id]) {
                    stats[id] = (0, _objects.mix)({ values: {} }, mod.stat);
                }

                var key = mod.scaling ? 'growth' : 'base';

                stats[id].values[key] = mod.value;

                return stats;
            }, {}).value(),
            image: {
                sprite: champion.image.sprite,
                x: champion.image.x,
                y: champion.image.y
            }
        };
    });

    return _fnjs2.default.sort(champions, function (a, b) {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
}

exports.default = transform;

},{"fnjs":1,"lib/objects":5,"services/modifiers":27}]},{},[22])

//# sourceMappingURL=champions.js.map
