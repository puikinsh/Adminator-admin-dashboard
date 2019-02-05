/** @ngInject */
const AdsController = ($scope, AdsService, UserService) => {
  $scope.$on('loadUserSuccess', function (event, user) {
    $scope.user = user;
    AdsService.fetchAdsService()
      .then( (result) => { $scope.ads = result; })
      .catch( (error) => { console.log(error); })
  });
  UserService.loadUser();
}

export default AdsController;
