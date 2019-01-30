import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import LoginController from './controller';
import LoginService from './service';

angular.module('NomitWisp-Login', [ngCookies])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(LoginController.name, LoginController)
    .factory(LoginService.name, LoginService);
    
