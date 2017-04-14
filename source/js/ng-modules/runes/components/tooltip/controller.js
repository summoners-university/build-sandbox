export default /*@ngInject*/ function($scope) {
    $scope.style = {};

    $scope.$on('tooltip.show', ($event, bounds) => {
        $scope.active = true;
        $scope.style = {
            top: bounds.top - 5 - window.scrollY + 'px',
            left: bounds.right + 5 - window.scrollY + 'px'
        };
    });

    $scope.$on('tooltip.hide', () => {
        $scope.active = false;
    });
};