myApp.controller("worldCreateCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {
    // World Section
    $scope.vm = this;
    $scope.vm.world = {};
    $scope.vm.isEdit = false;

    if ($state.params.id != undefined) {
        editWorld();
        $scope.vm.isEdit = true;
    }
    $scope.vm.createWorld = function () {
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? "/World/UpdateWorld" : "/World/CreateWorld");
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.world, function (response) {
            if (response.Status == "OK") {
                $state.go("app.World");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function editWorld() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/World/GetWorld/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.world = response.Data;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    }
}]);