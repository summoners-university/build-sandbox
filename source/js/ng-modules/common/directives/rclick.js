export const name = 'suRclick';

export default /*@ngInject*/ function($parse) {
    return (scope, element, attr) => {
        element.bind('contextmenu', ($event) => {
            $event.preventDefault();
            let fn = $parse(attr[name]);

            scope.$apply(() => {
                fn(scope, { $event });
            });

            return false;
        });
    }
}