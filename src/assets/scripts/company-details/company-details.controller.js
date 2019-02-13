import Avatar from 'avatar-initials';
/** @ngInject */
const CompanyDetailsController = ($scope, $routeParams, CompanyDetailsService, UserService) => {
    $scope.$on('loadUserSuccess', function (event, user) {
        $scope.user = user;

        CompanyDetailsService.fetchCompanyDetails($routeParams)
          .then( (result) => { 
              console.log(result); 
              $scope.company = result; 

              $scope.avatar = new Avatar(document.getElementById('avatar_company_details'), {
                'useGravatar': false,
                'initials': $scope.company.name[0],
                'initial_weight': 300,
            });
            })
          .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default CompanyDetailsController;