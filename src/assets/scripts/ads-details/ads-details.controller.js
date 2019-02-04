import moment from 'moment';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
        AdsDetailsService.fetchAdDetails($routeParams)
            .then((result) => {
                $scope.ad = result;
                window.msnry.layout();
            })
            .catch((error) => { console.log(error); });
        $scope.daysAgo = (timestamp) => { return moment(timestamp).fromNow(); }
    });
    UserService.loadUser();
}

export default AdsDetailsController;