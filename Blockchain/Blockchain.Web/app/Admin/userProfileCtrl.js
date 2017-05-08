myApp.controller("userProfileCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.UserList = [];
    $scope.vm.userTransactions = [];
    $scope.vm.userProfile = {
        UserId: ""
    };
    $scope.vm.enableAddBalance = false;

    getUserList();

    function getUserList() {
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

    $scope.vm.getBalanceAndTransactions = function () {
        clearMessages();
        getUserBalance();
        getUserTransactions();
    };

    $scope.vm.saveAmount = function () {
        var data = {
            TargetUserId: $scope.vm.userProfile.UserId,
            Amount: $scope.vm.userProfile.Balance
        }
        clearMessages();
        RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Reward/IssueReward', 'POST', data, function (response) {
            if (response.Status == "OK") {
                $scope.vm.successIssueMessage = "Balance added.";
                getUserBalance();
                getUserTransactions();
                $scope.vm.enableAddBalance = false;
            }
            else {
                $scope.vm.errorIssueMessage = response.Error.Message;
            }
        },
       function (response) {
           $scope.vm.errorIssueMessage = response.Error.Message;
           console.log(response);
       });
    }

    $scope.vm.showAddBalance = function () {
        $scope.vm.enableAddBalance = $scope.vm.enableAddBalance ? false : true;
        clearMessages();
    }

    function getUserBalance() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Reward/GetBalanceDB/' + $scope.vm.userProfile.UserId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.userProfile.Balance = response.Data.Balance;
            }
            else {
                $scope.vm.userProfile.Balance = "";
                console.log(response);
            }
        },
      function (response) {
          console.log(response);
      });
    }

    function getUserTransactions() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Transaction/GetUserTransactions/' + $scope.vm.userProfile.UserId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.userTransactions = response.Data;
            }
            else {
                console.log(response);
            }
        },
      function (response) {
          console.log(response);
      });
    }

    function clearMessages() {
        $scope.vm.successIssueMessage = "";
        $scope.vm.errorIssueMessage = "";
    }
}]);