myApp.controller("generateQRCodeCTRL", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.attendee = {};

    getAttendeeDetails();
    getAttendeeQRCode();

    $scope.vm.generateQRCode = function () {
        generateQRCode();
    }    

    function getAttendeeDetails(userId) {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/User/GetUserById/" + $state.params.userId, {}, function (response) {
            $scope.vm.attendee = response.Data;
        }, function (errorResponse) {

        })
    }

    function getAttendeeQRCode() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/User/GetUserQRCode/" + $state.params.userId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.qrImageString = "data:image/png;base64," + response.Data.ImageString;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }

    function generateQRCode() {
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + "/User/GenerateQRCode/" + $state.params.userId, "POST", {}, function (response) {
            debugger;
            $scope.vm.qrImageString = "data:image/png;base64," + response.Data;
        },
            function (errorResponse) {
                console.log(errorResponse);
                //throw new ExceptionInformation(errorResponse);
            });
    }
}]);