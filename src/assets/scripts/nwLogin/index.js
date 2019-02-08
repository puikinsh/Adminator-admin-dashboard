import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import LoginController from './controller';
import LoginService from './service';

angular.module('NomitWisp-Login', [ngCookies])
    .directive('nwLogin', nwLogin)
    .controller(LoginController.name, LoginController)
    .factory(LoginService.name, LoginService);

/** @ngInject */
function nwLogin(){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/nwLogin/nwLogin.html',
    };
}