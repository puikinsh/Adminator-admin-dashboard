const LogoutController = ($scope, LogoutService, $cookies, UserService) => {
	$scope.userLogged = false;		
	
	$scope.userLogout = async () => {
        console.log("Logout");
		const result = await LogoutService.logoutUserService($scope.user); 
        $cookies.remove('access_token');
		console.log(result);
		UserService.loadUser();
	}
};

export default LogoutController;