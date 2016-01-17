/**
 * Created by Jeng on 2014/6/15.
 */
define(function () {
    window.BrowserUtils =  {
        isIE : function(){
            return window.navigator.userAgent.indexOf("MSIE") >= 0
        },
        isChrome : function(){
            return window.navigator.userAgent.indexOf("Chrome") >= 0
        },
        isFireFox : function(){
            return window.navigator.userAgent.indexOf("Firefox") >= 0;
        },
        isOpera : function(){
            return window.navigator.userAgent.indexOf("Opera") >= 0;
        },
        isSafari : function(){
            return window.navigator.userAgent.indexOf("Safari") >= 0;
        },
        getOs : function(){
            if (this.isIE()) {
                return "ie";
            }else if (this.isFireFox()) {
                return "Firefox";
            }else if(this.isChrome()){
                return "Chrome";
            }else if(this.isOpera()){
                return "Opera";
            }else if(this.isSafari()){
                return "Safari";
            }
        },
        /**
         * 获取url参数
         * @returns {Object}
         */
        getRequestParam : function(){
            var url = location.search;
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
    };
    return window.BrowserUtils;
});