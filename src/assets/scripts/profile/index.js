import angular from 'angular';
import ProfileController from './profile.controller';
import ProfileService from './profile.service';

angular.module('nwProfile', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(ProfileController.name, ProfileController)
    .factory(ProfileService.name, ProfileService);