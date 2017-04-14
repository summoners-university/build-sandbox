import masteries from 'services/masteries';

export default /*@ngInject*/ function () {
    return (talent, tree) => {
        return talent.points == talent.ranks ? 'complete'
            : talent.points > 0 ? 'partial'
            : masteries.available(talent, tree) ? 'available'
            : 'unavailable';
    };
}