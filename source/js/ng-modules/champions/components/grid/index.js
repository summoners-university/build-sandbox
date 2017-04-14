import angular from 'angular';
import directive from './directive';

export default angular.module('champions.components.grid', [])
    .directive('suChampionsGrid', directive)