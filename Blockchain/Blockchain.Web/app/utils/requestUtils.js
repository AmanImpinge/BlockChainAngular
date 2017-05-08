angular.module('requestUtils', []).factory("RequestUtils", ["$http", "$state", function ($http, $state) {
    return {
        MakeGetCall: function (url, params, callback, errorCallback) {
            $http.get(url, {
                params: params
            }).success(function (data) {
                callback(data);
            }).error(function (data) {
                errorCallback(data);
            });
        },

        MakePostOrPutCall: function (url, method, params, callback, errorCallback) {
            $http({
                headers: { 'Content-Type': 'application/json' },
                url: url,
                method: method,
                data: params,
            }).success(function (response) {
                callback(response)
            }).error(function (response) {
                //if (response.Error.ErrorCode == 401) {
                //    $state.go("app.login");
                //}
                //else {
                errorCallback(response);
                //}
            });
        },

        ServerPath: function () {
            //return "http://localhost:50554/api";
            return "http://localhost:50555/api";
           // return "dev1.digitaltransfusion.net/blockchain/api";
        }
    }
}])
