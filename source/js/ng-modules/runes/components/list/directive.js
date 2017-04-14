import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'runes/components/list/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};