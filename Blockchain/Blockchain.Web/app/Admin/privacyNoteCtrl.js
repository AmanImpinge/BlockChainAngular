myApp.controller("privacyNoteCtrl", ["$scope", "$state", "RequestUtils", function ($scope, $state, RequestUtils) {

    $scope.vm = this;
    $scope.vm.isEdit = false;
    $scope.vm.showAddPrivacy = false;

    $scope.vm.PrivacyNote = {
        Text: ""
    };

    if ($state.params.id != undefined) {
        editPrivacyNote();
        $scope.vm.isEdit = true;
    }

    if ($state.params.wId != undefined) {
        $scope.vm.PrivacyNote.WorldId = $state.params.wId.toString();
    }

    $scope.vm.createPrivacyNote = function () {
        $scope.vm.PrivacyNote.Text = CKEDITOR.instances.PrivacyNoteEditor.getData();
        $scope.vm.PrivacyNote.Debug = $scope.vm.PrivacyNote.Debug ? 1 : 0;
        $scope.vm.PrivacyNote.Active = $scope.vm.PrivacyNote.Active ? 1 : 0;
        var url = RequestUtils.ServerPath() + ($scope.vm.isEdit ? "/PrivacyNotes/UpdatePrivacyNotes" : "/PrivacyNotes/CreatePrivacyNotes");
        RequestUtils.MakePostOrPutCall(url, 'POST', $scope.vm.PrivacyNote, function (response) {
            if (response.Status == "OK") {
                $state.go("app.PrivacyNote");
            }
            else {
                $scope.vm.errorMessage = response.Error.Message;
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    };

    function editPrivacyNote() {
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/PrivacyNotes/GetPrivacyNote/" + $state.params.id, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.PrivacyNote.Id = response.Data.Id;
                setTimeout(function () {
                    CKEDITOR.instances['PrivacyNoteEditor'].setData(response.Data.Text);
                }, 400);
                $scope.vm.PrivacyNote.WorldId = response.Data.WorldId.toString();
                $scope.vm.PrivacyNote.Debug = response.Data.Debug.toString() == 1 ? true : false;
            }
            else {
                console.log(response);
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        })
    }

    $scope.vm.initEditor = function () {
        CKEDITOR.replace('PrivacyNoteEditor', {
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

    $scope.vm.loadWorldPrivacyNotes = function () {
        $scope.vm.showAddPrivacy = false;
        $scope.vm.PrivacyNote.Text = "";
        if ($scope.vm.worldId == undefined) {
            return;
        }
        RequestUtils.MakeGetCall(RequestUtils.ServerPath() + '/PrivacyNotes/GetWorldPrivacyNote/' + $scope.vm.worldId, {}, function (response) {
            if (response.Status == "OK") {
                $scope.vm.PrivacyNote = response.Data;
            }
            else {
                console.log(response);
                if (response.Error.ErrorCode == 404) {
                    $scope.vm.showAddPrivacy = true;
                }
            }
        }, function (errorResponse) {
            console.log(errorResponse);
        });
    }
}]);