import angular from 'angular';

export default angular.module('stats.components', [
    require('./stat').default.name,
    require('./stat-grid').default.name,
    require('./mod-list').default.name,
    require('./app').default.name
])