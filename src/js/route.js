define([
    'business/welcome',
    'business/login',
    'business/receive/pieces_stock_in',
    'business/receive/csm_stock_in',
    'business/storage/check_weight',
    'business/storage/pieces_manage',
    'business/inventory/pieces_put_up',
    'business/inventory/pieces_put_down',
    'business/delivery/flight',
    'business/delivery/pack_goods',
    'business/delivery/out_batch',
    'business/delivery/out_batch_deliver',
    'business/delivery/out_template',
    'business/other/express',
    'business/basic/user',
    'business/basic/role'
],function (
    welcome,
    login,
    pieces_stock_in,
    csm_stock_in,
    check_weight,
    pieces_manage,
    pieces_put_up,
    pieces_put_down,
    flight,
    pack_goods,
    out_batch,
    out_batch_deliver,
    out_template,
    express,
    user,
    role
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
        }).when('/maintain.html', {
            templateUrl : 'html/template/maintain.html',
            pageConfig : {pageLevel:0}
        });
        // Business.StockIn
        $routeProvider.when("/receive/pieces_stock_in.html:?", {
            templateUrl : "html/business/receive/pieces_stock_in.html",
            controller : pieces_stock_in
        }).when("/receive/csm_stock_in.html:?", {
            templateUrl : "html/business/receive/csm_stock_in.html",
            controller : csm_stock_in
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
        // Business.Delivery
        $routeProvider.when('/delivery/flight.html:?', {
            templateUrl : 'html/business/delivery/flight.html',
            controller : flight
        }).when('/delivery/pack_goods.html:?', {
            templateUrl : 'html/business/delivery/pack_goods.html',
            controller : pack_goods
        }).when('/delivery/out_batch.html:?', {
            templateUrl : 'html/business/delivery/out_batch.html',
            controller : out_batch
        }).when('/delivery/out_batch_deliver.html:?', {
            templateUrl : 'html/business/delivery/out_batch_deliver.html',
            controller : out_batch_deliver
        }).when('/delivery/out_template.html:?', {
            templateUrl : 'html/business/delivery/out_template.html',
            controller : out_template
        });
        // Business.Other
        $routeProvider.when('/other/express.html:?', {
            templateUrl : 'html/business/other/express.html',
            controller : express
        });
        // Business.Basic
        $routeProvider.when('/basic/user.html:?', {
            templateUrl : 'html/business/basic/user.html',
            controller : user
        }).when('/basic/role.html:?', {
            templateUrl : 'html/business/basic/role.html',
            controller : role
        });

        $routeProvider.otherwise({
            redirectTo : "/welcome.html"
        });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }];
});