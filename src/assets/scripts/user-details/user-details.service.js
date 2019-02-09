/** @ngInject */
const UserDetailsService = ($http) => {
    let serv = {};

    serv.fetchUserDetails = (route) => {
        return $http.get(`${process.env.RESTAPI_URL}/api/user/${route.id}`)
            .then( (result) => { console.log(result); return result.data; })
            .catch( (error) => { return error; })
    }
    return serv;
}

export default UserDetailsService;