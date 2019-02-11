/** @ngInject */
const LoginController = ['$scope', '$cookies', '$location', 'LoginService', 'UserService' ,
	function ($scope, $cookies, $location, LoginService, UserService) {

	// load the user if already logged in, for all controllers
	UserService.loadUser();

	$scope.userLogin = async (isValid) => {
		$scope.dataLoading = true;
		if(isValid){
			await LoginService.loginUserService($scope.user)
				.then((result) => {
					// save the cookie and reload the user for all controllers
					$cookies.put('access_token', result.token);
					UserService.loadUser();
					$location.path('/');
					$scope.$emit('needReload');
					$scope.dataLoading = false;
				})
				.catch((err) => {
					$scope.dataLoading = false;
					alert(err);
				})
		}
	}
}];

export default LoginController;