myApp.controller("itemCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.itemsList = [];
    $scope.vm.item = {
        ItemDeliveryMode: "",
        UserId: "",
        ItemWorldID: "",
        ItemCategory: ""
    };
    $scope.vm.isEdit = false;

    if ($state.params.id != undefined) {
        editItem();
        $scope.vm.isEdit = true;
    }

    $scope.vm.filterUserList = function () {



    };


    $scope.vm.getItemList = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/Item/GetItems", {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.itemsList = response.Data;
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
        var preview = document.getElementById('imgItem');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
            $scope.vm.item.Image = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    $scope.vm.getVendorsList = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Item/GetVendors', {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.VendorList = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }

    //$scope.vm.getWorldsList = function () {
    //    getWorldList();
    //}

    $scope.vm.createItem = function () {
        $scope.vm.item.DebugFlag = $scope.vm.item.isDebug ? 1 : 0;
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? "/Item/UpdateItem" : "/Item/CreateItem");
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.item, function (response) {
            if (response.Status == "OK") {
                $state.go("app.Item");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function editItem() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/Item/GetItem/' + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.item = response.Data;
                $scope.vm.item.UserId = response.Data.UserId.toString();
                $scope.vm.item.ItemWorldID = response.Data.ItemWorldID.toString();
                $scope.vm.item.ItemDeliveryMode = response.Data.ItemDeliveryMode.toString();
                $scope.vm.item.ItemCategory = response.Data.ItemCategory.toString();
                $scope.vm.item.isDebug = response.Data.DebugFlag == 1 ? true : false;
            }
            else {
                console.log(response);
            }
        },
        function (errorResponse) {
            console.log(errorResponse);
        });
    }

    //function getWorldList() {
    //    RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/world/GetWorlds', {}, function (response) {
    //        if (response.Status == "OK") {
    //            $scope.vm.WorldList = response.Data;
    //        }
    //        else {
    //            console.log(response);
    //        }
    //    }, function (errorResponse) {
    //        console.log(errorResponse);
    //    });
    //};

    $scope.vm.deleteItem = function(item) {
        var isConfirm = confirm("Are you sure to delete?");

        if (isConfirm) {
            RequestUtils.MakePostOrPutCall(RequestUtils.ServerPath() + '/Item/DeleteItemById/' + item.ItemID, "POST", {}, function (response) {
                if (response.Status == "OK") {
                    $scope.vm.getItemList();
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