/** @ngInject */
const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });

    $scope.$on('needReload', function(event){
        console.log("NEED RELOAD!");
        // Refresh topbar...
    })

    UserService.loadUser();
}

export default TopbarController;