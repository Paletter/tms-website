/**
 * Creator:     Jeng Tam
 * CreateDate:  2013/5/23
 * Description: 日期常用函数
 */
define(function () {
    window.DateUtils = {
        /**
         * 获取当前时间的(YYYY-MM-DD HH:MI:SS) 字符格式 new Date -> YYYY-MM-DD HH:MI:SS
         */
        getCurrentDateTimeString : function() {
            var date = new Date();
            var str;
            str = this.getCurrentDateString() + " " + date.getHours() + ":"
                + date.getMinutes() + ":" + date.getSeconds();
            return str;
        },
        /**
         * 获取当前时间的(YYYY-MM-DD) 字符格式 new Date -> YYYY-MM-DD
         */
        getCurrentDateString : function() {
            var date = new Date();
            var str;
            str = date.getFullYear() + "-" + (date.getMonth() + 1<10?"0"+(date.getMonth() + 1):date.getMonth() + 1) + "-" + (date.getDate()<10?"0"+date.getDate():date.getDate());
            return str;
        },
        /**
         * 获取当前时间的(YYYY-MM) 字符格式 new Date -> YYYY-MM
         */
        getCurrentYearAndMonthString : function() {
            var date = new Date();
            var str;
            str = date.getFullYear() + "-" + (date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1);
            return str;
        },
        /**
         * 日期对象转(YYYY-MM-DD HH:MI:SS) 字符格式 Date -> YYYY-MM-DD HH:MI:SS
         */
        getDateTimeString : function(date) {
            return date.getFullYear() + "-" + (date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1) + "-" + (date.getDate()<10?"0"+date.getDate():date.getDate()) + " " + date.getHours() + ":"
                + date.getMinutes() + ":" + date.getSeconds();
        },
        /**
         * 日期对象转(YYYY-MM-DD) 字符格式 Date -> YYYY-MM-DD
         */
        getDateString : function(date) {
            return date.getFullYear() + "-" + (date.getMonth()+1<10?"0"+(date.getMonth()+1):date.getMonth()+1) + "-" + (date.getDate()<10?"0"+date.getDate():date.getDate());
        },
        /**
         * 日期对象转(YYYY-MM) 字符格式 Date -> YYYY-MM
         */
        getYearAndMonthString : function(date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1);
        },
        /**
         * 日期字符转日期对象 YYYY-MM-DD -> Date
         */
        getDateByDateString : function(dateStr) {
            var regEx = new RegExp("\\-", "gi");
            dateStr = dateStr.replace(regEx, "/");
            var retDate = new Date(dateStr);
            //retDate.setMonth(retDate.getMonth()+1); //此处月份加1会导致实际结果增加一个月
            return retDate;
        },
        /**
         * 截止日期 减 起始日期，返回剩余天数 (Date - Date) return days;
         */
        getSurplusDays : function(startDate, endDate) {
            return (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
        },
        /**
         * 根据指定(正负)天数,获取之前或之后的(YYYY-MM-DD)日期字符串
         */
        getBeforeOrAfterCurrentDateString : function(days) {
            var date = new Date();
            if (!days) {
                days = 0;
            }
            date = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
            return this.getDateString(date);
        },
        /**
         * 获取时间戳流水号
         * @returns {*}
         */
        getCurrentDateTimeStamp : function(){
            var str = this.getCurrentDateTimeString();
            var reg = new RegExp("\\-","gi");
            var regs = new RegExp("\\:","gi");
            return str.replace(reg,"").replace(regs,"").replace(/[ ]/g, "");
        }
    };
    return window.DateUtils;
});