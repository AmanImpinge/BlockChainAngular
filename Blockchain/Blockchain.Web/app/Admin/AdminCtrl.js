myApp.controller("AdminCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.UserList = [];
    $scope.vm.WorldList = [];
    $scope.vm.World = {};

    $scope.vm.GetUserList = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Admin/GetUserList', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.UserList = response.Data;
            }
            else {
                console.log(response);
            }
        },
        function (response) {
            console.log(response);
        });
    };

    $scope.vm.changeUserStatus = function (user, status) {
        var isConfirm = confirm("Are you sure to " + (status == 1 ? "DeActivate" : "Activate") + "?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + "/User/ChangeUserStatus/" + user.AUID + "/" + status, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    user.AUAcctStatusId = status;
                    user.AUAcctStatus = status == 0 ? "AccountInactive" : "AccountActive";
                }
                else {
                    console.log(response);
                }
            },
               function (errorResponse) {
                   console.log(errorResponse);
               });
        }
    }

    $scope.vm.DeleteUser = function DeleteUser(user) {

        var isConfirm = confirm("Are you sure to delete?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/User/DeleteUserById/' + user.AUID, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    $scope.vm.GetUserList();
                }
                else {
                    console.log(response);
                }
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        }
    }

}]);