'use strict';

var HttpProgress = require('../util/http').HttpProgress,
    Account = require('../model/account');

module.exports = function (app) {
    app
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('accounts', {
                    url: '/accounts',
                    templateUrl: '/view/accounts.html',
                    controllerAs: 'vm',
                    controller: [
                        'AuthorizedAccountService', '$state',
                        function (AuthorizedAccountService, $state) {
                            var vm = {
                                accounts: [],
                                p: new HttpProgress()
                            };

                            vm.submit = function (data) {
                                if (vm.p.$active) {
                                    return;
                                }
                                vm.p.activity();
                                AuthorizedAccountService.create(new Account(data))
                                    .then(function () {
                                        vm.p.success();
                                        $state.go($state.current, {}, {reload: true});
                                    })
                                    .catch(function (httpProblem) {
                                        vm.p.error(httpProblem);
                                        throw httpProblem;
                                    });
                            };

                            vm.refresh = function () {
                                if (vm.p.$active) {
                                    return;
                                }
                                vm.p.activity();
                                AuthorizedAccountService.list()
                                    .then(function (list) {
                                        vm.p.success();
                                        vm.accounts = list.items;
                                    })
                                    .catch(function (httpProblem) {
                                        vm.p.error(httpProblem);
                                        throw httpProblem;
                                    });
                            };
                            vm.refresh();

                            return vm;
                        }
                    ],
                    resolve: {
                        AuthorizedAccountService: [
                            'ClientStorageService', 'AccountService', function (ClientStorageService, AccountService) {
                                return ClientStorageService.get('token')
                                    .then(function (token) {
                                        return {
                                            create: AccountService.create.bind(AccountService, token),
                                            list: AccountService.list.bind(AccountService, token)
                                        };
                                    });
                            }
                        ]
                    }
                });
        }])
    ;
};
