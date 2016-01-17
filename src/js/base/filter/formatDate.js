/**
 * Created by Jeng on 2014/8/27.
 * 过滤器：日期格式化
 * 可选日期类型：
 */
define(function () {
    return [function(){
        return function(dateTime, format){
            // 根据浏览器自动转换为当前时区
            var dateTimeTimeZoneOffset = new Date(dateTime).getTime();
            var timezoneOffset = (new Date().getTimezoneOffset()) * 60000;
            if(dateTime != null && dateTime != undefined) {
                if(format == "dateTime"){
                    return DateUtils.getDateTimeString(new Date(dateTimeTimeZoneOffset-timezoneOffset));
                }else if(format == "date"){
                    return DateUtils.getDateString(new Date(dateTimeTimeZoneOffset-timezoneOffset));
                }
            }else{
                return dateTime;
            }
        }
    }];
});