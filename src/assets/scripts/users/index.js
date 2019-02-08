import * as angular from 'angular';
import UsersController from './users.controller';
import UsersService from './users.service';

angular.module('nwUsers', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(UsersController.name, UsersController)
    .factory(UsersService.name, UsersService);