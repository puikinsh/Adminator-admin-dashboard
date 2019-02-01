import 'babel-polyfill';
const LoginController = ($scope, LoginService, $cookies) => {
	$scope.userLogged = false;		
	
	if(typeof $cookies.get('access_token') !== 'undefined' ){
		$scope.userLogged = true;
		$scope.user = parseJwt( $cookies.get('access_token') );
    }
	$scope.userLogin = async () => {
		
		let result = await LoginService.loginUserService($scope.user); 
		if( $scope.user !== "" || $scope.user !== "undefined"){
            console.log(result);
			$scope.userLogged = true;		
			$scope.user = parseJwt( result );
			$cookies.put('access_token', result);
			console.log('Redirect me to Dashboard.');
		} else {
			console.log("User is empty");
			
		}
	}
};

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export default LoginController;