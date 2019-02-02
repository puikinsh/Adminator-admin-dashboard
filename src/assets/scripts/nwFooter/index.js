import angular from 'angular';

angular.module('NomitWisp-Footer', [])
    .directive('nwFooter', nwFooter);
    
/** @ngInject */
function nwFooter (){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/nwFooter/nwFooter.html'
    }
}