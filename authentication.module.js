(function () {

    var app = angular.module('authentication-module', []);

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root.login', {
                name: 'login',
                url: "/login",
                views: {
                    "jumbotron": {
                        templateUrl: 'js/modules/authenticationModule/jumbotron.html'
                    },
                    "content": {
                        templateUrl: 'js/modules/authenticationModule/login.html',
                        controller: 'AuthenticationController',
                        controllerAs: 'authCtrl'
                    }
                }
            });
    }])

})();