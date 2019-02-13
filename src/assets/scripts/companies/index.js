import * as angular from 'angular';
import CompaniesController from './companies.controller';
import CompaniesService from './companies.service';

angular.module('nwCompanies', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(CompaniesController.name, CompaniesController)
    .factory(CompaniesService.name, CompaniesService);