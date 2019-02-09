import angular from 'angular';
import ngRoute from 'angular-route';
import ngCookie from 'angular-cookies';
import AdsAddController from './ads-add.controller';
import AdsAddService from './ads-add.service'

angular.module('nwAdsAdd', [ngRoute, ngCookie])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .factory(AdsAddService.name, AdsAddService)
    .controller(AdsAddController.name, AdsAddController);
    