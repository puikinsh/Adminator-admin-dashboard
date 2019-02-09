import masonry from "../masonry";

const LogoutController = ($scope, $location, LogoutService, $cookies, UserService) => {
	$scope.userLogged = false;		
	
	$scope.userLogout = async () => {
		await LogoutService.logoutUserService($scope.user)
			.then((result)=>{ 
				$cookies.remove('access_token');
				UserService.loadUser();
				$location.path('/');
				masonry();
			})
			.catch((err)=>{ console.log(err); }) 
	}
};

export default LogoutController;