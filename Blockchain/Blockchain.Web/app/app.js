var myApp = angular.module("BlockchainApp", ["ngCookies", "ngSanitize", "ngRoute", "ngStorage", "ui.router", "angularFileUpload",'mwl.calendar', 'ngAnimate', 'ui.bootstrap',
    "angularUtils.directives.dirPagination", "ngLoadingSpinner", 'ui.select', 'ngSanitize', 'requestUtils']);

//.run(['$rootScope', '$http', "$cookies", "$state", function ($root, $http, $cookies, $state) {

//    $root.$watch(function () {
//        var loggedInUser = $cookies.get("_loggedInUser");
//        var sessionId = "";
//        if (loggedInUser != undefined) {
//            loggedInUser = JSON.parse(loggedInUser);
//            sessionId = loggedInUser.SessionId;
//        }
//        else {
//            $state.go("app.login");
//        }
//        return sessionId;
//    }, function (sessionId) {
//        $http.defaults.headers.common.SessionId = sessionId;
//    });

//}]);


myApp.controller("BlockchainCtrl", ["$scope", "$state", "RequestUtils", "$cookies", "$rootScope", "$http", function ($scope, $state, RequestUtils, $cookies, $rootScope, $http) {
    $scope.vm = this;
    $rootScope.identity = {};
    $rootScope.identity.isAuthenticated = false;


    var loggedInUser = $cookies.get("_loggedInUser");

    if (loggedInUser != undefined) {
        $rootScope.identity.isAuthenticated = true;
        loggedInUser = JSON.parse(loggedInUser);
        $http.defaults.headers.common.SessionId = loggedInUser.SessionId;
    }
    else {
        $state.go("app.login");
    }

    $scope.vm.logout = function () {
        $cookies.remove("_loggedInUser");
        $rootScope.identity.isAuthenticated = false;
        $state.go("app.login");
    }
}]);

myApp.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            template: "<ui-view></ui-view>"
        })
        .state('app.setup', {
            url: '/setup',
            abstract: true,
            template: "<ui-view></ui-view>"
        })
        .state('app.setup.admin', {
            url: '/angTest',
            cache: false,
            templateUrl: "/Home/AngularTest",
            controller: "angularTestCtrl"
        }).state('app.login', {
            url: '/login',
            cache: false,
            templateUrl: "/Account/Login",
            controller: "loginCtrl"
        }).state('app.register', {
            url: '/register',
            cache: false,
            templateUrl: "/Account/Register",
            controller: "loginCtrl"
        }).state('app.ForgotPassword', {
            url: '/ForgotPassword',
            cache: false,
            templateUrl: "/Account/ForgotPassword",
            controller: "loginCtrl"
        }).state('app.dashboard', {
            url: '/dashboard',
            cache: false,
            templateUrl: "/Dashboard/Index",
            controller: ""
        }).state('app.World', {
            url: '/World',
            cache: false,
            templateUrl: "/Admin/World",
            controller: "worldListCtrl"
        }).state('app.UserList', {
            url: '/UserList',
            cache: false,
            templateUrl: "/Admin/UserList",
            controller: "AdminCtrl"
        }).state('app.Attendees', {
            url: '/Attendees',
            cache: false,
            templateUrl: "/Admin/Attendees",
            controller: "attendeeCtrl"
        }).state('app.GenerateQR', {
            url: '/GenerateQR/:userId',
            cache: false,
            templateUrl: "/Admin/GenerateQR",
            controller: "generateQRCodeCTRL"
        }).state('app.CreateWorld', {
            url: '/CreateWorld',
            cache: false,
            templateUrl: "/Admin/CreateWorld",
            controller: "worldCreateCtrl"
        }).state('app.EditWorld', {
            url: '/EditWorld/:id',
            cache: false,
            templateUrl: "/Admin/CreateWorld",
            controller: "worldCreateCtrl"
        }).state('app.CreateUser', {
            url: '/CreateUser',
            cache: false,
            templateUrl: "/Admin/CreateUser",
            controller: "userCreateCtrl"
        }).state('app.EditUser', {
            url: '/EditUser/:id',
            cache: false,
            templateUrl: "/Admin/CreateUser",
            controller: "userCreateCtrl"
        }).state('app.Activity', {
            url: '/Activity',
            cache: false,
            templateUrl: "/Admin/Activity",
            controller: "activityCtrl"
        }).state('app.CreateActivity', {
            url: '/CreateActivity',
            cache: false,
            templateUrl: "/Admin/CreateActivity",
            controller: "activityCtrl"
        }).state('app.EditActivity', {
            url: '/EditActivity/:id',
            cache: false,
            templateUrl: "/Admin/CreateActivity",
            controller: "activityCtrl"
        }).state('app.ViewActivity', {
            url: '/ViewActivity/:id',
            cache: false,
            templateUrl: "/Admin/ViewActivity",
            controller: "activityCtrl"
        }).state('app.Leaderboard', {
            url: '/Leaderboard',
            cache: false,
            templateUrl: "/Admin/Leaderboard",
            controller: "leaderboardCtrl"
        }).state('app.CreateLeaderboard', {
            url: '/CreateLeaderboard',
            cache: false,
            templateUrl: "/Admin/CreateLeaderboard",
            controller: "leaderboardCtrl"
        }).state('app.RewardPoint', {
            url: '/RewardPoint',
            cache: false,
            templateUrl: "/Admin/RewardPoint",
            controller: "rewardPointCtrl"
        }).state('app.CreateRewardPoint', {
            url: '/CreateRewardPoint',
            cache: false,
            templateUrl: "/Admin/CreateRewardPoint",
            controller: "rewardPointCtrl"
        }).state('app.Transaction', {
            url: '/Transaction',
            cache: false,
            templateUrl: "/Admin/Transaction",
            controller: "transactionCtrl"
        }).state('app.ViewTransaction', {
            url: '/ViewTransaction',
            cache: false,
            templateUrl: "/Admin/ViewTransaction",
            controller: "transactionCtrl"
        }).state('app.UserProfile', {
            url: '/UserProfile',
            cache: false,
            templateUrl: "/Admin/UserProfile",
            controller: "userProfileCtrl"
        })

        .state('app.Item', {
            url: '/Item',
            cache: false,
            templateUrl: "/Admin/Item",
            controller: "itemCtrl"
        }).state('app.CreateItem', {
            url: '/CreateItem',
            cache: false,
            templateUrl: "/Admin/CreateItem",
            controller: "itemCtrl"
        }).state('app.EditItem', {
            url: '/EditItem/:id',
            cache: false,
            templateUrl: "/Admin/CreateItem",
            controller: "itemCtrl"
        })



        .state('app.Badge', {
            url: '/Badge',
            cache: false,
            templateUrl: "/Admin/Badges",
            controller: "badgeCtrl"
        }).state('app.CreateBadge', {
            url: '/CreateBadge',
            cache: false,
            templateUrl: "/Admin/CreateBadge",
            controller: "badgeCtrl"
        }).state('app.EditBadge', {
            url: '/EditBadge/:id',
            cache: false,
            templateUrl: "/Admin/CreateBadge",
            controller: "badgeCtrl"
        })


           .state('app.FAQ', {
               url: '/FAQ',
               cache: false,
               templateUrl: "/Admin/FAQs",
               controller: "faqCtrl"
           }).state('app.CreateFAQ', {
               url: '/CreateFAQ/:wId',
               cache: false,
               templateUrl: "/Admin/CreateFAQs",
               controller: "faqCtrl"
           }).state('app.EditFAQ', {
               url: '/EditFAQ/:id',
               cache: false,
               templateUrl: "/Admin/CreateFAQs",
               controller: "faqCtrl"
           })


          .state('app.PrivacyNote', {
              url: '/PrivacyNote',
              cache: false,
              templateUrl: "/Admin/PrivacyNotes",
              controller: "privacyNoteCtrl"
          }).state('app.CreatePrivacyNote', {
              url: '/CreatePrivacyNote/:wId',
              cache: false,
              templateUrl: "/Admin/CreatePrivacyNotes",
              controller: "privacyNoteCtrl"
          }).state('app.EditPrivacyNote', {
              url: '/EditPrivacyNote/:id',
              cache: false,
              templateUrl: "/Admin/CreatePrivacyNotes",
              controller: "privacyNoteCtrl"
          }).

        state('app.Events', {
            url: '/Events',
            cache: false,
            templateUrl: "/Admin/Events",
            controller: "eventCtrl"
        }).state('app.CreateEvent', {
            url: '/CreateEvent',
            cache: false,
            templateUrl: "/Admin/CreateEvent",
            controller: "eventCtrl"
        }).state('app.EditEvent', {
            url: '/EditEvent/:id',
            cache: false,
            templateUrl: "/Admin/CreateEvent",
            controller: "eventCtrl"
        })

        .state('app.ActivityCalender', {
            url: '/ActivityCalender',
            cache: false,
            templateUrl: "/Admin/ActivityCalendar",
            controller: "activityCalenderCtrl"
        })

        .state('otherwise', {
            url: '/',
            cache: false,
            templateUrl: "/Home/Index",
            controller: ""
            //resolve: {
            //    SessionId: 12345
            //}
        });

    $locationProvider.html5Mode(false);
}]);

