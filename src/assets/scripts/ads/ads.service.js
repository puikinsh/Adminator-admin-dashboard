/** @ngInject */
const AdsService = ($http) => {
    let serv = {};

    serv.fetchAdsService = () =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/ads', { withCredentials: true })
        .then( (result) => {
                console.log(result.data);
                return result.data;              
        })
        .catch( (error) => {
                console.log(error);
                return [];
        });
    }
    return serv;
}

export default AdsService;