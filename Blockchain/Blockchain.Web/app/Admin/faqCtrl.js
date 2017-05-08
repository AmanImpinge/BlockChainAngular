myApp.controller("faqCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.isEdit = false;
    $scope.vm.showAddFAQ = false;

    $scope.vm.FAQ = {
        Text: ""
    };

    if ($state.params.id != undefined) {
        editFAQ();
        $scope.vm.isEdit = true;
    }

    if ($state.params.wId != undefined) {
        $scope.vm.FAQ.WorldId = $state.params.wId.toString();
    }


    $scope.vm.getFAQ = function () {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/FAQ/GetFAQ", {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.FAQ = response.Data;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        })
    };

    $scope.vm.createFAQ = function () {
        console.log($scope.vm.FAQ);
        $scope.vm.FAQ.Text = CKEDITOR.instances.FaqEditor.getData();
        $scope.vm.FAQ.Debug = $scope.vm.FAQ.Debug ? 1 : 0;
        $scope.vm.FAQ.Active = $scope.vm.FAQ.Active ? 1 : 0;
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? "/FAQ/UpdateFAQs" : "/FAQ/CreateFAQs");
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.FAQ, function (response) {
            if (response.Status == "OK") {
                $state.go("app.FAQ");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function editFAQ() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/FAQ/GetFAQ/" + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                setTimeout(function () {
                    CKEDITOR.instances['FaqEditor'].setData(response.Data.Text);
                }, 400)
                $scope.vm.FAQ.WorldId = response.Data.WorldId.toString();
                $scope.vm.FAQ.Id = response.Data.Id;
                $scope.vm.FAQ.Debug = response.Data.Debug == 1 ? true : false;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }

    $scope.vm.initEditor = function () {
        CKEDITOR.replace('FaqEditor', {
            pluginsLoaded: function (evt) {
                var doc = CKEDITOR.document, ed = evt.editor;
                if (!ed.getCommand('bold'))
                    doc.getById('exec-bold').hide();
                if (!ed.getCommand('link'))
                    doc.getById('exec-link').hide();
            }
        })
    }

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

    $scope.vm.loadWorldFaq = function () {
        $scope.vm.showAddFAQ = false;
        $scope.vm.FAQ.Text = "";
        if ($scope.vm.worldId == undefined) {
            return;
        }
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/FAQ/GetWorldFAQ/' + $scope.vm.worldId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.FAQ = response.Data;
            }
            else {
                console.log(response);
                if (response.Error.ErrorCode == 404) {
                    $scope.vm.showAddFAQ = true;
                }
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }
}]);