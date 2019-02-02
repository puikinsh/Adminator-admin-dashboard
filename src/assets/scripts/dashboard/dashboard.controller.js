/** @ngInject */
const DashboardController = ($scope) => {
    $scope.$on('loadUserSuccess', function(user) {
        $scope.user = user;

        // tutte le funzioni del controller
        
    }); 
}

export default DashboardController;