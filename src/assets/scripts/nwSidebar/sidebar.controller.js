import functionSearch from '../search';
import functionSidebar from '../sidebar';

/** @ngInject */
const SidebarController = ($scope, UserService) => {
    var executed = false;
    $scope.$on('loadUserSuccess', function (event, user) {
        if(!executed){
            executed = true;
            $scope.user = user;
            functionSidebar();
        }
    });
    UserService.loadUser();
}

export default SidebarController;