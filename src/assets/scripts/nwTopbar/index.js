import angular from 'angular';

angular.module('NomitWisp-Topbar', [])
    .directive('nwTopbar', nwTopbar);

/** @ngInject */
function nwTopbar(){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/nwTopbar/nwTopbar.html'
    };
}