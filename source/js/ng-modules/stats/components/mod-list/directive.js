import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'stats/components/mod-list/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};