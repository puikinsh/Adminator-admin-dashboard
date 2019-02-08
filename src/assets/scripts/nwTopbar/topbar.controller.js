import functionSearch from '../search';

/** @ngInject */
const TopbarController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });

    UserService.loadUser();
    functionSearch();
}

export default TopbarController;