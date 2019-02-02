import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import DashboardController from './controller';

angular.module('nwDashboard', [ngCookies])
    .controller(DashboardController.name, DashboardController);