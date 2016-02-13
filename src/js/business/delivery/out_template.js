define(function() {
    return ['$scope', "BaseHttp", "AppConfig", "Dialog","$rootScope","AjaxFileUpload","PrintService", function($scope, BaseHttp, AppConfig, Dialog, $rootScope, AjaxFileUpload, PrintService) {

        //包裹出库模板导入
        $scope.importDeliverPiecesExcel = function(element) {
            Dialog.updateLoad();
            AjaxFileUpload.upload({
                url: "/OutTemplateController/importDeliverPiecesExcel",
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
        //包裹出库模板
        $scope.printDeliverPiecesImportTemplate = function() {
            PrintService.fixedDownload("/OutTemplateController/printDeliverPiecesImportTemplate");
        };

        var initialize = function () {
        };

        initialize();
    }]
});