import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import LoginController from './login.controller';
import LoginService from './login.service';

angular.module('nwLogin', [ngCookies])
    .controller('LoginController', LoginController)
    .factory('LoginService', LoginService);