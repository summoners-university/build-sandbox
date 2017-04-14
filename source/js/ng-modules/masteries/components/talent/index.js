import angular from 'angular';
import directive from './directive';

export default angular.module('masteries.components.talent', [
    require('./filters').default.name
])
    .directive('suMasteriesTalent', directive)