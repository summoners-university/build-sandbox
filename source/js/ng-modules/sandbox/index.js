import angular from 'angular';
import ngRaven from 'angular-raven';

export default angular.module('sandbox', [
    'ngRaven',
    'sandbox.templates',
    'common',
    'champions',
    'masteries',
    'runes',
    'stats',
    require('./components').default.name
])
    .constant('hash', window.location.hash.replace(/#/g, ''))
