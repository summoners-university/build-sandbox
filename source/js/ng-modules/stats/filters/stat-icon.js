export default /*@ngInject*/ function () {
    return (stat) => {
        return stat && stat.image ? {
            'background-image': 'url(/images/stats/sprite.png)',
            'background-position': `-${stat.image.x}px -${stat.image.y}px`
        } : {};
    }
}