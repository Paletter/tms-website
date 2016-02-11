define(['lib/ajaxfileupload/ajaxfileupload'],function (ajaxfileupload) {
    return ['AppConfig',function(AppConfig) {
        return {
            upload:function(option){
                var defaultConfig = {
                    secureuri: false,
                    dataType: 'json'
                };
                var config = angular.extend(defaultConfig,option);
                config.url = AppConfig.ctx + option.url +".json";
                config.success = function(data,status){
                    var obj = document.getElementById(option.fileElementId);
                    var isIE = document.attachEvent;
                    if(isIE){
                        obj.select();
                        document.selection.clear();
                    }else{
                        obj.value = '';
                    }
                    option.success(data,status);
                };
                $.ajaxFileUpload(config);
            }
        }
    }];
});