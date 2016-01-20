define([
    'business/welcome',
    'business/login',
    'business/receive/pieces_stock_in',
    'business/storage/check_weight',
    'business/storage/pieces_manage',
    'business/inventory/pieces_put_up',
    'business/inventory/pieces_put_down'
],function (
    welcome,
    login,
    pieces_stock_in,
    check_weight,
    pieces_manage,
    pieces_put_up,
    pieces_put_down
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
        }).when("/storage/pieces_manage.html:?", {
            templateUrl : "html/business/storage/pieces_manage.html",
            controller : pieces_manage
        });

        // Business.Inventory
        $routeProvider.when('/inventory/pieces_put_up.html:?', {
            templateUrl : 'html/business/inventory/pieces_put_up.html',
            controller : pieces_put_up
        }).when('/inventory/pieces_put_down.html:?', {
            templateUrl : 'html/business/inventory/pieces_put_down.html',
            controller : pieces_put_down
        });

        $routeProvider.otherwise({
            redirectTo : "/welcome.html"
        });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }];
});