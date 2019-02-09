import functionSidebar from '../sidebar';
import masonry from '../masonry';

/** @ngInject */
const SidebarController = ($scope, UserService) => {
    var executed = false;
    $scope.$on('loadUserSuccess', function (event, user) {
        if(!executed){
            executed = true;
            $scope.user = user;
            functionSidebar();
        }
        masonry();
    });
    UserService.loadUser();
}

export default SidebarController;