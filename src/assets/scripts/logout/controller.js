const LogoutController = ($scope, $location, LogoutService, $cookies, UserService) => {
	$scope.userLogged = false;		
	
	$scope.userLogout = async () => {
		await LogoutService.logoutUserService($scope.user); 
        $cookies.remove('access_token');
		UserService.loadUser();
		$location.path('/');
	}
};

export default LogoutController;