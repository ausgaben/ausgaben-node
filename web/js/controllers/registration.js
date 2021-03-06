'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Registration = require('../model/registration');

module.exports = function (app) {
    app
        .controller(
        'RegistrationController',
        [
            'RegistrationService', 'ClientStorageService', '$state',
            function (RegistrationService, ClientStorageService, $state) {
                var vm = {};

                vm.p = new HttpProgress();

                vm.submit = function (data) {
                    if (vm.p.$active) {
                        return;
                    }
                    vm.p.activity();
                    RegistrationService.create(new Registration(data))
                        .then(function (token) {
                            vm.p.success();
                            return ClientStorageService.set('token', token);
                        })
                        .then(function () {
                            $state.go('accounts');
                        })
                        .catch(function (httpProblem) {
                            vm.p.error(httpProblem);
                            throw httpProblem;
                        });
                };

                return vm;
            }
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('register', {
                    url: '/register',
                    templateUrl: '/view/registration.html',
                    controller: 'RegistrationController',
                    controllerAs: 'vm'
                });
        }])
    ;
};

