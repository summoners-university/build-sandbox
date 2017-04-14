import masteries from 'services/masteries';

const Dimens = {
    Y_MARGIN: 25,
    X_MARGIN: 60,
    X_MARGIN_KEYSTONE: 87,

    Y_DIST: 80,
    X_DIST: 120,
    X_DIST_KEYSTONE: 66
};

function coords(talent, talents) {
    let keystone = talent.tier % 2 != 0;
    let tripleRow = talents.filter(t => t.tier == talent.tier).length == 3;

    let xIndex = masteries.tierIndex(talent, talents);
    let yIndex = talent.tier;

    let xDist = keystone ? Dimens.X_DIST_KEYSTONE : Dimens.X_DIST;
    let xMargin = keystone ? Dimens.X_MARGIN_KEYSTONE : Dimens.X_MARGIN;

    let x = xIndex * xDist + xMargin - (tripleRow ? 33 : 0);
    let y = yIndex * Dimens.Y_DIST + Dimens.Y_MARGIN;

    return { x, y };
}

export default /*@ngInject*/ function () {
    return (talent, tree) => {
        let p = coords(talent, tree.talents);

        return {
            left: `${p.x}px`,
            top: `${p.y}px`
        }
    };
}