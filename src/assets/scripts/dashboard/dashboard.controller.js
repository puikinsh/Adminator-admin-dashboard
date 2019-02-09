import masonry from "../masonry";

/** @ngInject */
const DashboardController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function(event, user) {
        $scope.user = user;
        window.dispatchEvent(window.EVENT);
    }); 
        
    // tutte le funzioni del controller
    masonry();
    UserService.loadUser();
}

export default DashboardController;