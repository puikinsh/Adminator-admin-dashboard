/** @ngInject */
const RefereesController = ($scope, RefereesService, UserService) => {
    $scope.$on('loadUserSuccess', async (event, user) => {
        $scope.user = user;
        await RefereesService.fetchRefereesService()
          .then( (result) => { $scope.referees = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default RefereesController;