const LoginService = ($http) => {
    let serv = {};

    serv.loginUserService = (user) =>{
        return $http({
			method: 'POST',
			url: 'https://nomitwisp-restapi.herokuapp.com/login',
			data: user,
			headers: { 'Content-Type': 'application/json' }
		})
        .then( (result) => {
                console.log(result.data.token);
                return result.data.token;              
        }, (err) => {
                console.log(err.data);
                return err.data;
        });
    }
    return serv;
}

export default LoginService;