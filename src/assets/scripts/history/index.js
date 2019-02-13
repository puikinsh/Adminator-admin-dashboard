import angular from 'angular';
import HistoryController from './history.controller';
//import HistoryService from './history.service';

angular.module('nwHistory', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(HistoryController.name, HistoryController)
    //.factory(HistoryService.name, HistoryService);