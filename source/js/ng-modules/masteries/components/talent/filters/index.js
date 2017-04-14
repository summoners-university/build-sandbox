import angular from 'angular';

export default angular.module('masteries.components.talent.filters', [])
    .filter('style', require('./style').default)
    .filter('sprite', require('./sprite').default)
    .filter('classname', require('./classname').default)