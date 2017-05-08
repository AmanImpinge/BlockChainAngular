myApp.controller("eventCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.event = {};
    $scope.vm.isEdit = false;

    if ($state.params.id != undefined) {
        $scope.vm.isEdit = true;
        editEvent();
    }

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

    $scope.vm.saveEvent = function () {

        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? '/Event/UpdateEvent' : '/Event/SaveEvent');
        clearMessages();

        $scope.vm.event.DebugFlag = $scope.vm.event.IsDebug ? 1 : 0;
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.event, function (response) {
            if (response.Status == "OK") {
                $state.go("app.Events");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
            $scope.vm.errorMessage = response.Error.Message;
        });
    };

    $scope.vm.worldList = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/world/GetWorlds', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.Worlds = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };


    $scope.vm.deleteEvent = function (event) {
        var isConfirm = confirm("Are you sure to delete?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Event/DeleteEvent/' + event.Id, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    removeEvent(event);
                }
                else {
                    console.log(response);
                }
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        }
    }

    function editEvent() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Event/GetEvent/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                
                $scope.vm.event = response.Data;
                $scope.vm.event.IsDebug = $scope.vm.event.DebugFlag == 1 ? true : false;
                $scope.vm.event.WorldId = $scope.vm.event.WorldId.toString();
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    }

    function clearMessages() {
        $scope.vm.errorMessage = "";
        $scope.vm.successMessage = "";
    }

    function removeEvent(activity) {
        angular.forEach($scope.vm.Events, function (value, index) {
            if (activity.Id == value.Id) {
                $scope.vm.Events.splice(index, 1);
            }
        });
    }
}]);