import angular from 'angular';
import ngRaven from 'angular-raven';

export default angular.module('masteries', [
    'ngRaven',
    'common',
    'masteries.templates',
    require('./components').default.name
])