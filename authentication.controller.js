/**
 * This is the controller for the Login Page
 *
 */
(function(){
    angular.module('authentication-module').controller('AuthenticationController', ['$rootScope', '$state', '$timeout', 'authenticationService', 'profileService', 'mainService', 'Notification',
        function ($rootScope, $state, $timeout, authenticationService, profileService, mainService, Notification) {

        this.credential = {};
        this.feeds = [];
        this.userAwards = [];
        this.profileAwards = [];
        this.isUserLoggedIn = false;
        this.awardsLoading = false;
        this.loading = false;
        this.feedsLoading = true;

        mainService.getFeeds().then((response) => {
            this.feeds = response.data;
        }).finally(() => { this.feedsLoading = false; });

        authenticationService.isUserLoggedIn().then((response) => {
            if (response.data) {
                this.isUserLoggedIn = true;
                authenticationService.getLoggedInUser().then((response) => {
                    this.username = response.data.username;
                    this.user = response.data;
                });
                this.loadUserData();
            }
        });

        this.login = () => {
            if (this.validateLoginFields()) {
                this.loading = true;
                authenticationService.validateLogin(this.credential).then((response) => {
                    if (!response.data.active) {
                        $state.go('root.inactive');
                    } else {
                        this.credential = {};
                        this.isUserLoggedIn = true;
                        $rootScope.$broadcast('user-login', response.data);
                        this.user = response.data;
                        this.username = response.data.username;
                        this.loadUserData();
                        var currentState = $state.$current.name;

                        if (currentState === 'root.created' || currentState === 'root.inactive' || currentState === 'root.expired'
                                || currentState === 'root.activate' || currentState === 'root.login') {
                            $state.go('root.index');
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                });
            }
        };

        $rootScope.$on('user-login', () => {
            if(this.isUserLoggedIn === true) {
                return;
            }
            this.isUserLoggedIn = true;
            authenticationService.getLoggedInUser().then((response) => {
                this.username = response.data.username;
            });
            this.loadUserData();
        });

        $rootScope.$on('user-logout', () => {
            this.isUserLoggedIn = false;
        });

        $rootScope.$on('profile-update', () => {
            profileService.retrieveProfileImage().then((response) => {
                if(response.data.base64ImageString) {
                    this.imageSrc = response.data.base64ImageString;
                }
            });
        });

        this.loadUserData = () => {
            profileService.retrieveProfileImage().then((response) => {
                if(response.data.base64ImageString) {
                    this.imageSrc = response.data.base64ImageString;
                }
            });
            this.awardsLoading = true;
            profileService.getAwardsForUser().then((response) => {
                var awards = response.data;
                this.userAwards = [];
                this.profileAwards = [];
                angular.forEach(awards, (entry) => {
                    if (entry.awardType === 'user') {
                        this.userAwards.push(entry);
                    } else if(entry.awardType === 'profile') {
                        this.profileAwards.push(entry);
                    }
                });
            }).finally(() => {
                 this.awardsLoading = false;
            });
        }

        this.validateLoginFields = () => {

            if (!this.credential.hasOwnProperty('username') || this.credential.username == "" || this.credential.username.trim() == "") {
                Notification.error("Please enter your username...");
                return false;
            }

            if (!this.credential.hasOwnProperty('password') || this.credential.password == "" || this.credential.password.trim() == "") {
                Notification.error("Please enter your password...");
                return false;
            }

            return true;
        };

    }]);
})();