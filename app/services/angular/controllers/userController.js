myApp.controller('UserCtrl', ['$scope','$http','$templateCache','$location','$timeout', function($scope,$http,$templateCache,$location,$timeout ) {
    var method = 'POST';
    var inserturl = 'http://localhost:1212/user/add';

    $scope.codeStatus = "";

    $scope.getLoggedUser = function() {
        $http.get("/checkuser").success(function (data) {
            $scope.logged_user = data.user ? data.user[0] : null;
        });
    };

    $scope.startRunLTE = function() {
        $timeout(runAdminLTE,300);
    };

    $scope.logout = function() {
        $http.get("/signout").success(function (data) {
            $scope.logged_user = null;
            $location.path('/');
        });
    };

    $scope.save = function() {
        var formData = {
            'username' : this.username,
            'password' : this.password,
            'email' : this.email
        };
        this.username = '';
        this.password = '';
        this.email = '';


        var jdata = 'mydata='+JSON.stringify(formData);

        $http({
            method: method,
            url: inserturl,
            data:  jdata ,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).
            success(function(response) {
                console.log("success");
                $scope.codeStatus = response.data;
                console.log($scope.codeStatus);

            }).
            error(function(response) {
                console.log("error");
                $scope.codeStatus = response || "Request failed";
                console.log($scope.codeStatus);
            });
        $scope.list();
        return false;
    };


    $scope.list = function() {
        var url = 'http://localhost:1212/user/list';
        $http.get(url).success(function(data) {
            if (data[0].type && data[0].type == "noitems") {
                $scope.message = "No users found";
            } else if (data[0].type) {
                $scope.error_message = data[0].type;
            } else {
                $scope.users = data;
            }

        });
    };

    $scope.list();
}]);

