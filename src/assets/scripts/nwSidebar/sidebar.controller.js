/** @ngInject */
const SidebarController = ($scope, UserService) => {
    UserService.loadUser();
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    UserService.loadUser();
}

export default SidebarController;