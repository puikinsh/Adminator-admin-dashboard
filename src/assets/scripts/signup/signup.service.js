'use strict';

/** @ngInject */
const SignupService = ($http)=> {
    let serv = {};

    serv.signupUserService = (user) => {
        return $http({
            method: 'POST',
            url: `${process.env.RESTAPI_URL}/signup`,
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
    return serv;
}

export default SignupService;

