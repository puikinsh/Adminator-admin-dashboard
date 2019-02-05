/** @ngInject */
const DashboardController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function(event, user) {
        $scope.user = user;
        
        // tutte le funzioni del controller
        
    }); 
    UserService.loadUser();
}

export default DashboardController;