const AdsDetailsService = ($http) => {
    let serv = {};

    serv.fetchAdDetails = (route) =>{
        return $http.get('https://nomitwisp-restapi.herokuapp.com/api/ads/'+route.id)
            .then( (result) => { return result.data; })
            .catch( (error) => { return error; })
    }
    return serv;
}

export default AdsDetailsService;