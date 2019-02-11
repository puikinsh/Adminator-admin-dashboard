import visas from './visa.type';
/** @ngInject */
const ProfileController = ($scope, ProfileService, UserService) => {
  // Load visas in the scope
  $scope.visas = visas;
  
  // Listen for event to do operations
  $scope.$on('loadUserSuccess', function (event, user) {
    $scope.user = user;
    $scope.userUpdated = {};

    // Fetch user info for the profile
    ProfileService.fetchProfileService($scope.user.id)
      .then((result) => {
        $scope.profile = result;
      })
      .catch((error) => {
        console.log(error);
      });
    
    /**
     * Update profile function gets updated user from the form
     * and queries the DB to update the user's information
     * 
     * v1.0 non selective update
     */
    $scope.updateProfile = () => {
      ProfileService.updateUserProfile($scope.user.id, $scope.userUpdated)
        .then((result)=>{
          console.log(result);
        })
        .catch((err)=> {console.log(err)})
    }
  });


  UserService.loadUser();
}

export default ProfileController;
