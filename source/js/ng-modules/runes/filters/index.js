import angular from 'angular';

export default angular.module('runes.filters', [])
    .filter('brief', require('./brief').default)
    .filter('runestyle', require('./runestyle').default)