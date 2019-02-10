import masonry from "../masonry";

const LogoutController = ($scope, $location, LogoutService, $cookies, UserService) => {
	$scope.userLogged = false;		
	UserService.loadUser();
	$scope.userLogout = async () => {
		await LogoutService.logoutUserService($scope.user)
			.then((result)=>{ 
				$cookies.remove('access_token');
				$location.path('/');
				$scope.$emit('needReload');
				masonry();
			})
			.catch((err)=>{ console.log(err); }) 
	}
};

export default LogoutController;