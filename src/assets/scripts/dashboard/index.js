import * as angular from 'angular';
import DashboardController from './dashboard.controller';


angular.module('nwDashboard', [])
    .controller(DashboardController.name, DashboardController);
