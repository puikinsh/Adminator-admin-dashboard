/** @ngInject */
const RefereesService = ($http) => {
    let serv = {};
    
    serv.fetchRefereesService = () => {
        return $http.get(`${process.env.RESTAPI_URL}/api/users/referee`, { withCredentials: true })
        .then( (result) => { console.log(result.data); return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default RefereesService;