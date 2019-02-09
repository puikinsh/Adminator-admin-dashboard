import angular from 'angular';
import ngRoute from 'angular-route';
import UserService from './shared.service';

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
        'nwAdsAdd',
        'nwProfile',
        'nwSignup',
        'nwHistory',
        'nwUserAdd',
        'nwUsers',
        'nwCompanies',
        'nwReferees',
        'nwReports',
        ngRoute
    ])
    .factory(UserService.name, UserService)
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
        .when('/ads_add', { 
            controller: 'AdsAddController', 
            templateUrl: 'assets/scripts/ads-add/ads-add.html' 
        })
        .when('/profile', { 
            controller: 'ProfileController', 
            templateUrl: 'assets/scripts/profile/profile.html' 
        })
        .when('/signup', { 
            controller: 'SignupController', 
            templateUrl: 'assets/scripts/signup/signup.html' 
        })
        .when('/history', { 
            controller: 'HistoryController', 
            templateUrl: 'assets/scripts/history/history.html' 
        })
        .when('/user_add', { 
            controller: 'UserAddController', 
            templateUrl: 'assets/scripts/user-add/user-add.html' 
        })
        .when('/users', { 
            controller: 'UsersController', 
            templateUrl: 'assets/scripts/users/users.html' 
        })
        .when('/users/:id',{
            controller: 'UserDetailsController',
            templateUrl: 'assets/scripts/user-details/user-details.html'
        })
        .when('/companies', { 
            controller: 'CompaniesController', 
            templateUrl: 'assets/scripts/companies/companies.html' 
        })
        .when('/referees', { 
            controller: 'RefereesController', 
            templateUrl: 'assets/scripts/referees/referees.html' 
        })
        .when('/reports', { 
            controller: 'ReportsController', 
            templateUrl: 'assets/scripts/reports/reports.html' 
        })
        .otherwise({ 
            redirectTo: '/' 
        }); 
    });