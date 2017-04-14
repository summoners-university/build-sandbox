import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            talent: '='
        },
        templateUrl: 'masteries/components/tooltip/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};