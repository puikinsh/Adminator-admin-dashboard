const LoginController = ($scope, $cookies, $location, LoginService, UserService) => {

	// load the user if already logged in, for all controllers
	UserService.loadUser();
	
	$scope.userLogin = async (isValid) => {
		if(isValid){
			let result = await LoginService.loginUserService($scope.user); 
			if( typeof result.token !== "undefined"){

				// save the cookie and reload the user for all controllers
				$cookies.put('access_token', result.token);
				UserService.loadUser();
				$location.path('/');
				$scope.$apply();
			} else {
				alert(result);
			}
		}
	}

};

export default LoginController;