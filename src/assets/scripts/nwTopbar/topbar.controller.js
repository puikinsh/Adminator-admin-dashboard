import functionSearch from '../search';
import Avatar from 'avatar-initials';

/** @ngInject */

const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    
    const avatar = new Avatar(document.getElementById('avatar'), {
        'useGravatar': false,
        'initials': 'CC',
      });

    $scope.$on('needReload', function(event){
        console.log("NEED RELOAD!");
        // Refresh topbar...
    })

    UserService.loadUser();
    functionSearch();
}

export default TopbarController;