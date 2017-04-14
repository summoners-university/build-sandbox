import angular from 'angular';

export default angular.module('common.filters', [])
    .filter('decimal', require('./decimal').default)
    .filter('sanitize', require('./sanitize').default)
    .filter('range', require('./range').default)