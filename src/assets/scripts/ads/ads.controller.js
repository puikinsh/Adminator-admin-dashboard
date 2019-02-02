/** @ngInject */
const AdsController = ($scope, AdsService) => {
        AdsService.fetchAdsService()
            .then(function(result){
                $scope.ads = result;
                console.log(result);
            })
            .catch(function(error){
                console.log(error);
            })
        
        
}

export default AdsController;