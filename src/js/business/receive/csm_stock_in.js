define(function() {
    return ['$scope', "BaseHttp", "AppConfig", "Dialog", "$rootScope", "$routeParams", "PrintService", "$timeout", "$location", "AjaxFileUpload",
    function($scope, BaseHttp, AppConfig, Dialog, $rootScope, $routeParams, PrintService, $timeout, $location, AjaxFileUpload) {
        //物流号改变事件
        $scope.logisticsNoChange = function() {
            var logisticsNo = $scope.piecesResultVo.logisticsNo.toUpperCase();
            $scope.piecesResultVo = {};
            $scope.piecesResultVo.logisticsNo = logisticsNo;

            $scope.isNotSearchPieces = true;
        };
        //会员编号改变
        $scope.memberCodeChange = function() {
            $scope.piecesResultVo.memberCode = $scope.piecesResultVo.memberCode.toUpperCase();
        };
        //回车事件
        $scope.keyPressQueryEvent = function(event) {
            if(event.keyCode == "13") {
                if($scope.piecesResultVo.logisticsNo.indexOf("GNC") == 0) {
                    Dialog.alert("操作失败。不可扫描GNC码");
                    return;
                }
                $scope.dellogisticsNoPreCode();
                $scope.queryPiecesInfo();
            }
        };
        $scope.keyPressEventOfActualWeight = function(event) {
            if(event.keyCode == "13") {
                JQueryUtils.blur("acturalWeight");
                JQueryUtils.focusSelect("shipperName");
            }
        };
        $scope.keyPressStockInEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.stockInAndPrintSmallLabel();
            }
        };
        //物流号格式化
        $scope.dellogisticsNoPreCode = function() {
            if($scope.piecesResultVo.logisticsNo) {
                $scope.delNum($scope.piecesResultVo.logisticsNo, "42011214");
                $scope.delNum($scope.piecesResultVo.logisticsNo, "42019804");
                $scope.delNum($scope.piecesResultVo.logisticsNo, "42019720");
            }
        };
        $scope.delNum = function(num, str) {
            var index = num.indexOf(str);
            if(index == 0) {
                $scope.piecesResultVo.logisticsNo = num.replace(str,"");
            }
        };
        //查询包裹信息
        $scope.queryPiecesInfo = function() {
            if($scope.piecesResultVo.logisticsNo) {
                Dialog.queryLoad();

                var inputLogisticsNo = $scope.piecesResultVo.logisticsNo;
                $scope.piecesResultVo = {};
                $scope.piecesResultVo.logisticsNo = inputLogisticsNo;
                var strIndex = inputLogisticsNo.indexOf("(");
                if(strIndex > 0) inputLogisticsNo = inputLogisticsNo.substr(0, strIndex);

                var params = {referenceNo:inputLogisticsNo};
                BaseHttp.post("/CsmStockInController/queryStockedCsmPiecesInfo", params).success(function(data) {
                    $scope.isNotSearchPieces = false;
                    if(data.result) {

                        var resultPieces = data.result;

                        if(resultPieces.tmPiecesId) {
                            $scope.piecesResultVo = resultPieces;
                            $scope.csmResultVo = resultPieces.stockedCsmResultVo;
                            JQueryUtils.focus("acturalWeight");
                        } else {
                            $scope.piecesResultVo = {};
                            $scope.piecesResultVo.logisticsNo = inputLogisticsNo;
                            JQueryUtils.focus("acturalWeight");
                        }
                    }
                });
            }
        };
        //点击按钮入库
        $scope.clickBtnStockIn = function() {
            Dialog.confirm("是否提交数据，并打印", function() {
                $scope.stockInAndPrintSmallLabel();
            });
        };
        //包裹入库，打印小标签
        $scope.stockInAndPrintSmallLabel = function() {
            if(!$scope.stockInValidate()) {
                return;
            }

            $scope.piecesResultVo.logisticsNo = $scope.piecesResultVo.logisticsNo.toUpperCase();

            Dialog.updateLoad();
            var param = {};
            angular.copy($scope.csmResultVo, param);
            param.tmPiecesId = $scope.piecesResultVo.tmPiecesId;
            param.referenceNo = $scope.piecesResultVo.logisticsNo;
            param.memberCode = $scope.piecesResultVo.memberCode;
            param.length = $scope.piecesResultVo.length;
            param.width = $scope.piecesResultVo.width;
            param.height = $scope.piecesResultVo.height;
            param.actualWeight = $scope.piecesResultVo.actualWeight;
            param.volumeWeight = $scope.piecesResultVo.volumeWeight;
            param.memo = $scope.piecesResultVo.memo;
            BaseHttp.post("/CsmStockInController/csmStockIn", param).success(function(data){
                if(data.result) {
                    var normalStockInResultVo = data.result;
                    $scope.piecesResultVo.tmPiecesId = normalStockInResultVo.tmPiecesId;

                    var param = {referenceNo:normalStockInResultVo.referenceNo};
                    BaseHttp.post("/CsmStockInController/queryStockedCsmPiecesInfo",param).success(function(data2) {
                        if(data2.result) {
                            var resultPieces = data2.result;
                            $scope.piecesResultVo = resultPieces;

                            JQueryUtils.focusSelect("logisticsNo");
                        }
                    });

                    $scope.printPiecesStorageLabel();

                    JQueryUtils.focusSelect("logisticsNo");
                }
            });
        };
        $scope.stockInValidate = function() {
            if($scope.isNotSearchPieces) {
                Dialog.alert("请先查询该物流单号包裹信息，再进行入库打印。", {ok:function() {}, time:4});
                return false;
            }
            if(!$scope.piecesResultVo.logisticsNo) {
                Dialog.alert("物流单号不能为空。", {ok:function() {}, time:4});
                return false;
            }
            if($scope.piecesResultVo.actualWeight == null || $scope.piecesResultVo.actualWeight == 0 || NumberUtils.isNotNumber($scope.piecesResultVo.actualWeight)) {
                Dialog.alert("重量不正确，请输入真实的称重重量。", {ok:function() {}});
                return false;
            }
            return true;
        };
        //计算体积重
        $scope.calculateVolumeWeight = function(){
            if(NumberUtils.isNotNumber($scope.piecesResultVo.length) || NumberUtils.isNotNumber($scope.piecesResultVo.width) || NumberUtils.isNotNumber($scope.piecesResultVo.height)) {
                Dialog.alert("长、宽、高输入错误，请输入正确的数值");
                return;
            }

            var length = $scope.piecesResultVo.length;
            var width = $scope.piecesResultVo.width;
            var height = $scope.piecesResultVo.height;

            var volumeWeight = (length * width * height / $rootScope.UnitsConfig.volumeWeightBase).toFixed(20);

            volumeWeight = NumberUtils.upDecimalValue(volumeWeight, 2);
            if(volumeWeight == 0 && (length > 0 || width > 0 || height > 0)) {
                volumeWeight = 0.01;
            }

            $scope.piecesResultVo.volumeWeight = volumeWeight;
            $("#volumeWeightModal").modal("hide");
        };
        //打印入库标签
        $scope.printPiecesStorageLabel = function() {
            PrintService.print("/PiecesStockInController/printPiecesStorageLabel?tmPiecesId=" + $scope.piecesResultVo.tmPiecesId);
        };
        //运单批量导入
        $scope.importStockCsmExcel = function(element) {
            Dialog.updateLoad();
            AjaxFileUpload.upload({
                url: "/CsmStockInController/importStockCsmExcel",
                fileElementId: element.id,
                success: function (data){
                    Dialog.close();
                    if(data.result) {
                        Dialog.remind("操作成功")
                    } else {
                        if(data.msg) {
                            Dialog.alert(data.msg);
                        } else {
                            Dialog.alert("操作失败");
                        }
                    }
                }
            });
        };
        //运单批量导入模板
        $scope.printStockCsmImportTemplate = function() {
            PrintService.fixedDownload("/CsmStockInController/printStockCsmImportTemplate");
        };

        //小窗口
        $scope.showVolumeWeightModal = function() {
            $scope.copyTmPieces = angular.copy($scope.piecesResultVo);
            $("#volumeWeightModal").modal("show");
            JQueryUtils.focus("length");
        };
        $scope.cancelVolumeWeightModal = function() {
            $scope.piecesResultVo = $scope.copyTmPieces;
            $("#volumeWeightModal").modal("hide");
        };

        var initialize = function () {
            $scope.piecesResultVo = {};
            $scope.isNotSearchPieces = true;
            JQueryUtils.focus("logisticsNo");

            if(!StringUtils.isBlank($routeParams.logisticsNo)) {
                $scope.piecesResultVo.logisticsNo = $routeParams.logisticsNo;
                $scope.dellogisticsNoPreCode();
                $scope.queryPiecesInfo();
            }
        };

        initialize();
    }];
});