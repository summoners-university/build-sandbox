import angular from 'angular';
import directive from './directive';

export default angular.module('masteries.components.app', [])
    .directive('suMasteriesApp', directive)