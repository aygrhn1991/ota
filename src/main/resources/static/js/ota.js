var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: '/admin/products',
            controller: 'productsCtl'
        })
        .when('/devices', {
            templateUrl: '/admin/devices',
            controller: 'devicesCtl'
        })
        .when('/softwares', {
            templateUrl: '/admin/softwares',
            controller: 'softwaresCtl'
        })
        .when('/logs', {
            templateUrl: '/admin/logs',
            controller: 'softwaresCtl'
        })
        .when('/list/:id', {
            templateUrl: 'views/route/detail.html',
            controller: 'RouteDetailCtl'
        })
        .otherwise({
            redirectTo: '/products'
        });
});
app.controller('productsCtl', function ($scope, $http) {
    $scope.loadData = function (reset) {
        if (reset) {
            $scope.pageModel.pageIndex = 1;
        }
        $http.post('/admin/getProducts/' +
            $scope.pageModel.pageIndex + '/' +
            $scope.pageModel.pageSize + '/' +
            $scope.model.key).success(function (d) {
            $scope.list = d.data;
            if (reset) {
                $scope.makePage($scope.pageModel.pageSize, d.count);
            }
        })
    };
    $scope.makePage = function (pageSize, total) {
        layui.laypage.render({
            elem: 'page',
            limit: pageSize,
            count: total,
            jump: function (obj, first) {
                if (!first) {
                    $scope.pageModel.pageIndex = obj.curr;
                    $scope.loadData(false);
                }
            }
        });
    };
    $scope.openAddModal = function () {
        layer.open({
            type: 1,
            area:'auto',
            shade: 0,
            content: $('#addModal')
        });
    };
    $scope.add=function(){
        console.log('add');
    };
    $scope.openEditModal = function () {
        layer.open({
            type: 1,
            area:'auto',
            shade: 0,
            content: $('#editModal')
        });
    };
    $scope.edit=function(){
        console.log('edit');
    };
    $scope.init = function () {
        $scope.pageModel = {
            pageIndex: 1,
            pageSize: 10
        };
        $scope.model = {
            key: ''
        };
        $scope.loadData(true);
    };
    $scope.init();
});
app.controller('softwaresCtl', function ($scope) {
    console.log('softwaresCtl');
});