import * as $ from 'jquery';

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

const UserService = ($cookies, $rootScope, $location) => {

	let serv = {};

    //load user has been called (is called on page load in menu controller and after login on modal controller)
    serv.loadUser =  () => {
        if(typeof $cookies.get('access_token') !== 'undefined' ){
			$rootScope.$broadcast('loadUserSuccess', parseJwt( $cookies.get('access_token') ));
			$('#modalLoginForm').modal('hide');
		} else if($location.path() === '/signup') { $('#modalLoginForm').modal('hide'); }
			else { $('#modalLoginForm').modal({backdrop: 'static', keyboard: false}); }
		}
	
	return serv;

};

export default UserService;