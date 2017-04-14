import angular from 'angular';
import directive from './directive';

export default angular.module('items.components.app', [])
    .directive('suItemsApp', directive)