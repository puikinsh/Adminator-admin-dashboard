const AdsDetailsService = ($http) => {
    let serv = {};

    serv.fetchAdDetails = (route) =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/ads/'+route.id)
        .then( (result) => {
                console.log(route.id);
                return result.data;              
        }, (error) => {
                console.log(error);
                return error;
        });
    }
    return serv;
}

export default AdsDetailsService;