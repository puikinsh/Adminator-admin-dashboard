import angular from 'angular';
import ngCookies from 'angular-cookies';
import LogoutController from './controller';
import LogoutService from './service';

angular.module('nwLogout', [ngCookies])
    .controller(LogoutController.name, LogoutController)
    .factory(LogoutService.name, LogoutService);