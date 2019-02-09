/** @ngInject */
const AdsService = ($http) => {
    let serv = {};
    
    serv.fetchAdsService = () =>{
        return $http.get(`${process.env.RESTAPI_URL}/api/ads`, { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default AdsService;