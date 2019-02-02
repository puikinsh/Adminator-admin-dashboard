const AdsDetailsController = async($scope, AdsDetailsService, $routeParams) => {
    await AdsDetailsService.fetchAdsService()
        .then((data) => {
            $scope.ad = data[$routeParams.id];
        })
}

export default AdsDetailsController;