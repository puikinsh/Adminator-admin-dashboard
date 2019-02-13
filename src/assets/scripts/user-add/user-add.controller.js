/** @ngInject */
import visas from "../profile/visa.type"

const UserAddController = ($scope,UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

        $scope.tab = 1;

        $scope.setTab = (newTab) => {
            $scope.tab = newTab;
        }

        $scope.isSet = (tabNum) => {
            return $scope.tab === tabNum;
        }

    });
    UserService.loadUser();

    $scope.visas = visas;
  }
  
  export default UserAddController;
  