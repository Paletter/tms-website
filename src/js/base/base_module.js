define(['base_config',
        'base/service/base_http',
        'base/service/user_service',
        'base/service/print_service',
        'base/utils/app-utils',
        'base/module/eg-datetimepicker',
        'base/module/eg-pagination',
        'base/module/eg-dialog',
        'base/module/eg-ajaxupload',
        'base/filter/formatDate',
        'base/filter/emptyValue',
        'base/factory/ajaxfileupload_factory'
],function (baseConfig,
            baseHttp,
            userService,
            printService,
            appUtils,
            dateTimePicker,
            egPagination,
            egDialog,
            egAjaxupload,
            formatDate,
            emptyValue,
            ajaxfileuploadFactory) {

	var initialize = function(){

		dateTimePicker.initialize();
		egPagination.initialize();
		egDialog.initialize();

		angular.module('ngBaseApp', [
            'ngRoute',
            'eg-datetimepicker',
            'eg-pagination',
            'eg-dialog'
        ]).factory({
            AppUtils:appUtils,
	    	AppConfig:baseConfig,
	    	egAjaxupload:egAjaxupload,
	    	AjaxFileUpload:ajaxfileuploadFactory
	    }).filter({
            formatDate:formatDate,
            emptyValue:emptyValue
        }).service({
	        BaseHttp:baseHttp,
            PrintService:printService,
            UserService:userService
	    });
	}
    return {
    	initialize:initialize
    }
});