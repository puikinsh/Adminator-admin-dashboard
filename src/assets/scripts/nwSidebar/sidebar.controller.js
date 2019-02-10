import functionSidebar from '../sidebar';
import masonry from '../masonry';

/** @ngInject */
const SidebarController = ($scope, UserService) => {
    UserService.loadUser();
    var executed = false;
    $scope.$on('loadUserSuccess', function (event, user) {
        if(!executed){
            executed = true;
            $scope.user = user;
            functionSidebar();
        }
    });

    $scope.$on('needReload', function(event){
        masonry();
    });
}

export default SidebarController;