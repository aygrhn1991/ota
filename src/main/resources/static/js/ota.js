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
            $scope.searchModel.key).success(function (d) {
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
        $scope.addModel.t_name = null;
        $scope.addModel.t_remarks = null;
        layer.open({
            type: 1,
            shade: 0,
            area: '500px',
            btn: ['保存'],
            content: $('#addModal'),
            yes: function (index, layero) {
                if ($scope.addModel.t_name === null || $scope.addModel.t_name === '') {
                    alert('请填写产品名称');
                    return;
                }
                $http.post('/admin/addProduct/', $scope.addModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            }
        });
    };
    $scope.openEditModal = function (e) {
        $scope.editModel = e;
        layer.open({
            type: 1,
            shade: 0,
            area: '500px',
            btn: ['保存'],
            content: $('#editModal'),
            yes: function (index, layero) {
                if ($scope.editModel.t_name === null || $scope.editModel.t_name === '') {
                    alert('请填写产品名称');
                    return;
                }
                $http.post('/admin/editProduct/', $scope.editModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            }
        });
    };
    $scope.delete = function (e) {
        layer.confirm('确定删除？', function (index) {
            $http.post('/admin/deleteProduct/' + e.t_id).success(function (d) {
                if (d) {
                    alert('删除成功');
                    $scope.loadData(true);
                    layer.close(index);
                } else {
                    alert('删除失败');
                }
            })
        });
    };
    $scope.init = function () {
        $scope.pageModel = {
            pageIndex: 1,
            pageSize: 10
        };
        $scope.searchModel = {
            key: ''
        };
        $scope.addModel = {
            t_name: null,
            t_remarks: null
        };
        $scope.loadData(true);
    };
    $scope.init();
});
app.controller('devicesCtl', function ($scope, $http) {
    $scope.loadData = function (reset) {
        if (reset) {
            $scope.pageModel.pageIndex = 1;
        }
        $http.post('/admin/getDevices/' +
            $scope.pageModel.pageIndex + '/' +
            $scope.pageModel.pageSize + '/' +
            $scope.searchModel.productId + '/' +
            $scope.searchModel.key).success(function (d) {
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
        $scope.addModel.t_product_id = null;
        $scope.addModel.t_code = null;
        $scope.addModel.t_current_version = null;
        $scope.addModel.t_remarks = null;
        layer.open({
            type: 1,
            shade: 0,
            area: '500px',
            btn: ['保存'],
            content: $('#addModal'),
            yes: function (index, layero) {
                if ($scope.addModel.t_product_id === null || $scope.addModel.t_product_id === '') {
                    alert('请选择设备对应产品');
                    return;
                }
                if ($scope.addModel.t_code === null || $scope.addModel.t_code === '') {
                    alert('请填写设备编号');
                    return;
                }
                if ($scope.addModel.t_current_version === null || $scope.addModel.t_current_version === '') {
                    alert('请填写设备当前软件版本');
                    return;
                }
                $http.post('/admin/addDevice/', $scope.addModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            }
        });
    };
    $scope.openEditModal = function (e) {
        $scope.editModel = e;
        layer.open({
            type: 1,
            shade: 0,
            area: '500px',
            btn: ['保存'],
            content: $('#editModal'),
            yes: function (index, layero) {
                if ($scope.editModel.t_product_id === null || $scope.editModel.t_product_id === '') {
                    alert('请选择设备对应产品');
                    return;
                }
                if ($scope.editModel.t_code === null || $scope.editModel.t_code === '') {
                    alert('请填写设备编号');
                    return;
                }
                if ($scope.editModel.t_current_version === null || $scope.editModel.t_current_version === '') {
                    alert('请填写设备当前软件版本');
                    return;
                }
                $http.post('/admin/editDevice/', $scope.editModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            }
        });
    };
    $scope.delete = function (e) {
        layer.confirm('确定删除？', function (index) {
            $http.post('/admin/deleteDevice/' + e.t_id).success(function (d) {
                if (d) {
                    alert('删除成功');
                    $scope.loadData(true);
                    layer.close(index);
                } else {
                    alert('删除失败');
                }
            })
        });
    };
    $scope.init = function () {
        $scope.productList2=[{t_id:1,t_name:'sss'}];
        $http.post('/admin/getProductsForList').success(function (d) {
            $scope.productList = d.data;
        })
        $scope.pageModel = {
            pageIndex: 1,
            pageSize: 10
        };
        $scope.searchModel = {
            productId: 0,
            key: ''
        };
        $scope.addModel = {
            t_product_id: null,
            t_code: null,
            t_current_version: null,
            t_remarks: null
        };
        $scope.loadData(true);
    };
    $scope.init();
});