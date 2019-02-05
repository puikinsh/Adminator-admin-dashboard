import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import AdsController from './ads.controller';
import AdsService from './ads.service';

angular.module('nwAds', [ngCookies])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(AdsController.name, AdsController)
    .factory(AdsService.name, AdsService);
    