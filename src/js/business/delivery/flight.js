define(function() {
    return ['$scope','$location',"BaseHttp","$http","$routeParams","AppConfig","Dialog","$rootScope","$location","PrintService",
        function($scope,$location,BaseHttp,$http,$routeParams,AppConfig, Dialog, $rootScope,$location,PrintService) {
            $scope.pageInfoInitial = function() {
                $scope.pgPageInfo = {pageNum:1, pageSize:20};
            };
            //查询航班信息
            $scope.searchFlightList = function() {
                $scope.pageInfoInitial();
                $scope.queryFlightList();
            };
            $scope.queryFlightList = function() {
                Dialog.queryLoad();
                var params = $scope.queryParams;
                params.pageInfo = $scope.pgPageInfo;
                BaseHttp.post("/FlightController/queryFlightList", params).success(function(data){
                    $scope.flightList = data.result;
                    $scope.pgPageInfo = data.pageInfo;
                    $scope.pgPageInfo.loadData = $scope.queryFlightList;
                });
            };
            //新增航班
            $scope.addFlight = function() {
                $scope.currentFlight = {};
                $scope.showFlightModal();
            };
            $scope.saveNewFlight = function() {
                if($scope.validateFlight($scope.currentFlight)) {
                    Dialog.updateLoad();
                    var param = $scope.currentFlight;
                    BaseHttp.post("/FlightController/addFlight", param).success(function(data){
                        if(data.result) {
                            Dialog.remind("操作成功");
                            $scope.cancelFlightModal();
                            $scope.searchFlightList();
                        }
                    });
                }
            };
            $scope.validateFlight = function(param){
                if(StringUtils.isBlank(param.mawbCode)) {
                    Dialog.alert('主单号不能为空',{ok:function(){}});
                    return false;
                }
                if(StringUtils.isBlank(param.sectorLabel)) {
                    Dialog.alert('航班号不能为空',{ok:function(){}});
                    return false;
                }
                if(StringUtils.isBlank(param.origPort)) {
                    Dialog.alert('始发站不能为空',{ok:function(){}});
                    return false;
                }
                if(StringUtils.isBlank(param.destPort)) {
                    Dialog.alert('目的站不能为空',{ok:function(){}});
                    return false;
                }
                if(StringUtils.isBlank(param.etd)) {
                    Dialog.alert('ETD不能为空',{ok:function(){}});
                    return false;
                }
                if(StringUtils.isBlank(param.eta)) {
                    Dialog.alert('ETA不能为空',{ok:function(){}});
                    return false;
                }
                var surplusDay = DateUtils.getSurplusDays(DateUtils.getDateByDateString(param.etd),DateUtils.getDateByDateString(param.eta));
                if(surplusDay < 0) {
                    Dialog.alert('ETD不能大于ETA',{ok:function(){}});
                    return
                }
                return true;
            };
            //编辑航班
            $scope.editFlight = function(index){
                $scope.currentFlight = angular.copy($scope.flightList[index]);
                $scope.currentFlight.etd = DateUtils.getDateString(new Date($scope.currentFlight.etd));
                $scope.currentFlight.eta = DateUtils.getDateString(new Date($scope.currentFlight.eta));
                $scope.showFlightModal();
            };
            $scope.updateFlight = function() {
                if($scope.validateFlight($scope.currentFlight)) {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmSectorId = $scope.currentFlight.tmSectorId;
                    params.mawbCode = $scope.currentFlight.mawbCode;
                    params.sectorCode = $scope.currentFlight.sectorCode;
                    params.sectorLabel = $scope.currentFlight.sectorLabel;
                    params.flightCode = $scope.currentFlight.flightCode;
                    params.origPort = $scope.currentFlight.origPort;
                    params.destPort = $scope.currentFlight.destPort;
                    params.etd = $scope.currentFlight.etd;
                    params.eta = $scope.currentFlight.eta;
                    BaseHttp.post("/FlightController/updateFlight", params).success(function(data){
                        if(data.result) {
                            Dialog.remind("操作成功");
                            $scope.cancelFlightModal();
                            $scope.searchFlightList();
                        }
                    });
                }
            };
            //删除航班
            $scope.deleteFlight = function(index) {
                Dialog.confirm("是否要删除航班?",function() {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmSectorId = $scope.flightList[index].tmSectorId;
                    params.sectorCode = $scope.flightList[index].sectorCode;
                    BaseHttp.post("/FlightController/deleteFlight", params).success(function (data) {
                        if (data.result) {
                            Dialog.remind("操作成功");
                            $scope.searchFlightList();
                        }
                    });
                });
            };
            //查询分箱信息
            $scope.searchFlightUnitInfo = function(index) {
                $scope.currentFlight = angular.copy($scope.flightList[index]);
                $scope.showUnitModal();
                $scope.queryUnitInfo();
            };
            $scope.queryUnitInfo = function() {
                Dialog.queryLoad();
                $scope.unitList = {};
                BaseHttp.get("/FlightController/queryFlightUnitList", {params:{tmSectorId:$scope.currentFlight.tmSectorId}}).success(function (data) {
                    if (data.result) {
                        $scope.unitList = data.result.tmUnitList;
                    }
                });
            };
            //手动新增麻袋
            $scope.saveNewUnit = function() {
                if(!$scope.newUnitLabelNo) {
                    Dialog.alert("操作失败，麻袋号输入错误");
                    return;
                }

                Dialog.updateLoad();
                var unitLabel = $scope.currentFlight.mawbCode + "-" + $scope.newUnitLabelNo;
                var params = {};
                params.tmSectorId = $scope.currentFlight.tmSectorId;
                params.sectorCode = $scope.currentFlight.sectorCode;
                params.unitLabel = unitLabel;
                params.mawbCode = $scope.currentFlight.mawbCode;
                BaseHttp.post("/FlightController/addUnit", params).success(function(data){
                    if(data.result) {
                        $scope.newUnitLabelNo = '';
                        $scope.queryUnitInfo();
                    }
                });
            };
            //自动新增分箱
            $scope.saveNewUnitSelf = function() {
                Dialog.updateLoad();
                var params = {};
                params.tmSectorId = $scope.currentFlight.tmSectorId;
                params.sectorCode = $scope.currentFlight.sectorCode;
                params.mawbCode = $scope.currentFlight.mawbCode;
                BaseHttp.post("/FlightController/autoAddUnit", params).success(function(data){
                    if(data.result) {
                        $scope.queryUnitInfo();
                    }
                });
            };
            //删除分箱
            $scope.deleteUnit = function(index) {
                Dialog.confirm("是否要删除分箱?",function() {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmUnitId = $scope.unitList[index].tmUnitId;
                    BaseHttp.post("/FlightController/deleteUnit", params).success(function (data) {
                        if (data.result) {
                            Dialog.remind("操作成功");
                            $scope.queryUnitInfo();
                        }
                    });
                });
            };
            //打印全部分箱标签
            $scope.printAllUnitLabelOfSector = function() {
                var unitIdList = [];
                $.each($scope.unitList, function(key, row) {
                    unitIdList.push(row.tmUnitId);
                });
                var unitIdListJsonParam = JSON.stringify(unitIdList);
                PrintService.print("/FlightController/printUnitLabelList?unitIdList=" + unitIdListJsonParam);
            };
            //打印选择的分箱标签
            $scope.printSelectedUnitLabel = function() {
                var unitIdList = [];
                $.each($scope.unitList, function(key, row) {
                    if(row.checked == 1) unitIdList.push(row.tmUnitId);
                });
                if(unitIdList.length == 0) {
                    Dialog.alert("操作失败，请先勾选麻袋");
                    return;
                }
                var unitIdListJsonParam = JSON.stringify(unitIdList);
                PrintService.print("/FlightController/printUnitLabelList?unitIdList=" + unitIdListJsonParam);
            };
            //跳转到货物装包页面
            $scope.redirectToPackGoods = function(index) {
                var currentUnitLabel = $scope.unitList[index].unitLabel;
                $scope.cancelUnitModal();
                $location.path("/delivery/pack_goods.html").search("unitLabel=" + currentUnitLabel);
            };
            //航班出运
            $scope.shippingFlight = function(index) {
                Dialog.confirm("是否要更新航班状态?", function() {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmSectorId = $scope.flightList[index].tmSectorId;
                    params.sectorCode = $scope.flightList[index].sectorCode;
                    BaseHttp.post("/FlightController/shippingFlight", params).success(function(data) {
                        if(data.result) {
                            Dialog.remind("操作成功");
                            $scope.searchFlightList();

                            BaseHttp.post("/FlightController/updatePiecesToShippingOfFlight", params).success(function(data) {});
                        }
                    });
                });
            };
            //航班起飞
            $scope.upperFlight = function(index) {
                Dialog.confirm("是否要更新航班状态?", function() {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmSectorId = $scope.flightList[index].tmSectorId;
                    params.sectorCode = $scope.flightList[index].sectorCode;
                    BaseHttp.post("/FlightController/upperFlight", params).success(function(data) {
                        if(data.result) {
                            Dialog.remind("操作成功");
                            $scope.searchFlightList();

                            BaseHttp.post("/FlightController/updatePiecesToUpperOfFlight", params).success(function(data) {});
                        }
                    });
                });
            };
            //航班到达
            $scope.arriveFlight = function(index) {
                Dialog.confirm("是否要更新航班状态?", function() {
                    Dialog.updateLoad();
                    var params = {};
                    params.tmSectorId = $scope.flightList[index].tmSectorId;
                    params.sectorCode = $scope.flightList[index].sectorCode;
                    BaseHttp.post("/FlightController/arriveFlight", params).success(function(data) {
                        if(data.result) {
                            Dialog.remind("操作成功");
                            $scope.searchFlightList();

                            BaseHttp.post("/FlightController/updatePiecesToArriveOfFlight", params).success(function(data) {});
                        }
                    });
                });
            };

            //查询机场基础信息
            $scope.queryAllPort = function() {
                BaseHttp.post('/CommonBasicInfoController/queryAllPort').success(function(data){
                    $scope.portList = data.result;
                });
            };

            //小窗口
            $scope.showFlightModal = function() {
                $("#flightModal").modal("show");
            };
            $scope.cancelFlightModal = function() {
                $scope.currentFlight = {};
                $("#flightModal").modal("hide");
            };
            $scope.showUnitModal = function() {
                $scope.newUnitLabelNo = '';
                $("#unitModal").modal("show");
            };
            $scope.cancelUnitModal = function() {
                $scope.currentSector = {};
                $scope.unitList = {};
                $scope.newUnitLabelNo = '';
                $("#unitModal").modal("hide");
            };

            var initialize = function () {
                $scope.queryParams = {};
                $scope.pageInfoInitial();

                $scope.queryParams.flyStatus = "NOT_FLY";
                $scope.searchFlightList();

                $scope.queryAllPort();
            };
            initialize();
        }];
});