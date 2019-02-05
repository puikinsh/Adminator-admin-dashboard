/** @ngInject */
const HistoryController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
        // Service to fetch the history

    UserService.loadUser();
}

export default HistoryController;