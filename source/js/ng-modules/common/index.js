import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import ngRaven from 'angular-raven';

export default angular.module('common', [
    'ngRaven',
    //'common.templates',
    'ngSanitize',
    require('./filters').default.name,
    require('./directives').default.name
])