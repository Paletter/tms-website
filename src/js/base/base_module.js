/**
 * Created by Jeng on 2014/5/9.
 */
define(['base_config',
        'base/service/base_http',
        'base/utils/app-utils',
        'base/module/eg-datetimepicker',
        'base/module/eg-pagination',
        'base/module/eg-dialog',
        'base/filter/formatDate',
        'base/module/eg-ajaxupload',
        'base/factory/ajaxfileupload_factory',
        'base/service/user_service',
        'base/service/print_service'
],function (baseConfig, baseHttp, appUtils, dateTimePicker, egPagination, egDialog, formatDate, egAjaxupload, ajaxfileuploadFactory, UserService, PrintService) {
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
            formatDate:formatDate
        }).service({
	        BaseHttp:baseHttp,
            PrintService:PrintService,
            UserService:UserService
	    });
	}
    return {
    	initialize:initialize
    }
});