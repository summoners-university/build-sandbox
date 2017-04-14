export default /*@ngInject*/ function () {
    return (length) => Array.apply(null, { length }).map(Number.call, Number);
}