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
        'nwAds',
        'nwAdsDetails',
        ngRoute
        
    ])
    .config(function ($routeProvider, $httpProvider) { 
        $httpProvider.defaults.withCredentials = true;

        $routeProvider 
        .when('/', { 
            controller: 'DashboardController', 
            templateUrl: 'assets/scripts/dashboard/dashboard.html' 
        })
        .when('/ads', { 
            controller: 'AdsController', 
            templateUrl: 'assets/scripts/ads/ads.html' 
        })
        .when('/ads/:id',{
            controller: 'AdsDetailsController',
            templateUrl: 'assets/scripts/ads-details/ads-details.html'
        })
        // .when('/profile', { 
        //     controller: 'ProfileController', 
        //     templateUrl: '' 
        // })
        // .when('/users', { 
        //     controller: 'UsersController', 
        //     templateUrl: '' 
        // })
        // .when('/companies', { 
        //     controller: 'CompaniesController', 
        //     templateUrl: '' 
        // })
        // .when('/referees', { 
        //     controller: 'RefereesController', 
        //     templateUrl: '' 
        // })
        // .when('/reports', { 
        //     controller: 'ReportsController', 
        //     templateUrl: '' 
        // })
        .otherwise({ 
            redirectTo: '/' 
        }); 
    });