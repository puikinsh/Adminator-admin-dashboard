import * as angular from 'angular';
import UserAddController from './user-add.controller';
import UserAddService from './user-add.service';

angular.module('nwUserAdd', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(UserAddController.name, UserAddController)
    .factory(UserAddService.name, UserAddService);
    