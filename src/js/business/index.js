define(function () {
    return ['$scope','BaseHttp','$rootScope',"Dialog","$location",function($scope,BaseHttp,$rootScope,Dialog,$location){
        //登出
        $scope.logout = function(){
            Dialog.confirm('是否要退出系统?',function(){
                BaseHttp.post('/LoginController/logout').success(function(){
                    $rootScope.loginUser = {};
                    $location.path("/login.html");
                }).error(function() {
                    $rootScope.loginUser = {};
                    $location.path("/login.html");
                });
            })
        };
        $scope.changePrintMode = function(mode) {
            $rootScope.printMode = mode;
        };
        var initialize = function(){

        };
        initialize();
    }];
});