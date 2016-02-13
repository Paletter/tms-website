define(function () {
    return ["$http", "$rootScope", "AppConfig", function ($http, $rootScope, AppConfig) {
        this.print = function (url) {

            if(!$rootScope.printMode || $rootScope.printMode == "download") {
                window.location.href = AppConfig.ctx + url;
            }

            if($rootScope.printMode && $rootScope.printMode == "print") {
                var wholeUrl = url;
                if(url.indexOf(AppConfig.ctx) == -1) {
                    wholeUrl = AppConfig.ctx + url;
                }
                wholeUrl = AppConfig.ServicePath + wholeUrl;

                $.ajax({
                    type: "GET",
                    url: "http://localhost:8080/oso-printer/PrintServlet",
                    dataType: "jsonp",
                    data: {sessionId: $rootScope.loginUser.sessionId, url: wholeUrl},
                    success: function(data) {
                        console.log(data);
                    }
                });
            }
        };
        this.fixedDownload = function (url) {

            window.location.href = AppConfig.ctx + url;
        };
    }];
});