define(function() {
	return ['$scope', "BaseHttp", "AppConfig", "Dialog", "$rootScope", "$routeParams","PrintService", function($scope, BaseHttp, AppConfig, Dialog, $rootScope, $routeParams, PrintService) {
        //回车事件
        $scope.queryKeypressEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.queryConsignmentInfo();
            }
        };
        $scope.keyPressSaveKernelEventForKernelWeight = function(event) {
            if(event.keyCode == "13") {
                JQueryUtils.blur("kernelWeight");
                $scope.saveKernelWeight();
            }
        };
        //获取包裹详细信息
        $scope.queryConsignmentInfo = function() {
            $scope.freight = "";
            $scope.consignment = {};

            if(!$scope.queryParam.queryNo) {
                return;
            }

            Dialog.queryLoad();
            var params = {queryNo:$scope.queryParam.queryNo};
            BaseHttp.post("/CheckWeightController/queryPieces", params).success(function(data){
                if(data.result) {
                    $scope.consignment = data.result;

                    $scope.queryParam.queryNo = '';
                    $scope.kernelWeight = '';
                    $scope.kernelVolumeWeight.length = '';
                    $scope.kernelVolumeWeight.width = '';
                    $scope.kernelVolumeWeight.height = '';
                    $scope.kernelVolumeWeight.weight = '';

                    JQueryUtils.focus("kernelWeight");
                }
            });
        };
        //核重保存
        $scope.saveKernelWeight = function() {
            if(!$scope.consignment || $scope.consignment.tmConsignmentId==0) {
                Dialog.alert("请输入正确运单数据。",{ok:function(){}, time:2});
                return;
            }
            if(($scope.kernelWeight && NumberUtils.isNotNumber($scope.kernelWeight))
                || ($scope.kernelVolumeWeight.weight && NumberUtils.isNotNumber($scope.kernelVolumeWeight.weight))
                || (!$scope.kernelWeight && !$scope.kernelVolumeWeight.weight)
                || ($scope.kernelWeight == 0 && $scope.kernelVolumeWeight.weight == 0)) {

                Dialog.alert("请输入正确的核重重量。",{ok:function(){}, time:2});
                return;
            }

            Dialog.updateLoad();
            var params = {piecesNo:$scope.consignment.piecesNo
                         ,tmPiecesId:$scope.consignment.tmPiecesId
                         ,userViewNo:$scope.consignment.userViewNo
                         ,currentActionDesc:$scope.consignment.currentActionDesc
                         ,actualWeight:$scope.kernelWeight
                         ,length:$scope.kernelVolumeWeight.length
                         ,width:$scope.kernelVolumeWeight.width
                         ,height:$scope.kernelVolumeWeight.height
                         ,volumeWeight:$scope.kernelVolumeWeight.weight};

            BaseHttp.post("/CheckWeightController/checkWeight", params).success(function(data){
                if(data.result) {
                    JQueryUtils.focusSelect("queryNo");
                    Dialog.remind("操作成功");
                }
            });
        };
        //计算体积重
        $scope.calculateVolumeWeight = function(){
            if(NumberUtils.isNotNumber($scope.kernelVolumeWeight.length) || NumberUtils.isNotNumber($scope.kernelVolumeWeight.width) || NumberUtils.isNotNumber($scope.kernelVolumeWeight.height)) {
                Dialog.alert("长、宽、高输入错误，请输入正确的数值");
                return;
            }

            var length = $scope.kernelVolumeWeight.length;
            var width = $scope.kernelVolumeWeight.width;
            var height = $scope.kernelVolumeWeight.height;

            var volumeWeight = (length * width * height / $rootScope.UnitsConfig.volumeWeightBase).toFixed(20);

            volumeWeight = NumberUtils.upDecimalValue(volumeWeight, 2);
            if(volumeWeight == 0 && (length > 0 || width > 0 || height > 0)) {
                volumeWeight = 0.01;
            }

            $scope.kernelVolumeWeight.weight = volumeWeight;
            $("#kernelVolumeWeightModal").modal("hide");
        };

        //小窗口
        $scope.showKernelVolumeWeightModal = function() {
            $scope.copyKernelVolumeWeight = angular.copy($scope.kernelVolumeWeight);
            $("#kernelVolumeWeightModal").modal("show");
        };
        $scope.cancelKernelVolumeWeightModal = function() {
            $scope.kernelVolumeWeight = $scope.copyKernelVolumeWeight;
            $("#kernelVolumeWeightModal").modal("hide");
        };

        var initialize = function () {
            $scope.consignment = {};
            $scope.queryParam = {};
            $scope.kernelVolumeWeight = {};

            if(!StringUtils.isBlank($routeParams.consignmentNo)) {
                $scope.queryParam.queryNo = $routeParams.consignmentNo;
            }
            $("#queryNo").focus();
        };

        initialize();
    }];
});