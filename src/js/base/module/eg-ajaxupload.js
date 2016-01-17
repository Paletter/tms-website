/**
 * Created by Jeng on 2014/6/1.
 */
define(['lib/ajaxupload/ajaxupload'],function (ajaxupload) {
    return ['AppConfig','Dialog',function(AppConfig,Dialog) {
        return {
            upload:function(option){
            	new AjaxUpload('#'+option.id, {
        			action : option.action,
        			name : 'file1',
        			data : option.data,
        			//选择后自动开始上传
        			autoSubmit : true,
        			//返回Text格式数据
        			responseType : false,
        			//上传的时候按钮不可用
        			onSubmit : function(filename, ext) {
        				//设置允许上传的文件格式
        				if (!(ext && /^(jpg|png|jpeg|gif)$/.test(ext))) {
        					alert('未允许上传的文件格式!');
        					// cancel upload
        					return false;
        				}
        			},
        			//上传完成后取得文件名filename为本地取得的文件名，msg为服务器返回的信息
        			onComplete : function(filename, msg) {
        				$('#UL').val(msg);
        			}
        		});
            }
        }
    }];
});