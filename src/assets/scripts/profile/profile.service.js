/** @ngInject */
const ProfileService = ($http) => {
    let serv = {};

    serv.fetchProfileService = (id) =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/user/'+id, { withCredentials: true })
        .then( (result) => {
                return result.data;              
        })
        .catch( (error) => {
                console.log(error);
                return [];
        });
    }
    return serv;
}

export default ProfileService;