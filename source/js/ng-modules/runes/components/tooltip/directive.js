import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            rune: '='
        },
        templateUrl: 'runes/components/tooltip/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};