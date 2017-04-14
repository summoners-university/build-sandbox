export default /* @ngInject */ function($sce) {
    return (value, type) => $sce.trustAs(type || 'html', value);
};