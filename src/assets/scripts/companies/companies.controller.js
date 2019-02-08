/** @ngInject */
const CompaniesController = ($scope, CompaniesService, UserService) => {
    $scope.$on('loadUserSuccess', async (event, user) => {
        $scope.user = user;
        await CompaniesService.fetchCompaniesService()
          .then( (result) => { $scope.companies = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default CompaniesController;