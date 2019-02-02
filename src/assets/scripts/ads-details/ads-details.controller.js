import moment from 'moment';
import UserService from '../app/shared.service';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
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
    });
    UserService.loadUser();
}

export default AdsDetailsController;