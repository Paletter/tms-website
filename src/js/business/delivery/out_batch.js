define(function() {
    return ['$scope','$location',"BaseHttp","$http","$routeParams","AppConfig","Dialog","$rootScope","$location","PrintService",
        function($scope,$location,BaseHttp,$http,$routeParams,AppConfig, Dialog, $rootScope,$location,PrintService) {

            $scope.pageInfoInitial = function() {
                $scope.pgPageInfo = {pageNum:1, pageSize:20};
            };
            //查询批次信息
            $scope.searchOutBatchList = function() {
                $scope.pageInfoInitial();
                $scope.queryOutBatchList();
            };
            $scope.queryOutBatchList = function() {
                Dialog.queryLoad();
                var params = $scope.queryParams;
                params.pageInfo = $scope.pgPageInfo;
                BaseHttp.post("/OutBatchController/queryOutBatchList", params).success(function(data){
                    $scope.outBatchList = data.result;
                    $scope.pgPageInfo = data.pageInfo;
                    $scope.pgPageInfo.loadData = $scope.queryOutBatchList;
                });
            };
            //新增批次
            $scope.addOutBatch = function() {
                Dialog.updateLoad();
                BaseHttp.post("/OutBatchController/addOutBatch").success(function(data){
                    if(data.result) {
                        Dialog.remind("操作成功");
                        $scope.searchOutBatchList();
                    }
                });
            };
            //批次出仓
            $scope.deliverOutBatch = function(index) {
                Dialog.updateLoad();
                var params = {};
                params.tmOutBatchId = $scope.outBatchList[index].tmOutBatchId;
                BaseHttp.post("/OutBatchController/deliverOutBatch", params).success(function(data){
                    if(data.result) {
                        Dialog.remind("操作成功");
                        $scope.searchOutBatchList();

                        BaseHttp.post("/OutBatchController/deliverPieces", params).success(function(data){});
                    }
                });
            };

            var initialize = function () {
                $scope.queryParams = {};
                $scope.pageInfoInitial();
            };
            initialize();
        }];
});