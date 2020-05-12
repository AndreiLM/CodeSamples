(function() {
    angular.module('authentication-module').factory('authenticationService', ['$http', function ($http) {

        return {
            validateLogin: function (credential) {
                return $http.post('authentication/login', credential);
            },
            logout: function() {
                return $http.post('authentication/logout');
            },
            isUserLoggedIn: function() {
                return $http({
                    method: 'GET',
                    url: 'authentication/user/logged',
                    transformResponse: function(data) {
                        return data === "true";
                    }
                });
            },
            getLoggedInUser: function() {
                return $http.get('authentication/user');
            },
            parseFeed: function (url) {
                return $http.get("https://almochitchat.wordpress.com/feed/");
            }
        }
    }]);
})();