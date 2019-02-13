/** @ngInject */
const AdsService = ($http) => {
    let serv = {};
    
    serv.fetchAdsService = (user) =>{
        if (user.role === 'user'){
            return $http.get(`${process.env.RESTAPI_URL}/api/user/${user.id}/ads`, { withCredentials: true })
            .then( (result) => { return result.data; })
            .catch( (error) => { return error; });
        } else {
            return $http.get(`${process.env.RESTAPI_URL}/api/ads`, { withCredentials: true })
            .then( (result) => { return result.data; })
            .catch( (error) => { return error; });
        }
    }
    return serv;
}

export default AdsService;