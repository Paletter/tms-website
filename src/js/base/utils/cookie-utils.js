define(['base/utils/string-utils'],function (StringUtils) {
    window.CookieUtils = {
        getCookie : function(){
            var cookieArray = document.cookie.split(";");
            var cookie = {};
            for(var i=0; i<cookieArray.length; i++){
                var cookieArr = cookieArray[i].split("=");
                var cookieKey = cookieArr.length > 0 ? StringUtils.leftTrim(cookieArr[0]):null;
                var cookieValue = cookieArr.length > 1 ? StringUtils.leftTrim(cookieArr[1]):null;
                if(cookieKey){
                    cookie[cookieKey] = cookieValue;
                }
            }
            return cookie;
        }
    };
    return window.CookieUtils;
});