define(function() {
    return ['$scope', "BaseHttp", "AppConfig", "Dialog","$rootScope","AjaxFileUpload","PrintService", function($scope, BaseHttp, AppConfig, Dialog, $rootScope, AjaxFileUpload, PrintService) {

        //国内快递单号批量导入
        $scope.importExpressExcel = function(element) {
            Dialog.updateLoad();
            AjaxFileUpload.upload({
                url: "/ExpressController/importExpressExcel",
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
        //转运包裹批量导入模板
        $scope.printExpressImportTemplate = function() {
            PrintService.print("/ExpressController/printExpressImportTemplate");
        };

        var initialize = function () {
        };

        initialize();
    }]
});