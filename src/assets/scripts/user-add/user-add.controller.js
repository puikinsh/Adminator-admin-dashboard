/** @ngInject */
const UserAddController = ($scope,UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

        $scope.classifications = ['class1', 'class2'];
        $scope.skills = ['s1', 's2'];

        $scope.tab = 1;

        $scope.setTab = (newTab) => {
            $scope.tab = newTab;
        }

        $scope.isSet = (tabNum) => {
            return $scope.tab === tabNum;
        }

    });
    UserService.loadUser();
  }
  
  export default UserAddController;
  