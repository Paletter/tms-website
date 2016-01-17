define(['lib/art-dialog/js/dialog'
],function () {
    var initialize = function(){
        angular.module('eg-dialog', []).service('Dialog',["$timeout","$rootScope",function($timeout, $rootScope){
            return {
                /**
                 * 通用Dialog
                 * @param config
                 */
                dialog:function(config){
                    config.zIndex = 9000;
                    var d = dialog(config).width(320).showModal();
                    if(config.time) {
                        $timeout(function(){
                            d.close();
                        },config.time*1000)
                    }

                },
                /**
                 * Alert错误提示
                 * @param msg
                 * @param title
                 */
                alert: function (msg, config) {
                    var alertConfig = {
                        zIndex:9999,
                        title:"提示",
                        content: msg,
                        okValue:'确 定',
                        ok:function(){}
                    };
                    angular.extend(alertConfig,config);
                    $rootScope.dialog = this.dialog(alertConfig);
                },
                /**
                 * Confirm确认提示框
                 * @param msg
                 * @param config
                 */
                confirm:function(msg, okCallback, cancelCallBack, config){
                    config=config?config:{};
                    var alertConfig = {
                        zIndex:9999,
                        title:"确认框",
                        content: msg,
                        okValue: config.okValue?config.okValue:'确 定',
                        ok: okCallback,
                        cancelValue: config.cancelValue?config.cancelValue:'取消',
                        cancel: cancelCallBack?cancelCallBack:function(){}
                    };
                    angular.extend(alertConfig,config);
                    $rootScope.dialog = this.dialog(alertConfig);
                },
                /**
                 * 遮罩
                 * @param config
                 * @returns {*}
                 */
                load:function(msg){
                    var msg = StringUtils.isBlank(msg) ? "" : msg;
                    $rootScope.dialog = dialog({
                        zIndex:9999,
                        content:"<span class='ui-dialog-loading'></span><span>" + msg + "</span>"
                    }).width(100).height(100).showModal();
                    return $rootScope.dialog;
                },
                /**
                 * 查询操作遮罩
                 * @returns {*}
                 */
                queryLoad:function(){
                    return this.load("查询中，请稍候");
                },
                /**
                 * 更新操作遮罩
                 * @returns {*}
                 */
                updateLoad:function(){
                    return this.load("操作中，请稍候");
                },
                /**
                 * 强行关闭遮罩
                 */
                close:function(){
                    if($rootScope.dialog) $rootScope.dialog.close();
                },
                /**
                 * 提示，默认自动关闭
                 * @param msg
                 * @param config
                 */
                remind:function(msg, config){
                    config = config?config:{time:1, ok:function(){}};
                    this.alert(msg, config);
                }
            };
        }])
    };
    return {
        initialize:initialize
    }
});