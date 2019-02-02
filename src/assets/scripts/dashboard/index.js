import angular from 'angular';

angular.module('nwDashboard', [])
    .controller('DashboardController', DashboardController);

/** @ngInject */
function DashboardController($scope){
    // service carica dashboard
    // jquery per grafici
    $scope.user = {
        role : 'admin'
    };

}