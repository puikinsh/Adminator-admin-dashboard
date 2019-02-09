/** @ngInject */
const UserDetailsController = ($scope, $routeParams, UserDetailsService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
        UserDetailsService.fetchUserDetails($routeParams)
          .then( (result) => { console.log(result);
           $scope.userDetails = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default UserDetailsController;