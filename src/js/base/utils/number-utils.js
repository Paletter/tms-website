/**
 * Creator:     Jeng Tam
 * CreateDate:  2013/5/23
 * Description: 日期常用函数
 */
define(function () {
    window.NumberUtils = {
        /**
         * 数字格式 转 千分位字符格式(带小数位) 例：10000 -> 10,000.00
         */
        formatToThousandth : function(num) {
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + '.' + cents);
        },
        upDecimalValue : function(value, num) {
            if(isNaN(value) || isNaN(num)) {
                return value;
            }

            value = value * Math.pow(10, num);
            value = Math.ceil(value);
            value = value / Math.pow(10, num);
            return value;
        },
        isNotNumber : function(value) {
            return typeof value == "undefined" || isNaN(value) || StringUtils.isBlank(value + '');
        }
    };
    return window.NumberUtils;
});