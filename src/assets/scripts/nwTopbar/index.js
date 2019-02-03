import angular from 'angular';
import TopbarController from './topbar.controller';

angular.module('NomitWisp-Topbar', [])
    .controller(TopbarController.name, TopbarController)
    .directive('nwTopbar', nwTopbar);

/** @ngInject */
function nwTopbar(){
    return {
        restrict: 'E',
        controller: 'TopbarController',
        templateUrl: 'assets/scripts/nwTopbar/nwTopbar.html'
    };
}