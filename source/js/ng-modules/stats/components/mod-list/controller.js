export default /*@ngInject*/ function($scope) {
    $scope.$on('mods.updated', ($event, modsmap) => {
        this.mods = modsmap;
    });
};