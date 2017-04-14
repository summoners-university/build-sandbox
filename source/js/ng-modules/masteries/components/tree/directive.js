import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tree: '='
        },
        templateUrl: 'masteries/components/tree/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};