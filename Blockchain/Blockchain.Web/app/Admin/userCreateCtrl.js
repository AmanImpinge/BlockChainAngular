myApp.controller("userCreateCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.isEdit = false;
    $scope.vm.WorldList = [];
    $scope.vm.register = {
        AUUserClass: "",
        AUWorldID: "",
        ASBizAreaID: "",
        ASOfficeID: ""
    };

    $scope.vm.isChangePwd = false;
    $scope.vm.changePwdError = "";
    $scope.vm.changePwdSuccess = "";
    $scope.vm.changePwd = {};

    if ($state.params.id != undefined) {
        editUser();
        $scope.vm.isEdit = true;
    }

    getWorldList();
    getAreas();
    getOffices();

    function getWorldList() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/World/GetWorlds', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.WorldList = response.Data;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    };
    $scope.vm.createUser = function () {
        clearMessages();
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? '/User/UpdateUserProfile' : '/account/Register');

        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.register, function (response) {
            if (response.Status == "OK") {
                $state.go("app.UserList");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
            $scope.vm.errorMessage = response.Error.Message;
        });
    }

    function editUser() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/User/GetUserById/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.register = response.Data;
                $scope.vm.register.AUWorldID = response.Data.AUWorldID.toString();
                $scope.vm.register.AUUserClass = response.Data.AUUserClass.toString()

                $scope.vm.register.BizAreaID = response.Data.BizAreaID.toString()
                $scope.vm.register.ASOfficeID = response.Data.ASOfficeID.toString()

            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }

    $scope.vm.showChangePwd = function () {
        $scope.vm.isChangePwd = $scope.vm.isChangePwd ? false : true;
        clearMessages();
    }
    $scope.vm.changePassword = function () {
        clearMessages();
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + "/account/ChangePassword", 'POST', $scope.vm.changePwd, function (response) {
            if (response.Status == "OK") {
                $scope.vm.changePwdSuccess = response.Data.Message;
                $scope.vm.changePwd = {};
            }
            else {
                $scope.vm.changePwdError = response.Error.Message;
            }
        },
        function (response) {
            console.log(response);
            $scope.vm.changePwdError = response.Error.Message;
        });
    }

    $scope.previewFile = function () {
        previewFile();
    }

    function clearMessages() {
        $scope.vm.errorMessage = "";
        $scope.vm.successMessage = "";
        $scope.vm.changePwdSuccess = "";
        $scope.vm.changePwdError = "";
    }

    function previewFile() {
        var preview = document.getElementById('imgProfile');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            $scope.vm.register.ProfilePic = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function getAreas() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/User/GetAreas', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.Areas = response.Data;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function getOffices() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/User/GetOffices', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.Offices = response.Data;
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