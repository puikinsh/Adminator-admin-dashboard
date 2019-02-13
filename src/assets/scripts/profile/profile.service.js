/** @ngInject */
const ProfileService = ($http) => {
    let serv = {};

    serv.fetchProfileService = (id) =>{
        return $http.get(`${process.env.RESTAPI_URL}/api/user/${id}`, { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }

    serv.updateUserProfile = (id, userUpdated) => {
        return $http({
            method: 'POST',
            url: `${process.env.RESTAPI_URL}/api/user/${id}`,
            data: userUpdated,
            withCredentials: true
        })
        .then( (result) => { 
            console.log(result.data);
            return result.data; 
        })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default ProfileService;