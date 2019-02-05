import angular from 'angular';
import HistoryController from './history.controller';
//import ProfileService from './profile.service';

angular.module('nwHistory', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(HistoryController.name, HistoryController)
    //.factory(ProfileService.name, ProfileService);