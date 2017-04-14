import angular from 'angular';

export default angular.module('sandbox.components', [
    require('./tabs').default.name,
    require('./app').default.name
])