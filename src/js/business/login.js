define(function() {
    return ['$scope',"BaseHttp","UserService","$location","AppConfig","$http","$rootScope","Dialog",function($scope,BaseHttp,UserService,$location,AppConfig,$http,$rootScope,Dialog){
        //查询用户国家和仓库权限回车事件
        $scope.keyPressGetCountryAuthEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.getLoginUserCountryAuth();
            }
        };
        $scope.keyPressLoginEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.login();
            }
        };
        //国家选择变更
        $scope.getWarehouseByCountryChange = function() {
            $scope.warehouseList = [];
            $.each($scope.userCountryAuthList.cdWarehouseList, function(key, row) {
                if(row.countryCode == $scope.countryCode) {
                    $scope.warehouseList.push(row);
                }
            });
        };
        //查询用户国家和仓库权限
        $scope.getLoginUserCountryAuth = function() {
            var param = {
                userName: $scope.userName,
                pwd: $scope.password,
                companyCode: $scope.companyCode
            };
            BaseHttp.post("/LoginController/getLoginUserCountryAuth", param).success(function(data){
                if(data.result) {
                    $scope.loginStatus = "success";
                    $scope.userCountryAuthList = data.result;
                }
            });
        };
        //登录
        $scope.login = function() {
            var param = {
                userName: $scope.userName,
                pwd: $scope.password,
                companyCode: $scope.companyCode,
                countryCode: $scope.countryCode,
                warehouseCode: $scope.warehouseCode
            };
            BaseHttp.post("/LoginController/login", param).success(function(data){
                if(data.result) {
                    UserService.getUserInfo();
                    $location.path('/welcome.html');
                }
            });
        };
        //重置
        $scope.reset = function() {
            $scope.userName = "";
            $scope.password = "";
            $scope.loginStatus = "initial";
            JQueryUtils.focus("userName");
        };
        var initialize = function () {
            $scope.loginStatus = "initial";
            $scope.companyCode = "GODADDY";
            JQueryUtils.focus("userName");
        };
        initialize();
    }];
});