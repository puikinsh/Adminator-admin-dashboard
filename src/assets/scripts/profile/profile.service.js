/** @ngInject */
const ProfileService = ($http) => {
    let serv = {};

    serv.fetchProfileService = (id) =>{
        return $http.get(`${process.env.RESTAPI_URL}/api/user/${id}`, { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }

    serv.updateUserProfile = (id) => {
        return $http.get(`${process.env.RESTAPI_URL}/api/user/${id}`, { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default ProfileService;