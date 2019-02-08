/** @ngInject */
const UsersController = ($scope, UsersService, UserService) => {
    $scope.$on('loadUserSuccess', async (event, user) => {
        $scope.user = user;
        await UsersService.fetchUsersService()
          .then( (result) => { $scope.users = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default UsersController;