import angular from 'angular';

export default angular.module('stats.filters', [])
    .filter('stat', require('./stat').default)
    .filter('statIcon', require('./stat-icon').default)
    .filter('statValue', require('./stat-value').default)
    .filter('gridStats', require('./grid-stats').default)
