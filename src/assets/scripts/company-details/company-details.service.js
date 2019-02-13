/** @ngInject */
const CompanyDetailsService = ($http) => {
    let serv = {};

    serv.fetchCompanyDetails = (route) => {
        return $http.get(`${process.env.RESTAPI_URL}/api/user/${route.id}`)
            .then( (result) => { console.log(result); return result.data; })
            .catch( (error) => { return error; })
    }
    return serv;
}

export default CompanyDetailsService;