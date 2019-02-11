import masonry from "../masonry";

/** @ngInject */
const LogoutController = ['$scope', '$location', '$cookies', 'LogoutService', 'UserService',
	($scope, $location, $cookies, LogoutService, UserService) => {
	$scope.userLogged = false;		
	$scope.userLogout = async () => {
		await LogoutService.logoutUserService($scope.user)
			.then((result)=>{ 
				$cookies.remove('access_token');
				$location.path('/');
				$scope.$emit('needReload');
				masonry();
				UserService.loadUser();
			})
			.catch((err)=>{ console.log(err); }) 
	}
}];

export default LogoutController;