import moment from 'moment';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams) => {
    AdsDetailsService.fetchAdDetails($routeParams)
        .then(function(result){
            $scope.ad = result;
            window.msnry.layout();
            console.log(result);
        })
        .catch(function(error){
            console.log(error);
        });
    $scope.daysAgo = (timestamp) => {
        return moment(timestamp).fromNow();
    }
}

export default AdsDetailsController;