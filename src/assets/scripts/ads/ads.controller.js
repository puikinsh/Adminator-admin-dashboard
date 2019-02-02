/** @ngInject */
const AdsController = ($scope, AdsService, UserService) => {
  $scope.$on('loadUserSuccess', function (event, user) {
    $scope.user = user;
    AdsService.fetchAdsService()
      .then(function (result) {
        $scope.ads = result;
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      })

  });
  UserService.loadUser();
}

export default AdsController;
