define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog", function($scope,BaseHttp,AppConfig,Dialog) {

        $scope.locCodeKeyPressEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.getPiecesInfoOnLocCode();
            }
        };
        $scope.putNoKeyPressEvent = function(event) {
            if(event.keyCode == "13") {
                $scope.piecesPickUp();
            }
        };
        //输入格式校验
        $scope.isValidLocCode = function(verifyCode) {
            var matchResult = verifyCode.match(new RegExp("-", "g"));
            return matchResult && (matchResult.length==3 || matchResult.length==2);
        };
        $scope.isValidCsmNo = function(verifyCode) {
        	return verifyCode.indexOf("1") == 0;
        };
        $scope.isValidPiecesNo = function(verifyCode) {
        	return verifyCode.indexOf("P") == 0;
        };
        //取到货位上的包裹信息
        $scope.getPiecesInfoOnLocCode = function() {
        	$scope.wmLocation = {};
        	$scope.wmLocationCurrentList = [];

            Dialog.queryLoad();
        	$scope.putUp.locCode = $scope.putUp.locCode.toUpperCase();
            var params = {locCode:$scope.putUp.locCode};
        	BaseHttp.get("/PiecesPutUpController/queryLocationInfo",{params:params}).success(function(data) {
        		if(data.result) {
        			$scope.wmLocation = data.result.wmLocation;
        			$scope.wmLocationCurrentList = data.result.wmLocationCurrentList;

                    SystemUtils.playSuccessSound();
                    JQueryUtils.focusSelect("putUpNo");
        		} else {
                    SystemUtils.playFailureSound();
                    JQueryUtils.focusSelect("locCode");
        		}
        	});
        };
        //包裹上架
        $scope.piecesPickUp = function() {
        	if(!$scope.putUp.putUpNo 
        	   || (!$scope.isValidLocCode($scope.putUp.putUpNo)
        	   && !$scope.isValidCsmNo($scope.putUp.putUpNo)
        	   && !$scope.isValidPiecesNo($scope.putUp.putUpNo))) {
        		   
        		Dialog.remind("操作失败。上架号错误");
                JQueryUtils.focusSelect("putUpNo");
                SystemUtils.playFailureSound();
                return;
        	}
        	
        	$scope.putUp.putUpNo = $scope.putUp.putUpNo.toUpperCase();
        	
        	//变更库位号
        	if($scope.isValidLocCode($scope.putUp.putUpNo)) {
        		$scope.putUp.locCode = $scope.putUp.putUpNo;
                $scope.putUp.putUpNo = "";
                $scope.getPiecesInfoOnLocCode();
                return;
        	}
        	if(!$scope.putUp.locCode || !$scope.isValidLocCode($scope.putUp.locCode)) {
        		Dialog.remind("操作失败。库位号不正确");
                JQueryUtils.focusSelect("locCode");
                SystemUtils.playFailureSound();
                return;
        	}
        	//上架
        	if($scope.isValidCsmNo($scope.putUp.putUpNo) || $scope.isValidPiecesNo($scope.putUp.putUpNo)) {
                Dialog.updateLoad();
        		var params = {wmLocation:$scope.wmLocation, putUpNo:$scope.putUp.putUpNo};
                BaseHttp.post('/PiecesPutUpController/piecesPutUp', params).success(function(data) {
                    if (data.result) {
                        SystemUtils.playSuccessSound();
                        
                    	$scope.putUp.locCode = $scope.putUp.locCode.toUpperCase();
                        var params = {locCode:$scope.putUp.locCode};
                        BaseHttp.get('/PiecesPutUpController/queryLocationInfo',{params:params}).success(function(data) {
                        	if(data.result) {
                    			$scope.wmLocation = data.result.wmLocation;
                    			$scope.wmLocationCurrentList = data.result.wmLocationCurrentList;

                                JQueryUtils.focusSelect("putUpNo");
                    		}
                        });
                    } else {
                        SystemUtils.playFailureSound();
                    }

                    JQueryUtils.focusSelect("putUpNo");
                });
        	}
        };
        
        var initialize = function () {
            $scope.putUp = {};
            JQueryUtils.focusSelect("locCode");
        };

        initialize();
    }];
});