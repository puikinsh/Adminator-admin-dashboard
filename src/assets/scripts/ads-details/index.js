import * as angular from 'angular';
import AdsDetailsController from './controller';
import AdsDetailsService from './ads.service'

angular.module('nwAdsDetails', [])
    .controller(AdsDetailsController.name, AdsDetailsController)
    .factory(AdsDetailsService.name, AdsDetailsService);