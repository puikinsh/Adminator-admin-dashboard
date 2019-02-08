import * as angular from 'angular';
import UserDetailsController from './user-details.controller';
import UserDetailsService from './user-details.service';

angular.module('nwUsers', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(UserDetailsController.name, UserDetailsController)
    .factory(UserDetailsService.name, UserDetailsService);