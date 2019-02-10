import moment from 'moment';
import Avatar from 'avatar-initials';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams, UserService) => {
    // $scope.$on('loadUserSuccess', function (event, user) {
    //     $scope.user = user;
    // });
    // UserService.loadUser();
    AdsDetailsService.fetchAdDetails($routeParams)
            .then((result) => {
                $scope.ad = result;
                console.log(result);

                $scope.avatar = new Avatar(document.getElementById('ad-details-avatar'), {
                    'useGravatar': false,
                    'initials': result.companyname[0].toUpperCase()+result.companyname[1].toUpperCase(),
                });
            })
            .catch((error) => { console.log(error); });
        $scope.daysAgo = (timestamp) => { return moment(timestamp).fromNow(); }

}

export default AdsDetailsController;