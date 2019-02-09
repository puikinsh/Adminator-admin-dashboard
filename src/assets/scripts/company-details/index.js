import * as angular from 'angular';
import ngRoute from 'angular-route';
import CompanyDetailsController from './company-details.controller';
import CompanyDetailsService from './company-details.service';

angular.module('nwCompanyDetails', [ngRoute])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(CompanyDetailsController.name, CompanyDetailsController)
    .factory(CompanyDetailsService.name, CompanyDetailsService);