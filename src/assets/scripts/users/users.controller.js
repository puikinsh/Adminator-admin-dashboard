import Avatar from 'avatar-initials';
import masonry from '../masonry';
import * as $ from 'jquery';

/** @ngInject */
const UsersController = ($scope, UsersService, UserService) => {
    $(document).ready( async() =>{
        await UsersService.fetchUsersService()
        .then( (result) => { 
            $scope.users = result;
            
            $scope.avatar = function(index) {
                const first_name = result[index].personal.first_name[0];
                const last_name = result[index].personal.last_name[0];
                new Avatar(document.getElementById('user'+index), {
                    'useGravatar': false,
                    'initials': first_name + last_name,
                    'initial_weight': 300,
                });
            }
            masonry();
        })
      .catch( (error) => { console.log(error); })
    });
}

export default UsersController;