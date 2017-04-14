import { Coords } from 'services/runes';

export default /* @ngInject */ function() {
    return (rune, index) => {
        let coords = Coords[rune.type][index];
        return {
            left: `${coords[0]}px`,
            top: `${coords[1]}px`
        };
    }
};