import angular from 'angular';
import directive from './directive';

export default angular.module('stats.components.mod-list', [])
    .directive('suStatsModList', directive)