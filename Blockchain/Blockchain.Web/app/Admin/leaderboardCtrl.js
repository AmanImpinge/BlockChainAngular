myApp.controller("leaderboardCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.leaderboardDataForTable = [];

    $scope.vm.leaderboardlist = {};


    $scope.vm.getEvents = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Event/GetEvents', 'GET', function (response) {
            if (response.Status == "OK") {
                $scope.vm.Events = response.Data;
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
        });
    };

    $scope.vm.getleaderboardListByEventId = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/User/GetLeaderBoardByEventId/' + $scope.vm.leaderboard.EventId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.leaderboardDataForTable = response.Data;
            }
            else {
                console.log(response);
            }
        },
       function (response) {
           console.log(response);
       });
    };

    $scope.vm.getleaderboardList = function () {
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/User/GetLeaderBoard', 'GET', function (response) {
            if (response.Status == "OK") {
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            $scope.vm.leaderboardDataForTable = response.Data;
        });
    };


    

}]);