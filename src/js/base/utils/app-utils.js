define(['base/utils/string-utils',
        'base/utils/number-utils',
        'base/utils/cookie-utils',
        'base/utils/browser-utils',
        'base/utils/date-utils',
        'lib/base64/base64',
        'base/utils/jquery-utils',
        'base/utils/system-utils'
],function (StringUtils, NumberUtils, CookieUtils, BrowserUtils, DateUtils, base64, JQueryUtils, SystemUtils) {
    return [function(){
        return {
            StringUtils:StringUtils,
            NumberUtils:NumberUtils,
            BrowserUtils:BrowserUtils,
            DateUtils:DateUtils,
            CookieUtils:CookieUtils,
            JQueryUtils:JQueryUtils,
            SystemUtils:SystemUtils
        }
    }];
});