define(['base/base_module',
        'route',
        'business/index'
],function(baseModule, route, indexController) {
	baseModule.initialize();

    var mainApp = angular.module('mainApp', ['ngRoute','ngBaseApp','ngCookies']);

    mainApp.controller({
        IndexController:indexController
    }).config(route).run(['$rootScope','$http','BaseHttp','UserService','$location','Dialog','$cacheFactory',function($rootScope,$http,BaseHttp,UserService,$location,Dialog,$cacheFactory){

        $rootScope.$on('$routeChangeStart', function(scope, next) {
            var pageConfig = next.$$route.pageConfig;
            $rootScope.pageConfig = angular.copy(pageConfig);

            if(!pageConfig || !pageConfig.pageLevel || pageConfig.pageLevel != 0) {
                UserService.isLogin().then(function() {
                }, function() {
                    Dialog.close();
                    if(next.$$route.originalPath != "/login.html") {
                        $rootScope.errorMessage = "请重新登录";
                    }
                    $location.path("/login.html");
                });
            }
        });

        $rootScope.cacheFactory = $cacheFactory;
        var cache = $rootScope.cacheFactory("test", {capacity: 3});
        cache.put("b", 2);
    }]);

    angular.bootstrap(document,['mainApp']);
});