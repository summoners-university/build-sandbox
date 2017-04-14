import angular from 'angular';
import directive from './directive';

export default angular.module('sandbox.components.app', [])
    .directive('suSandboxApp', directive)