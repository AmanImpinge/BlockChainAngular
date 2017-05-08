myApp.controller("attendeeCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.attendees = [];
    getAttendees();
    $scope.vm.Name = "test";
    $scope.vm.attendee = {};

    $scope.vm.changeUserStatus = function (attendee, status) {
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + "/User/ChangeUserStatus/" + attendee.AUID + "/" + status, "POST", {}, function (response) {
            if (response.Status == "OK") {
                attendee.AUAcctStatus = status;
            }
            else {
                console.log(response);
            }
        },
           function (errorResponse) {
               console.log(errorResponse);
           });
    }

    function getAttendees() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/User/GetAttendee", {}, function (response) {
            debugger;
            if (response.Status == "OK") {
                $scope.vm.attendees = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        })
    }
}]);