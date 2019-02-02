import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import DashboardController from './dashboard.controller';

angular.module('nwDashboard', [ngCookies])
    .controller(DashboardController.name, DashboardController);