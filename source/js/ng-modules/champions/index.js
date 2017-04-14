import angular from 'angular';
import ngRaven from 'angular-raven';

export default angular.module('champions', [
    'ngRaven',
    'champions.templates',
    'common',
    require('./filters').default.name,
    require('./components').default.name
])
