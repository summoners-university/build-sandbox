import raw from 'data/7.6.1/runes';
import globals from 'services/globals';
import ddragon, { DataTargets } from 'services/ddragon';
import transform from 'transformers/runes';

const Types = {
    MARK: "Mark",
    SEAL: "Seal",
    GLYPH: "Glyph",
    QUINT: "Quintessence"
};

const Coords = {
    [Types.MARK]: [
        [24,370],
        [86,370],
        [158,371],
        [8,312],
        [70,311],
        [125,323],
        [29,254],
        [76,222],
        [113,264]
    ],
    [Types.SEAL]: [
        [39,186],
        [66,138],
        [107,179],
        [119,112],
        [154,70],
        [204,43],
        [265,24],
        [343,5],
        [371,55]
    ],
    [Types.GLYPH]: [
        [401,4],
        [463,8],
        [550,6],
        [431,53],
        [507,40],
        [599,40],
        [482,87],
        [555,79],
        [576,133]
    ],
    [Types.QUINT]: [
        [26,35],
        [182,224],
        [413,159]
    ]
};

export { Types, Coords };
export default {
    data: transform(raw),

    loadLiveData() {
        return ddragon.fetchData(globals.version, DataTargets.RUNES)
            .then(rawdata => transform(rawdata))
            .then(data => this.data = data)
    }
};