export default /*@ngInject*/ function () {
    return (input, places) => {
        if (isNaN(input)) return input;
        let factor = '1' + Array(+(places > 0 && places + 1)).join('0');
        return Math.round(input * factor) / factor;
    };
}