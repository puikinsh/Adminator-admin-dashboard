/** @ngInject */
const LoginService = (['$http', ($http) => {
    let serv = {};

    serv.loginUserService = (user) => {
        return $http({
			method: 'POST',
			url: `${process.env.RESTAPI_URL}/login`,
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
}]);

export default LoginService;