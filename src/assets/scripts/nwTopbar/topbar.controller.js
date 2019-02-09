import * as $ from 'jquery';
import functionSearch from '../search';
import Avatar from 'avatar-initials';
import masonry from '../masonry';

/** @ngInject */

const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

        $scope.avatar = new Avatar(document.getElementById('avatar'), {
            'useGravatar': false,
            'initials': user.name[0],
            'initial_weight': 300,
        });

        $scope.$on('needReload', function(event){
            console.log("NEED RELOAD!");
            functionSearch();
            masonry();
        });
    });
    UserService.loadUser();
    

}

export default TopbarController;