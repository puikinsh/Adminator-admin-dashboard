/** @ngInject */
const UsersService = ($http) => {
    let serv = {};
    
    serv.fetchUsersService = () =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/users/user', { withCredentials: true })
        .then( (result) => { console.log(result.data); return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default UsersService;