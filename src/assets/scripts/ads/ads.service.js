/** @ngInject */
const AdsService = ($http) => {
    let serv = {};
    
    serv.fetchAdsService = () =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/ads', { withCredentials: true })
        .then( (result) => { return result.data; })
        .catch( (error) => { return error; });
    }
    return serv;
}

export default AdsService;