import angular from 'angular';
import ngRoute from 'angular-route';

angular.module('NomitWisp', 
    [
        'NomitWisp-Login',
        'NomitWisp-Topbar', 
        'NomitWisp-Sidebar',
        'NomitWisp-Footer',
        'nwDashboard',
        'nwLogout',
        ngRoute
        
    ])
    .config(function ($routeProvider) { 
        $routeProvider 
        .when('/', { 
            controller: 'DashboardController', 
            templateUrl: 'assets/scripts/dashboard/dashboard.html' 
        })
        .otherwise({ 
            redirectTo: '/' 
        }); 
    });