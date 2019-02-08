/** @ngInject */
const CompaniesService = ($http) => {
    let serv = {};
    
    serv.fetchCompaniesService = () =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/users/company', { withCredentials: true })
        .then( (result) => { console.log(result.data); return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default CompaniesService;