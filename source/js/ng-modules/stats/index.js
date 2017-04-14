import angular from 'angular';
import ngRaven from 'angular-raven';

export default angular.module('stats', [
    'ngRaven',
    'stats.templates',
    'common',
    require('./filters').default.name,
    require('./components').default.name
])
