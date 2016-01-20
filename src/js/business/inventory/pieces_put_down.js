define(function() {
	return ['$scope',"BaseHttp","AppConfig","Dialog", function($scope,BaseHttp,AppConfig,Dialog) {
        $scope.putDownNoKeyPressEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.piecesPickDown();
            }
        };
        //包裹下架
        $scope.piecesPickDown = function() {
            Dialog.updateLoad();
        	var params = {putDownNo:$scope.putDown.putDownNo};
    		BaseHttp.post('/PiecesPutDownController/piecesPutDown',params).success(function(data) {
    			if(data.result) {
                    Dialog.remind("操作成功", {time:0.5, ok:function(){}});
                    SystemUtils.playSuccessSound();
    			}else{
                    SystemUtils.playFailureSound();
                }
                JQueryUtils.focusSelect("putDownNo");
            });
        };

        var initialize = function () {
            $scope.putDown = {};
            JQueryUtils.focus("putDownNo");
        };

        initialize();
    }];
});