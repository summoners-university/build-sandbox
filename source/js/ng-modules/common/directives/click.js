export const name = 'suClick';

export default /*@ngInject*/ function($parse) {
    return (scope, element, attr) => {
        element.click($event => {
            $event.preventDefault();
            let fn = $parse(attr['ngeClick']);

            scope.$apply(() => {
                fn(scope, { $event });
            });

            return false;
        });
    }
}