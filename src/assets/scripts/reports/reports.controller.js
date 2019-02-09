/** @ngInject */
const ReportsController = ($scope, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
    });
    // Service to fetch reports

    UserService.loadUser();
}

export default ReportsController;