import angular from 'angular';

export default angular.module('champions.filters', [])
    .filter('championIcon', require('./champion-icon').default)
    .filter('stats', require('./stats').default)
    .filter('statIcon', require('./stat-icon').default)
    .filter('statRange', require('./stat-range').default)