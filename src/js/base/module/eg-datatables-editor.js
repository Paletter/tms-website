/**
 * Created by Jeng on 2014/7/19.
 */
define(['base/base_config',
        'lib/datatables/datatables/js/jquery.dataTables',
        'lib/datatables/extensions/TableTools/js/dataTables.tableTools',
        'lib/datatables/extensions/Editor/js/dataTables.editor'
],function (appConfig) {
    var initialize = function(){
        angular.module("eg-datatables-editor",[]).factory({
            AppConfig:appConfig
        }).directive('datatablesEditor',['AppConfig',function(appConfig){
            return {
                link : function(scope,elem,attr,ctrl){
                    //参数预处理方法
                    var prehandle = function(){
                        datatableEditorConfig.ajax.url = appConfig.ctx + datatableEditorConfig.ajax.url + appConfig.jsonPrefix;
                    };
                    var datatableEditorConfig = eval("("+attr.datatableEditorConfig+")");
                    prehandle();
                    var config = $.extend({
                        "oLanguage": {
                            "sLengthMenu": "每页显示 _MENU_ 条记录",
                            "sZeroRecords": "抱歉， 没有找到",
                            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                            "sInfoEmpty": "没有数据",
                            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                            "oPaginate": {
                                "sFirst": "首页",
                                "sPrevious": "前一页",
                                "sNext": "后一页",
                                "sLast": "尾页"
                            }
                        },
                        //分页显示条目数
                        aLengthMenu : [10,20,50,100],
                        //分页全数字
                        sPaginationType:'full_numbers'
                    },datatableEditorConfig);
                    $(elem).on( 'click', 'tbody td:not(:first-child)', function (e) {
                        editor.inline( this );
                    } );
                    $(elem).dataTable(config);
                }
            };
        }]);
    } ;
    return {
        initialize:initialize
    };
});