/** @ngInject */
const UserAddController = ($scope) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

        $scope.classifications = ['class1', 'class2'];
        $scope.skills = ['s1', 's2'];

    });
    UserService.loadUser();
  }
  
  export default UserAddController;
  