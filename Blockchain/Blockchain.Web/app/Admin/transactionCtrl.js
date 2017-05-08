myApp.controller("transactionCtrl", ["$scope", "$state", "$http", "RequestUtils", "$cookies", "$rootScope", function ($scope, $state, $http, RequestUtils, $cookies, $rootScope) {

    $scope.vm = this;
   // $scope.vm.VendorList = [];

    getVendorList();

    function getVendorList() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Item/GetVendors', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.VendorList = response.Data;
            }
            else {
                console.log(response);
            }
        },
         function (response) {
             console.log(response);
         });
    };

    GetAllTransactions();
    function  GetAllTransactions() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Transaction/GetAllTransactions', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.Transactions = response.Data;
            }
            else {
                console.log(response);
            }
        },
      function (response) {
          console.log(response);
      });
    };

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

    $scope.vm.getWorldsList = function () {
        getWorldList();
    }

    $scope.vm.getTransactionListByVendorId = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Transaction/GetUserTransactions/' + $scope.vm.transaction.UserId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.Transactions = response.Data;
            }
            else {
                console.log(response);
            }
        },
      function (response) {
          console.log(response);
      });
    };
}]);