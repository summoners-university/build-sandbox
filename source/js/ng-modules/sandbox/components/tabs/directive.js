import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'sandbox/components/tabs/template.html',
        controller,
        bindToController: {},
        controllerAs: 'ctrl'
    }
};