define(function () {
	'use strict';
    return ['$http','AppConfig','Dialog',"$location","$rootScope",function($http,AppConfig,Dialog,$location,$rootScope) {
        this.get = function (url, config) {
            var optionConfig = config || {};
            if(url.indexOf(AppConfig.ctx) == -1) {
                url = AppConfig.ctx + url + ".json";
            }
            return $http.get(url,optionConfig).success(successApply).error(errorApply);
        };
        this.post = function(url, params, config){
            var optionConfig = config || {};
            if(url.indexOf(AppConfig.ctx) == -1) {
                url = AppConfig.ctx + url + ".json";
            }
            return $http.post(url,params,optionConfig).success(successApply).error(errorApply);
        };

        var successApply = function(data,status){
            Dialog.close();

            // Link success
            if(status == 200) {
                // Business error
                if(data.status == 1) {
                    Dialog.alert(data.msg ? data.msg : "操作失败");
                }

                // System error
                if(data.status == 2) {
                    Dialog.alert(data.msg ? "系统错误，请联系管理员：" + data.msg : "系统错误，请联系管理员");
                }

                // Login statu error
                if(data.status == 3) {
                    $rootScope.errorMessage = "请重新登录";
                    $location.path("/login.html");
                }
            }
        };
        var errorApply = function(data,status){
            Dialog.close();
            return this;
        };
    }];
});