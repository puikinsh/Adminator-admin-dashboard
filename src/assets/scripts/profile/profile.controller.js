import visas from './visa.type';
/** @ngInject */
const ProfileController = ($scope, $timeout, ProfileService, UserService) => {
  // Load visas in the scope
  $scope.visas = visas;
  
  // Listen for event to do operations
  $scope.$on('loadUserSuccess', function (event, user) {
    $scope.user = user;
    
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
    $scope.updateProfile = (ProfileForm) => {
      // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and show validation errors.
      if (ProfileForm.$invalid) {
        return;
      }

      $scope.processing = "Sending the data..."

      ProfileService.updateUserProfile($scope.user.id, $scope.profile)
        .then((result)=>{
          console.log(result);
          $scope.messages = 'Your profile has been updated!';
        })
        .catch((err)=> {
          console.log(err);
          $scope.messages = 'Oops, we received your request, but there was an error processing it.';
        })
        .finally(() => { 
          $scope.processing = null;
          // Hide status messages after five seconds.
          $timeout(() => {
            $scope.messages = null;
          }, 5000);
        });
        
    }
  });


  UserService.loadUser();
}

export default ProfileController;
