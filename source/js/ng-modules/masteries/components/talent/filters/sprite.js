import ddragon from 'services/ddragon';
import masteries from 'services/masteries';

export default /*@ngInject*/ function () {
    return (talent) => {
        let image = ddragon.imageURL(masteries.data.version, `sprite/${talent.image.sprite}`);

        return {
            backgroundImage: `url(${image})`,
            backgroundPosition: `-${talent.image.x}px -${talent.image.y}px`
        }
    };
}