import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'items/components/app/template.html',
        controller
    }
};