define(function () {
	'use strict';
    return ['$http','AppConfig',function($http,appConfig) {
        this.http = function(url, params, callback, config){
            var realUrl = appConfig.mockRoot() + url;
            var optionConfig = config||{};
            if('GET' == optionConfig.method){
                optionConfig.params = params;
                return $http.get(realUrl,optionConfig).success(function (data) {
                    callback(data);
                });
            }else if('POST' == optionConfig.method){
                if(optionConfig.paramType == 'form'){
                    optionConfig.transformRequest = function(obj){
                        var str = [];
                        for(var p in obj){
                            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                        }
                        return str.join('&');
                    };
                }
                return $http.post(realUrl,params,optionConfig).success(function (data) {
                    callback(data);
                });
            }
        };
        this.get = function (url, params, callback, config) {
            var optionConfig = config || {};
            optionConfig.method = "GET";
            this.http(url, params, callback, optionConfig);
        };
        this.post = function(url, params, callback, config){
            var optionConfig = config || {};
            optionConfig.method = "POST";
            this.http(url, params, callback, optionConfig);
        };
        this.query = function (url, params, callback, config) {
            this.post(url, params, callback,config);
        };
        this.update = function (url, params, callback, config) {
            if(!params){
                return;
            }
            var optionConfig = config || {};
            optionConfig.error = optionConfig.error || function(data,status){
                alert("修改失败");
            };
            return this.post(url, params, callback, optionConfig);
        };
        this.add = function (url, params, callback, config){
            if(!params){
                return;
            }
            var optionConfig = config || {};
            optionConfig.error = optionConfig.error || function(data,status){
                alert("新增失败");
            };
            return this.post(url, params, callback, optionConfig);
        };
        this.remove = function (url, params, callback, config) {
            if(!params){
                return;
            }
            var optionConfig = config || {};
            optionConfig.error = optionConfig.error || function(data,status){
                alert("删除失败");
            };
            return this.get(url, params, callback, optionConfig);
        };
    }];
});