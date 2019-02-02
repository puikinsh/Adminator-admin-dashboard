const AdsDetailsService = ($http) => {
    let serv = {};

    serv.fetchAdsService = () =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/ads')
        .then( (result) => {
                console.log(result);
                return result;              
        }, (error) => {
                console.log(error);
                return error;
        });
    }
    return serv;
}

export default AdsDetailsService;