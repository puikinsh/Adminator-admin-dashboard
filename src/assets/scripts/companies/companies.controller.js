import masonry from '../masonry';
import Avatar from 'avatar-initials';
/** @ngInject */
const CompaniesController = ($scope, CompaniesService, UserService) => {
    $scope.$on('loadUserSuccess', async (event, user) => {
        $scope.user = user;
        await CompaniesService.fetchCompaniesService()
            .then( (result) => { 
              $scope.companies = result;

                $scope.avatar = function(index) {
                new Avatar(document.getElementById('company'+index), {
                    'useGravatar': false,
                    'initials': result[index].name[0],
                    'initial_weight': 300,
                });
            }
              masonry(); 
            })
            .catch( (error) => { console.log(error); })
      });
      UserService.loadUser();
}

export default CompaniesController;