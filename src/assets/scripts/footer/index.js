import * as angular from 'angular';
// const angular = require('angular');

angular.module('NomitWisp', [])
    .directive('nwFooter', nwFooter);

function nwFooter(){
    return {
        restrict: 'E',
        templateUrl: 'assets/scripts/footer/footer.html'
    }
}