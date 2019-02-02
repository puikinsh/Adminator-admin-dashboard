const LogoutService = ($http) => {
    let serv = {};

    serv.logoutUserService = (user) =>{
        return $http({
			method: 'POST',
            url: 'https://nomitwisp-restapi.herokuapp.com/logout',
            data: user,
			headers: { 'Content-Type': 'application/json' }
		})
        .then( (result) => {
                console.log(result);
                return result;              
        }, (err) => {
                console.log(err.data);
                return err.data;
        });
    }
    return serv;
}

export default LogoutService;