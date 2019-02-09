import angular from 'angular';
import ReportsController from './reports.controller';
//import ReportsService from './reports.service';

angular.module('nwReports', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(ReportsController.name, ReportsController)
    //.factory(HistoryService.name, HistoryService);