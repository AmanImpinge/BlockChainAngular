myApp.controller("badgeCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.badgeList = [];
    $scope.vm.badge = {
        
        UserId: "",
        badgeWorldID: "",
        BadgeType:"",
        BadgeModifier: ""
    };
    $scope.vm.isEdit = false;

    if ($state.params.id != undefined) {
        editBadge();
        $scope.vm.isEdit = true;
    }


    $scope.vm.getBadgeList = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/Badge/GetBadges", {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.badgeList = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        })
    };


    $scope.previewFile = function () {
        previewFile();
    }

    function previewFile() {
        var preview = document.getElementById('imgBadge');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            $scope.vm.badge.Image = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    $scope.vm.getWorldsList = function () {
        getWorldList();
    }

    $scope.vm.createBadge = function () {
        $scope.vm.badge.BadgeDebug = $scope.vm.badge.isDebug ? 1 : 0;
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? "/Badge/UpdateBadge" : "/Badge/CreateBadge");
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.badge, function (response) {
            if (response.Status == "OK") {
                $state.go("app.Badge");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function editBadge() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Badge/GetBadge/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.badge = response.Data;
                $scope.vm.badge.BadgeType = response.Data.BadgeType.toString();
                $scope.vm.badge.BadgeModifier = response.Data.BadgeModifier.toString();
                $scope.vm.badge.BadgeWorldID = response.Data.BadgeWorldID.toString();
                $scope.vm.badge.isDebug = response.Data.BadgeDebug == 1 ? true : false;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
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

    $scope.vm.deleteBadge = function (badge) {
        var isConfirm = confirm("Are you sure to delete?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Badge/DeleteBadgeById/' + badge.BadgeID, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    $scope.vm.getBadgeList();
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