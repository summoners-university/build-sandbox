import controller from './controller';

export default function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'runes/components/app/template.html',
        controller
    }
};