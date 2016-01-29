import _ from 'lodash';
import raw from './raw';

export function runecount(runelist) {
    return runelist.reduce((count, rune) => count + rune.count, 0);
}

export function addrune(runelist, rune) {
    let matches = runelist.filter(r => r.id == rune.id);
    let isInList = matches.length < 1;

    if(isInList) {
        let r = _.clone(rune);
        r.count = 1;
        runelist = runelist.concat(r);
    } else {
        runelist
            .filter(r => r.id == rune.id)
            .forEach(r => r.count++);
    }

    return runelist;
};

export default raw
    .slice(0)
    .map(rune => {
        rune.type = rune.name.indexOf('Quintessence') > -1 ? 'quint'
            : rune.name.indexOf('Glyph') > -1 ? 'glyph'
            : rune.name.indexOf('Seal') > -1 ? 'seal'
            : rune.name.indexOf('Mark') > -1 ? 'mark'
            : null;
        return rune;
    })
    .map(rune => {
        rune.effect = {

        };
        return rune;
    })
    .map(rune => {
        rune.count = rune.name.indexOf('Quintessence') > -1 ? 3 : 9;
        return rune;
    });