const UserDetailsService = ($http) => {
    let serv = {};

    serv.fetchUserDetails = (route) =>{
        return $http.get(`${process.env.RESTAPI_URL}/api/users/${route.id}`)
            .then( (result) => { return result.data; })
            .catch( (error) => { return error; })
    }
    return serv;
}

export default UserDetailsService;