import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            talent: '=',
            tree: '='
        },
        templateUrl: 'masteries/components/talent/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};