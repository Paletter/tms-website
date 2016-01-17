define(['lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
        'base/module/locales'
],function (datetimepicker,datetimepickerZh) {
    var initialize = function(){
        angular.module('eg-datetimepicker', [])

        .directive('datetimepicker',[function(){
            return {
                require:'ngModel',
                link : function(scope,elem,attr,ctrl){
                	var configDefault = {
                        	format: "yyyy-mm-dd",
                            autoclose: true,
                            todayBtn: true,
                            minView:2,
                            keyboardNavigation:true,
                            language:'zh-CN',
                            size:'sm'
                        };
                    var dateConfig = eval("("+attr.dateConfig+")");
                    var config = $.extend(configDefault,dateConfig);
                    if(config.startDate==0){
                        configDefault.startDate = new Date();
                    }
                    $(elem).datetimepicker(configDefault).on('change',function(){
                        var val = $(this).val()
                        scope.$apply(function(){
                            ctrl.$setViewValue(val);
                        });
                    });
                    if(config.size=='sm')
                    {
                        $("div.datetimepicker-days table").attr("style","height:100%; font-size:10px;");
                    }
                    
                }
            }
        }]);
    };
    return {
        initialize:initialize
    }
});