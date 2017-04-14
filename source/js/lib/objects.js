import fn from 'fnjs';

function extend(src, ...objects) {
    for(let i in objects) {
        if(!objects.hasOwnProperty(i)) continue;
        let obj = objects[i];
        for(let key in obj) {
            if(!obj.hasOwnProperty(key)) continue;
            if(obj[key] && typeof obj[key] == 'object' && obj[key].constructor == Object) {
                src[key] = mix({}, obj[key]);
            } else {
                src[key] = obj[key];
            }
        }
    }
    return src;
}

function mix(src, ...objects) {
    let copy = extend({}, src);
    return extend(copy, ...objects);
}

function assignIDs(object) {
    let id = 0;

    fn.forEach(object, (entry) => {
        entry.id = id++;
    });

    return object;
}

function assignKeys(object) {
    fn.forEach(object, (entry, key) => {
        entry.id = key;
    });

    return object;
}

export { extend, mix, assignIDs, assignKeys }