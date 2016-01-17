define([
    'business/welcome',
    'business/login',
    'business/receive/pieces_stock_in',
    'business/storage/check_weight'
],function (
    welcome,
    login,
    pieces_stock_in,
    check_weight
    ) {
    return ['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {

        // Basic
        $routeProvider.when('/', {
            redirectTo : "/welcome.html"
        }).when('/login.html', {
            templateUrl : 'html/business/login.html',
            controller : login,
            pageConfig : {pageLevel:0}
        }).when('/welcome.html', {
            templateUrl : 'html/business/welcome.html',
            controller : welcome
        });

        // Business.StockIn
        $routeProvider.when("/receive/pieces_stock_in.html:?", {
            templateUrl : "html/business/receive/pieces_stock_in.html",
            controller : pieces_stock_in
        });

        // Business.Storage
        $routeProvider.when("/storage/check_weight.html:?", {
            templateUrl : "html/business/storage/check_weight.html",
            controller : check_weight
        });

        $routeProvider.otherwise({
            redirectTo : "/welcome.html"
        });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }];
});