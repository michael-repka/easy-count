myApp.controller('CategoryCtrl', ['$scope','$http','$templateCache','$location', function($scope,$http,$templateCache,$location) {
    var method = 'POST';
    var inserturl = 'http://localhost:1212/category/add';

    $scope.codeStatus = "";

    $scope.getCategories = function() {
        var url = 'http://localhost:1212/categories';
        $http.get(url).success(function(data) {
            if (data[0].type && data[0].type == "noitems") {
                $scope.message = "No categories found";
            } else if (data[0].type) {
                $scope.error_message = data[0].type;
            } else {
                $scope.categories = data;
            }

        });
    };

    $scope.save = function() {
        var formData = {
            'title' : this.title,
            'description' : this.description,
            'parent' : this.parent
        };
        this.title = '';
        this.description = '';
        this.parent = '';


        var jdata = 'mydata='+JSON.stringify(formData);

        $http({
            method: method,
            url: inserturl,
            data:  jdata ,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).
            success(function(response) {
                console.log("category saved");
                $scope.codeStatus = response.data;
                console.log($scope.codeStatus);

            }).
            error(function(response) {
                console.log("error saving category");
                $scope.codeStatus = response || "Request failed";
                console.log($scope.codeStatus);
            });

        return false;
    };

}]);

