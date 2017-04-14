import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'stats/components/stat-grid/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};