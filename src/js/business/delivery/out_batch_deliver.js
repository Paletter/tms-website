define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog","AppUtils","$routeParams", function($scope,BaseHttp,AppConfig, Dialog, AppUtils, $routeParams) {

        //回车事件
        $scope.kerPressQueryPiecesInfosEvent = function(event) {
            if(event.keyCode == "13") {
                var existIndex = -1;
                var removeIndex = -1;

                var queryNo = $scope.queryParams.queryNo;
                for(index in $scope.deliveryPiecesList) {
                    var row = $scope.deliveryPiecesList[index];
                    if(queryNo == row.piecesNo && row.rowStatus == "add") {
                        existIndex = index;
                        removeIndex = index;
                        break;
                    }
                    if(queryNo == row.piecesNo && row.rowStatus == "initial") {
                        existIndex = index;
                        row.rowStatus = "remove";
                        SystemUtils.playSuccessSound();
                        JQueryUtils.focusSelect("queryNo");
                        break;
                    }
                    if(queryNo == row.piecesNo && row.rowStatus == "remove") {
                        existIndex = index;
                        row.rowStatus = "initial";
                        SystemUtils.playSuccessSound();
                        JQueryUtils.focusSelect("queryNo");
                        break;
                    }
                }

                if(existIndex == -1) {
                    $scope.queryPiecesInfo();
                }

                if(removeIndex != -1) {
                    $scope.deliveryPiecesList.splice(removeIndex, 1);
                    SystemUtils.playSuccessSound();
                    JQueryUtils.focusSelect("queryNo");
                }
            }
        };
        //查询批次包裹信息
        $scope.queryBatchPieces = function() {
            Dialog.queryLoad();
            $scope.deliveryPiecesList = [];
            var params = {};
            params.tmOutBatchId = $scope.tmOutBatchId;
            params.outBatchNo = $scope.outBatchNo;
            BaseHttp.post("/OutBatchDeliverController/queryBatchPieces", params).success(function(data) {
                if(data.result) {
                    $scope.deliveryPiecesList = data.result.deliverPiecesRowVoList;
                }
            });
        };
        //查询包裹信息
        $scope.queryPiecesInfo = function() {
            Dialog.queryLoad();
            var params = {queryNo: $scope.queryParams.queryNo};
            BaseHttp.post("/OutBatchDeliverController/queryDeliverPieces", params).success(function(data) {
                if(data.result) {
                    var deliveryPieces = data.result.deliverPiecesRowVo;
                    deliveryPieces.rowStatus = "add";
                    $scope.deliveryPiecesList.push(deliveryPieces);

                    JQueryUtils.focusSelect("queryNo");
                    SystemUtils.playSuccessSound();
                } else {
                    SystemUtils.playFailureSound();
                }
            });
        };
        //保存包裹进批次
        $scope.packPiecesInBatch = function() {
            Dialog.updateLoad();
            var params = {};
            params.tmOutBatchId = $scope.tmOutBatchId;
            params.outBatchNo = $scope.outBatchNo;
            params.deliverPiecesVoList = $scope.deliveryPiecesList;
            BaseHttp.post("/OutBatchDeliverController/packPiecesInOutBatch", params).success(function(data) {
                if(data.result) {
                    Dialog.remind("操作成功");
                    SystemUtils.playSuccessSound();
                    $scope.queryParams.queryNo = "";
                    JQueryUtils.focusSelect("queryNo");

                    $scope.queryBatchPieces();
                }
            });
        };

        var initialize = function () {
            $scope.outBatchNo = $routeParams.outBatchNo;
            $scope.tmOutBatchId = $routeParams.tmOutBatchId;
            $scope.outBatchStatus = $routeParams.status;
            $scope.queryBatchPieces();

            JQueryUtils.focus("queryNo");
        };

        initialize();
    }];
});