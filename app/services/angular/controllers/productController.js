myApp.controller('ProductCtrl', ['$scope','$http','$templateCache','$location', function($scope,$http,$templateCache,$location) {
    var method = 'POST';
    var inserturl = 'http://localhost:1212/product/add';

    $scope.codeStatus = "";

    $scope.save = function() {
        var formData = {
            'title' : this.title,
            'description' : this.description,
            'price' : this.email
        };
        this.title = '';
        this.description = '';
        this.price = '';


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
        var url = 'http://localhost:1212/products';
        $http.get(url).success(function(data) {
            if (data[0].type && data[0].type == "noitems") {
                $scope.message = "No products found";
            } else if (data[0].type) {
                $scope.error_message = data[0].type;
            } else {
                $scope.users = data;
            }

        });
    };

    $scope.list();
}]);

