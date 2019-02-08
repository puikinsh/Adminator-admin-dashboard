/** @ngInject */
const UsersController = ($scope, UsersService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
        UsersService.fetchUsersService()
          .then( (result) => { $scope.userDetails = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default UsersController;