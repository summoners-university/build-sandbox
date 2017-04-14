import angular from 'angular';
import directive from './directive';

export default angular.module('runes.components.list-rune', [])
    .directive('suRunesListRune', directive)