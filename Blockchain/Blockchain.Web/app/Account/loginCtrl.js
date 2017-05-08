myApp.controller("loginCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
    $scope.vm.login = {};
    $scope.vm.ForgotPassword = {};
    $scope.vm.register = {};
    $scope.vm.errorMessage = "";
    $scope.vm.PasswordResetMessage = "";
    $scope.vm.successMessage = "";

    $scope.stepsModel = [];
    $scope.vm.WorldList = [];

    getWorldList();

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

    $scope.vm.loginUser = function () {
        //alert(RequestUtils.ServerPath());
        clearMessages();
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/account/login', 'POST', $scope.vm.login, function (response) {
            if (response.Status == "OK") {
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.put("_loggedInUser", JSON.stringify(response.Data), { 'expires': expireDate });
                $rootScope.identity.isAuthenticated = true;
                $http.defaults.headers.common.SessionId = response.Data.SessionId;;
                $state.go("app.dashboard");
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

    $scope.vm.forgotpassword = function () {
        clearMessages();
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/account/ForgotPassword', 'POST', $scope.vm.ForgotPassword, function (response) {
            if (response.Status == "OK") {
                $scope.vm.successMessage = "Password send to your email Id";
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

    $scope.vm.registerUser = function () {
        clearMessages();
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/account/Register', 'POST', $scope.vm.register, function (response) {
            if (response.Status == "OK") {
                $scope.vm.successMessage = response.Data.Message;
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

    //file upload
    // GET THE FILE INFORMATION.
    $scope.getFileDetails = function (e) {
        $scope.files = [];
        $scope.$apply(function () {

            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }
        });
    };

    // NOW UPLOAD THE FILES.

    // File Preview code
    $scope.imageUpload = function (event) {
        var files = event.target.files;
        $scope.stepsModel = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }

    }
    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.stepsModel.push(e.target.result);
        })
    }

    $scope.uploadFiles = function (e, event) {

        $scope.imageUpload(event);
        $scope.files = [];
        $scope.$apply(function () {

            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i]);
            }
        });

        //FILL FormData WITH FILE DETAILS.
        var data = new FormData();

        for (var i in $scope.files) {
            data.append("uploadedFile", $scope.files[i]);
        }

        // ADD LISTENERS.
        var objXhr = new XMLHttpRequest();
        objXhr.addEventListener("progress", updateProgress, false);
        objXhr.addEventListener("load", transferComplete, false);

        // SEND FILE DETAILS TO THE API.
        objXhr.open("POST", RequestUtils.ServerPath() + "/account/UploadUserPic");
        objXhr.send(data);
    }

    // UPDATE PROGRESS BAR.
    function updateProgress(e) {
        if (e.lengthComputable) {
            $("#pro").val(e.loaded);
            //document.getElementById('pro').setAttribute('value', e.loaded);
            //document.getElementById('pro').setAttribute('max', e.total);
        }
    }

    // CONFIRMATION.
    function transferComplete(e) {
        $("#pro").val(100);
        //alert("Files uploaded successfully.");
    }
    //end file upload

    function clearMessages() {
        $scope.vm.errorMessage = "";
        $scope.vm.successMessage = "";
    }
}]);