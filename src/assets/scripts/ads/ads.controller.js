/** @ngInject */
const AdsController = ($scope, AdsService, UserService) => {
  $scope.$on('loadUserSuccess', async (event, user) => {
    $scope.user = user;
    await AdsService.fetchAdsService(user)
      .then( (result) => { $scope.ads = result; })
      .catch( (error) => { console.log(error); })
  });
  UserService.loadUser();
}

export default AdsController;
