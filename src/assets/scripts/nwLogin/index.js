import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import LoginController from './login.controller';
import LoginService from './login.service';

angular.module('NomitWisp-Login', [ngCookies])
    .directive('nwLogin', nwLogin)
    .controller('LoginController', LoginController)
    .factory('LoginService', LoginService);

/** @ngInject */
function nwLogin(){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/nwLogin/nwLogin.html',
    };
}