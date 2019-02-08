/** @ngInject */
import Avatar from 'avatar-initials';

const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    
    const avatar = new Avatar(document.getElementById('avatar'), {
        'useGravatar': false,
        'initials': 'CC',
      });

    UserService.loadUser();
}

export default TopbarController;