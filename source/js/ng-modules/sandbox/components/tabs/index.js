import angular from 'angular';
import directive from './directive';

export default angular.module('sandbox.components.tabs', [])
    .directive('suSandboxTabs', directive)