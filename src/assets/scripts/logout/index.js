import angular from 'angular';
import ngCookies from 'angular-cookies';
import LogoutController from './logout.controller';
import LogoutService from './logout.service';

angular.module('nwLogout', [ngCookies])
    .controller('LogoutController', LogoutController)
    .factory('LogoutService', LogoutService);