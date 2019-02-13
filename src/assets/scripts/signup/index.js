'use strict';

import * as angular from 'angular';
import ngCookies from 'angular-cookies';
import SignupController from './signup.controller';
import SignupService from './signup.service';

angular.module('nwSignup', [ngCookies])
    .controller(SignupController.name, SignupController)
    .factory(SignupService.name, SignupService);