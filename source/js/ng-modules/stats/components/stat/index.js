import angular from 'angular';
import directive from './directive';

export default angular.module('stats.components.stat', [])
    .directive('suStatsStat', directive)