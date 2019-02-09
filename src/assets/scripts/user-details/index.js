import * as angular from 'angular';
import ngRoute from 'angular-route';
import UserDetailsController from './user-details.controller';
import UserDetailsService from './user-details.service';

angular.module('nwUserDetails', [ngRoute])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(UserDetailsController.name, UserDetailsController)
    .factory(UserDetailsService.name, UserDetailsService);