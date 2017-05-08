myApp.controller("worldListCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {
    // World Section
    $scope.vm = this;
    $scope.vm.worlds = [];
    getWorldList();

    function getWorldList() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/World/GetWorlds', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.worlds = response.Data;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    };
}]);