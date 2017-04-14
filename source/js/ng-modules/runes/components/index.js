import angular from 'angular';

export default angular.module('runes.components', [
    require('./tooltip').default.name,
    require('./list-rune').default.name,
    require('./list').default.name,
    require('./page').default.name,
    require('./app').default.name
])