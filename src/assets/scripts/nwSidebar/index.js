import angular from 'angular';
import SidebarController from './sidebar.controller';

angular.module('NomitWisp-Sidebar', [])
    .controller(SidebarController.name, SidebarController)
    .directive('nwSidebar', nwSidebar);

/** @ngInject */
function nwSidebar(){
    return {
        restrict: 'E',
        controller: 'SidebarController',
        templateUrl: 'assets/scripts/nwSidebar/nwSidebar.html'
    };
}