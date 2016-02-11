define(function () {
    return ['$http','$q','BaseHttp','$rootScope',"Dialog","$location", function($http, $q,BaseHttp,$rootScope, Dialog, $location) {
        this.getUserInfo = function(){
            var deferred = $q.defer();
            BaseHttp.post('/LoginController/getCurrentUserDetail').success(function(data){
                if(data.result) {
                    setUserInfo(data.result);
                    deferred.resolve(data.result);
                }else{
                    deferred.reject(null);
                }
            }).error(function(data){
                deferred.reject(null);
            });
            return deferred.promise;
        };
        this.isLogin = function(){
            var deferred = $q.defer();
            if(StringUtils.isBlank($rootScope.loginUser)){
                BaseHttp.post('/LoginController/getCurrentUserDetail').success(function(data){
                    if(data.result) {
                        setUserInfo(data.result);
                        deferred.resolve(true);
                    }else{
                        deferred.reject(false);
                    }
                }).error(function(data){
                    deferred.reject(false);
                    $location.patch("/maintain.html");
                });
            }else{
                deferred.resolve(true);
            }
            return deferred.promise;
        };

        var setUserInfo = function(data){
            $rootScope.loginUser = data;
            $rootScope.UnitsConfig = data.cdCountryRef;
            $rootScope.currentWarehouseDesc = (data.cdWarehouse == null ? "" : data.cdWarehouse.warehouseDesc);
            $rootScope.currentWarehouseCode = (data.cdWarehouse == null ? "" : data.cdWarehouse.warehouseCode);
            if(!$rootScope.printMode) {
                $rootScope.printMode = "download";
            }
        };
    }];
});