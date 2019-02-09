/** @ngInject */
const CompanyDetailsController = ($scope, $routeParams, CompanyDetailsService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;
        CompanyDetailsService.fetchCompanyDetails($routeParams)
          .then( (result) => { console.log(result); $scope.company = result; })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default CompanyDetailsController;