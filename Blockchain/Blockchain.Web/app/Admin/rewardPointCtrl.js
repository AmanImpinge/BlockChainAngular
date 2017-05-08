myApp.controller("rewardPointCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.rewardpointDataForTable = [];
    $scope.vm.rewardpointlist = {};

    $scope.vm.getRewardPointList = function () {
        //RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Activity/GetActivityList', 'GET', function (response) {
        //    if (response.Status == "OK") {
        //    }
        //    else {
        //        $scope.vm.errorMessage = response.Error.Message;
        //    }
        //},
        //function (response) {
        //    $scope.vm.ActivityDataForTable = response.Data;

        //});
    };

    $scope.vm.saveRewardPoint = function () {
        //var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? '/Activity/UpdateActivity' : '/Activity/SaveActivity');
        //clearMessages();
        //RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.activitylist, function (response) {
        //    if (response.Status == "OK") {
        //        $state.go("app.Activity");
        //    }
        //    else {
        //        $scope.vm.errorMessage = response.Error.Message;
        //    }
        //},
        //function (response) {
        //    console.log(response);
        //});
    };
}]);