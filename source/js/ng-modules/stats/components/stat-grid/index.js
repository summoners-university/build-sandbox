import angular from 'angular';
import directive from './directive';

export default angular.module('stats.components.stat-grid', [])
    .directive('suStatsStatGrid', directive)