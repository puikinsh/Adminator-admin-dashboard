import visas from './visa.type';
/** @ngInject */
const ProfileController = ($scope, ProfileService, UserService) => {
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
    $scope.updateProfile = (userUpdated) => {
      ProfileService.updateUserProfile($scope.user.id)
        .then((result)=>{
          userUpdated.personal.first_name = "Jack"
          userUpdated.personal.middle_name= "Francis"
          userUpdated.personal.last_name= "Sparrow"
          userUpdated.personal.bio = "Captain Jack Sparrow is a fictional character in the Pirates of the Caribbean film series. The character was created by screenwriters Ted Elliott and Terry Rossio, and is portrayed by Johnny Depp.";
          userUpdated.personal.phone = 423123123
          userUpdated.personal.skills = ['Sailing', 'Robbing', 'Drinking']
          userUpdated.personal.main_classification = ['Captain']
          userUpdated.personal.languages = ['Rum', 'English']
          userUpdated.personal.nationality = "Unknown"
          userUpdated.personal.dob = new Date(1987, 8, 1)
          userUpdated.personal.address = "199 Eckford Street"
          userUpdated.personal.city = "Spinachland"
          userUpdated.personal.state = "VIC"
          userUpdated.personal.postcode = 3149
          userUpdated.personal.education = "PhD"
          userUpdated.personal.visa = "Temporary Skill Shortage visa (subclass 482)"
          userUpdated.email = "jack@test"
        })
    }
  });


  UserService.loadUser();
}

export default ProfileController;
