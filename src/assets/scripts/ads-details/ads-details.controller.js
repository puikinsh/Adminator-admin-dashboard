import moment from 'moment';
import Avatar from 'avatar-initials';

const AdsDetailsController = ($scope, AdsDetailsService, $routeParams, UserService, UsersService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

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
    });
    UserService.loadUser();

    $(document).ready( async() =>{
        await UsersService.fetchUsersService()
        .then( (result) => { 
            $scope.users = result;
            
            $scope.avatar_user = function(index) {
                const first_name = result[index].personal.first_name[0];
                const last_name = result[index].personal.last_name[0];
                new Avatar(document.getElementById('user'+index), {
                    'useGravatar': false,
                    'initials': first_name + last_name,
                    'initial_weight': 300,
                });
            }
            masonry();
        })
      .catch( (error) => { console.log(error); })
    });
}

export default AdsDetailsController;