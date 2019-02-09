import * as $ from 'jquery';
import masonry from '../masonry';

/** @ngInject */
const DashboardController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function(event, user) {
        $scope.user = user;
    }); 
        // tutte le funzioni del controller
        masonry();

    UserService.loadUser();
}

export default DashboardController;