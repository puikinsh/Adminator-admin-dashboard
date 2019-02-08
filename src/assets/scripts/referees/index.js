import * as angular from 'angular';
import RefereesController from './referees.controller';
import RefereesService from './referees.service';

angular.module('nwReferees', [])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller(RefereesController.name, RefereesController)
    .factory(RefereesService.name, RefereesService);