/** @ngInject */
const ProfileService = ($http) => {
    let serv = {};

    serv.fetchProfileService = (id) =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/user/'+id, { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default ProfileService;