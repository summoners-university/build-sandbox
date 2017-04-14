import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            champions: '='
        },
        templateUrl: 'champions/components/grid/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};