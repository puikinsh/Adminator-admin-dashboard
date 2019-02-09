'use strict';

/** @ngInject */
const SignupController = ($scope, $cookies, $location, SignupService, UserService) => {
    $scope.userSignup = async() => {
    await SignupService.signupUserService($scope.user)
        .then((result) => {
            $cookies.put('access_token', result);
            UserService.loadUser();
            $location.path('/');
         })
        .catch((error) => { console.log(error); })
    }
}

export default SignupController;