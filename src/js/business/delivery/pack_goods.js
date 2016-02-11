define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog","AppUtils","$routeParams", function($scope,BaseHttp,AppConfig, Dialog, AppUtils, $routeParams) {

        $scope.unitLabelKeyPressQueryEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.getUnitDetail();
            }
        };
        $scope.packNoKeyPressQueryEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.packConsignmentToUnit();
            }
        };
        //获取麻袋信息
        $scope.getUnitDetail = function() {
            $scope.unitModel.packNo = "";
            $scope.unit = {};
            $scope.unitCsmList = [];
            $scope.totalChargedWeight = 0;
            $scope.totalActualWeight = 0;
            $scope.totalQty = 0;

            if($scope.unitModel.unitLabel == "" || $scope.unitModel.unitLabel == null) {
                SystemUtils.playFailureSound();
                Dialog.alert("麻袋号不能为空。",{ok:function(){}, time:3});
                return;
            }

            Dialog.queryLoad();
            var param = {unitLabel:$scope.unitModel.unitLabel};
            BaseHttp.get("/PackGoodsController/queryUnitAndCsmInfo", {params: param}).success(function(data) {
                if(data.result) {

                    $scope.unit = data.result.tmUnit;
                    $scope.unitCsmList = data.result.unitCsmList;

                    $.each($scope.unitCsmList, function(key, row) {
                        if(!row.actualWeight) {
                            SystemUtils.playFailureSound();
                            Dialog.alert("操作失败。分单" + row.piecesNo + "没有称重，请确认");
                        }
                        $scope.totalActualWeight += row.actualWeight;
                    });

                    $scope.totalQty = $scope.unitCsmList.length;
                    JQueryUtils.focus("packNo");
                }
            });

        };
        //运单装包/取消装包
        $scope.packConsignmentToUnit = function() {
            if(!$scope.unit || $scope.unit.tmUnitId == null) {
                SystemUtils.playFailureSound();
                Dialog.alert("操作失败。麻袋信息错误");
                return;
            }

            if(!$scope.unitModel.unitLabel || $scope.unitModel.unitLabel == "" || $scope.unitModel.unitLabel == null) {
                SystemUtils.playFailureSound();
                Dialog.alert("操作失败。麻袋号不能为空");
                return;
            }

            if(!$scope.unitModel.packNo || $scope.unitModel.packNo == "" || $scope.unitModel.packNo == null) {
                SystemUtils.playFailureSound();
                Dialog.alert("操作失败。运单号不能为空");
                return;
            }

            var isCsmNoInUnit = $scope.isCsmNoInUnit($scope.unitModel.packNo);

            //包裹打包入麻袋
            if(isCsmNoInUnit) {
                $scope.doPackCsmInUnit();
            }

            //包裹取出麻袋
            if(!isCsmNoInUnit) {
                Dialog.confirm("是否将包裹从麻袋中取出", function(){
                    Dialog.updateLoad();
                    var param = {tmUnit:$scope.unit, packNo:$scope.unitModel.packNo};
                    BaseHttp.post("/PackGoodsController/packCsmOutUnit", param).success(function(data) {
                        if(data.result){
                            var packCsm = data.result;
                            $scope.removePackOutCsm(packCsm.piecesNo);
                            $scope.totalActualWeight = $scope.totalActualWeight - packCsm.actualWeight;
                            $scope.totalQty = $scope.totalQty - 1;
                            $scope.unitModel.packNo = "";
                            SystemUtils.playSuccessSound();
                        } else {
                            SystemUtils.playFailureSound();
                        }
                    });
                },function(){
                    $scope.unitModel.packNo = "";
                });
            }
        };
        $scope.isCsmNoInUnit = function(packNo) {
            var isNoInUnit = true;
            $.each($scope.unitCsmList, function(key, csm) {
                if(csm.piecesNo == packNo) {
                    isNoInUnit = false;
                    return;
                }
            });
            return isNoInUnit;
        };
        $scope.doPackCsmInUnit = function() {
            Dialog.updateLoad();
            var param = {tmUnit:$scope.unit, packNo:$scope.unitModel.packNo};
            BaseHttp.post('/PackGoodsController/packCsmInUnit', param).success(function(data) {
                if(data.result) {
                    SystemUtils.playSuccessSound();

                    var packCsm = data.result;
                    $scope.unitCsmList.push(packCsm);
                    $scope.totalActualWeight = $scope.totalActualWeight + packCsm.actualWeight;
                    $scope.totalQty = $scope.totalQty + 1;
                    $scope.unitModel.packNo = "";
                } else {
                    SystemUtils.playFailureSound();
                    $scope.unitModel.packNo = "";
                }
            });
        };
        $scope.removePackOutCsm = function(packOutPiecesNo) {
            var index;
            $.each($scope.unitCsmList, function(key, csm) {
                if(csm.piecesNo == packOutPiecesNo) {
                    index = key;
                    return;
                }
            });
            $scope.unitCsmList.splice(index, 1);
        };

        var initialize = function () {
            $scope.unitModel = {};

            JQueryUtils.focus("unitLabel");

            if(!StringUtils.isBlank($routeParams.unitLabel)) {
                $scope.unitModel.unitLabel = $routeParams.unitLabel;
                $scope.getUnitDetail();
            }
        };

        initialize();
    }];
});