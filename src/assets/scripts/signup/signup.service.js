'use strict';

angular.module('NomitWisp-Signup', [])
    .factory(SignupService.name, SignupService);

/** @ngInject */
function SignupService($http) {
    return $http({
        method: 'POST',
        url: 'https://nomitwisp-restapi.herokuapp.com/signup',
        data: user,
        headers: { 'Content-Type': 'application/json' }
    })
    .then((result) => {
            console.log(result.data.token);
            return result.data.token;              
    }).catch((err) => {
            console.log(err.data);
            return err.data;
    });
}

