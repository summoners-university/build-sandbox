import angular from 'angular';
import directive from './directive';

export default angular.module('stats.components.app', [])
    .directive('suStatsApp', directive)