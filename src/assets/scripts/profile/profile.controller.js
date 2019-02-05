import visas from './visa.type';
/** @ngInject */
const ProfileController = ($scope, ProfileService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    UserService.loadUser();
    
    ProfileService.fetchProfileService($scope.user.id)
      .then((result) => { $scope.profile = result; })
      .catch((error) => { console.log(error); })

    $scope.visas = visas;
    UserService.loadUser();
}

export default ProfileController;
