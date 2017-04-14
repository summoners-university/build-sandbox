import angular from 'angular';
import directive from './directive';

export default angular.module('champions.components.card', [])
    .directive('suChampionsCard', directive)