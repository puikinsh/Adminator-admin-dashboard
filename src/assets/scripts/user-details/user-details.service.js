const UserDetailsService = ($http) => {
    let serv = {};

    serv.fetchUserDetails = (route) =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/users/'+route.id)
            .then( (result) => { return result.data; })
            .catch( (error) => { return error; })
    }
    return serv;
}

export default UserDetailsService;