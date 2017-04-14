import ddragon from 'services/ddragon';
import globals from 'services/globals';

export default /*@ngInject*/ function () {
    return (champion) => {
        let image = ddragon.imageURL(globals.version, `sprite/${champion.image.sprite}`);

        return {
            backgroundImage: `url(${image})`,
            backgroundPosition: `-${champion.image.x}px -${champion.image.y}px`
        };
    }
}