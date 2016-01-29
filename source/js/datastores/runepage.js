import runes, { runecount, addrune } from 'lib/runes';
import EventHub from 'lib/utils/event-hub';

const EventNames = {
    DATA_UPDATED: 'data.updated',
    FILTERS_UPDATED: 'filters.updated'
};

class RuneDataStore extends EventHub {
    data = {
        runes: runes,
        marks: [],
        seals: [],
        glyphs: [],
        quints: []
    };
    
    constructor(...args) {
        super(...args);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.on(EventNames.FILTERS_UPDATED, this.filter.bind(this));
    }

    add(rune) {
        let key = rune.type + 's';
        let targetRuneList = this.data[key];

        if(rune.count < 1 || runecount(targetRuneList) >= 9) return;
        rune.count--;

        this.data[key] = addrune(this.data[key], rune);

        this.trigger(EventNames.DATA_UPDATED, {
            runes: this.data.runes,
            [key]: this.data[key]
        });
    }

    remove(rune) {
        if(rune.count < 1) return;
        rune.count--;

        let key = rune.type + 's';
        let src = this.data[key];

        this.data[key] = src.filter(r => r.count > 0);
        this.data.runes = addrune(this.data.runes, rune);

        this.trigger(EventNames.DATA_UPDATED, {
            [key]: this.data[key],
            runes: this.data.runes
        });
    }

    filter(filter) {
        let filtered = this.data.runes
            .filter(rune => filter.type ? rune.type == filter.type : true);

        this.trigger(EventNames.DATA_UPDATED, {
            runes: filtered
        })
    }
}

let datastore = new RuneDataStore();

export { EventNames };
export default datastore;