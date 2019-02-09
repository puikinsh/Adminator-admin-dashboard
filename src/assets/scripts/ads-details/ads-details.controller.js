import moment from 'moment';
import Avatar from 'avatar-initials';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
        AdsDetailsService.fetchAdDetails($routeParams)
            .then((result) => {
                $scope.ad = result;

                // $scope.avatar = new Avatar(document.getElementById('avatar_company_details'), {
                //     'useGravatar': false,
                //     'initials': 'AD', // it will be`${$scope.user.first_name[0]}${$scope.user.last_name[1]}`
                //     'initial_weight': 300,
                // });
            })
            .catch((error) => { console.log(error); });
        $scope.daysAgo = (timestamp) => { return moment(timestamp).fromNow(); }
    });
    UserService.loadUser();


}

export default AdsDetailsController;