import angular from 'angular';

export default angular.module('masteries.components', [
    require('./tooltip').default.name,
    require('./talent').default.name,
    require('./tree').default.name,
    require('./app').default.name
])