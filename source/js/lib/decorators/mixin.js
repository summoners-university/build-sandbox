import _ from 'lodash';

/**
 * Decorator that mixes any number of mixins together into the target.
 *
 * @param {...*} mixins The mixins
 * @returns {Function}
 */
export default function mixin(...mixins) {
    return function(target) {
        let a = _.assign(target.prototype, ...mixins);
        return a.prototype;
    }
}