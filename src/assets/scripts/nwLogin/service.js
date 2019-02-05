const LoginService = ($http) => {
    let serv = {};

    serv.loginUserService = (user) => {
        return $http({
			method: 'POST',
			url: 'https://nomitwisp-restapi.herokuapp.com/login',
			data: user,
			headers: { 'Content-Type': 'application/json' }
		})
        .then( (result) => {
            console.log(result);
            return result.data;              
        }, (err) => {
            console.log(err);
            return err.data;
        });
    }
    return serv;
}

export default LoginService;