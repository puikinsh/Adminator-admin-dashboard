import angular from 'angular';
import angularFilter from 'angular-filter';
import ProfileController from './profile.controller';
import ProfileService from './profile.service';

angular.module('nwProfile', [angularFilter])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(ProfileController.name, ProfileController)
    .factory(ProfileService.name, ProfileService);