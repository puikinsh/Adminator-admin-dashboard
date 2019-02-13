import angular from 'angular';
import TopbarController from './topbar.controller';

angular.module('NomitWisp-Topbar', [])
    .directive('nwTopbar', nwTopbar)
    .controller(TopbarController.name, TopbarController);

/** @ngInject */
function nwTopbar(){
    return {
        restrict: 'E',
        controller: 'TopbarController',
        templateUrl: 'assets/scripts/nwTopbar/nwTopbar.html'
    };
}