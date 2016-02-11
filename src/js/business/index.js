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
        //变更打印/下载模式
        $scope.changePrintMode = function(mode) {
            $rootScope.printMode = mode;
        };
        //隐藏菜单（响应模式）
        $scope.hideMenu = function() {
            $("#menu").removeClass("in");
        };
        var initialize = function(){
            $rootScope.screenWidth = $(window).innerWidth() > 0 ? $(window).innerWidth() : $(screen)[0].width;
        };
        initialize();
    }];
});