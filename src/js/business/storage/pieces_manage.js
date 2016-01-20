define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog","$routeParams","$rootScope","PrintService",function($scope,BaseHttp,AppConfig,Dialog,$routeParams,$rootScope,PrintService) {
    	//回车查询事件
    	$scope.keyPressSearcherEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.searchPiecesList();
            }
        };
    	$scope.pageInfoInitial = function() {
            $scope.pgPageInfo = {pageNum:1, pageSize:20};
        };
        //查询分单信息
        $scope.searchPiecesList = function() {
        	$scope.pageInfoInitial();
        	$scope.piecesList = [];
        	$scope.queryPiecesList();
        };
        $scope.queryPiecesList = function() {
            Dialog.queryLoad();
        	var params = $scope.queryParams;
        	params.pageInfo = $scope.pgPageInfo;
            BaseHttp.post('/PiecesManageController/queryPiecesList', params).success(function(data){
                $scope.piecesList = data.result;
                $scope.pgPageInfo = data.pageInfo;
                $scope.pgPageInfo.loadData = $scope.queryPiecesList;
            });
        };
        //查询包裹明细
        $scope.queryPiecesDetail = function(index) {
            Dialog.queryLoad();
            $scope.piecesDetail = {};
            $scope.currentPieces = $scope.piecesList[index];
            var params = {piecesNo: $scope.piecesList[index].piecesNo};
            BaseHttp.get('/PiecesManageController/queryPiecesDetailInfos', {params:params}).success(function(data){
                if(data.result){
                    $scope.piecesDetail = data.result;
                    $scope.showPiecesDetailModal();
                }
            });
        };
        //打印入库标签
        $scope.printPiecesLabel = function(index){
            PrintService.print("/PiecesStockInController/printPiecesStorageLabel?tmPiecesId=" + $scope.piecesList[index].tmPiecesId);
        };

        //小窗口
        $scope.showPiecesDetailModal = function() {
            $("#piecesDetailModal").modal("show");
        };
        $scope.cancelPiecesDetailModal = function() {
            $scope.piecesDetail = {};
            $("#piecesDetailModal").modal("hide");
        };

        var initialize = function () {
        	$scope.queryParams = {};
        	$scope.pageInfoInitial();

            if(!StringUtils.isBlank($routeParams.piecesNo)) {
                $scope.queryParams.piecesNo = $routeParams.piecesNo;
                $scope.searchPiecesList();
            }
        };
        initialize();
    }]
});