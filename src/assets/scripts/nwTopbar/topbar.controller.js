/** @ngInject */
const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });

    UserService.loadUser();
}

export default TopbarController;