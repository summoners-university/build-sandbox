import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            stat: '='
        },
        templateUrl: 'stats/components/stat/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};