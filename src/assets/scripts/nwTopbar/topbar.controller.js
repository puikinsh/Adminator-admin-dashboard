import * as $ from 'jquery';
import functionSearch from '../search';
import Avatar from 'avatar-initials';
import masonry from '../masonry';

/** @ngInject */

const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });

    $scope.avatar = new Avatar(document.getElementById('avatar'), {
        'useGravatar': false,
        'initials': 'AD', // it will be`${$scope.user.first_name[0]}${$scope.user.last_name[1]}`
        'initial_weight': 300,
    });

    $scope.$on('needReload', function(event){
        console.log("NEED RELOAD!");
        functionSearch();
        masonry();
    });
    
    UserService.loadUser();
    

}

export default TopbarController;