import angular from 'angular';

export default angular.module('champions.components', [
    require('./card').default.name,
    require('./grid').default.name,
    require('./app').default.name
])