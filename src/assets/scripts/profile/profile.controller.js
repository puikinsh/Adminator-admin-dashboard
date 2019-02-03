/** @ngInject */
const ProfileController = ($scope, ProfileService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    UserService.loadUser();
    
    // Call service to fetch user data
    ProfileService.fetchProfileService($scope.user.id)
      .then(function (result) {
        $scope.profile = result;
        
      })
      .catch(function (error) {
        console.log(error);
      })
    
    UserService.loadUser();
}

export default ProfileController;
