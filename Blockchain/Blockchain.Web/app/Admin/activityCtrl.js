myApp.controller("activityCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.ActivityDataForTable = [];
    $scope.vm.WorldList = [];

    $scope.vm.activitylist = {
        ActWorldID: "",
        EventId: ""
    };
    $scope.vm.isEdit = false;

    if ($state.params.id != undefined) {
        $scope.vm.isEdit = true;
        editActivity();
    }

    $scope.previewFile = function () {
        previewFile();
    }

    function previewFile() {
        var preview = document.getElementById('imgActivity');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            $scope.vm.activitylist.Image = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    
    $scope.vm.getActivityList = function () {
        debugger;
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Activity/GetActivityList', 'GET', function (response) {
            if (response.Status == "OK") {
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            $scope.vm.ActivityDataForTable = response.Data;

        });
    };

    $scope.vm.saveActivity = function () {
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? '/Activity/UpdateActivity' : '/Activity/SaveActivity');
        clearMessages();
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.activitylist, function (response) {
            if (response.Status == "OK") {
                $state.go("app.Activity");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
        });
    };

    $scope.vm.copyActivity = function () {
        var url = RequestUtils.ServerPath() + '/Activity/CopyActivity';
        clearMessages();
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.activitylist, function (response) {
            if (response.Status == "OK") {
                $state.go("app.Activity");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
        });
    };

    $scope.vm.DeleteActivity = function (activity) {
        var isConfirm = confirm("Are you sure to delete?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Activity/DeleteActivityById/' + activity.ActID, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    $scope.vm.getActivityList();
                    //removeActivity(activity);
                }
                else {
                    console.log(response);
                }
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        }
    }

    $scope.vm.getWorldsList = function () {
        getWorldList();
        bindDatePickers();
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

    function editActivity() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Activity/ActivityDetails/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.activitylist = response.Data;

                $scope.vm.activitylist.ActDebug = $scope.vm.activitylist.ActDebug.toString() == 1 ? true : false;
                $scope.vm.activitylist.ActWorldID = $scope.vm.activitylist.ActWorldID.toString();
                debugger;
                $scope.vm.activitylist.EventId = $scope.vm.activitylist.EventId.toString();
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

    function removeActivity(activity) {
        angular.forEach($scope.vm.ActivityDataForTable, function (value, index) {
            if (activity == value) {
                $scope.vm.ActivityDataForTable.splice(activity, 1);
            }
        });
    }

    function getWorldList() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/world/GetWorlds', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.WorldList = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function bindDatePickers() {
        $('#inputStartDateTime').datetimepicker();
        $('#inputEndDateTime').datetimepicker();
    }
}]);