import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            champion: '='
        },
        templateUrl: 'champions/components/card/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};