import * as angular from 'angular';
import AdsController from './controller';

angular.module('nwAds', [])
    .controller(AdsController.name, AdsController);
    