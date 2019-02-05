import angular from 'angular';
import ngRoute from 'angular-route';
import ngCookie from 'angular-cookies';
import AdsDetailsController from './ads-details.controller';
import AdsDetailsService from './ads-details.service'

angular.module('nwAdsDetails', [ngRoute, ngCookie])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .factory(AdsDetailsService.name, AdsDetailsService)
    .controller(AdsDetailsController.name, AdsDetailsController);
    