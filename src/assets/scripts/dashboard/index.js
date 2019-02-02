import * as angular from 'angular';
import DashboardController from './controller';

angular.module('nwDashboard', [])
    .controller(DashboardController.name, DashboardController);
