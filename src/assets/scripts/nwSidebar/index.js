import angular from 'angular';

angular.module('NomitWisp-Sidebar', [])
    .directive('nwSidebar', nwSidebar);

/** @ngInject */
function nwSidebar(){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/nwSidebar/nwSidebar.html'
    };
}