window.context = '/ota';
var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: context + '/admin/products',
            controller: 'productsCtl'
        })
        .when('/devices', {
            templateUrl: context + '/admin/devices',
            controller: 'devicesCtl'
        })
        .when('/softwares', {
            templateUrl: context + '/admin/softwares',
            controller: 'softwaresCtl'
        })
        .when('/logs', {
            templateUrl: context + '/admin/logs',
            controller: 'logsCtl'
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
        $http.post(context + '/admin/getProducts/' +
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
                $http.post(context + '/admin/addProduct/', $scope.addModel).success(function (d) {
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
                $http.post(context + '/admin/editProduct/', $scope.editModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            },
            cancel: function (index, layero) {
                $scope.loadData(false);
            }
        });
    };
    $scope.delete = function (e) {
        layer.confirm('确定删除？', function (index) {
            $http.post(context + '/admin/deleteProduct/' + e.t_id).success(function (d) {
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
        $http.post(context + '/admin/getDevices/' +
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
        $scope.addModel.t_software_id = null;
        $scope.addModel.t_code = null;
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
                if ($scope.addModel.t_software_id === null || $scope.addModel.t_software_id === '') {
                    alert('请选择设备当前软件版本');
                    return;
                }
                if ($scope.addModel.t_code === null || $scope.addModel.t_code === '') {
                    alert('请填写设备编号');
                    return;
                }
                $http.post(context + '/admin/addDevice/', $scope.addModel).success(function (d) {
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
        $scope.editModelProductChange();
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
                if ($scope.editModel.t_software_id === null || $scope.editModel.t_software_id === '') {
                    alert('请选择设备当前软件版本');
                    return;
                }
                if ($scope.editModel.t_code === null || $scope.editModel.t_code === '') {
                    alert('请填写设备编号');
                    return;
                }
                $http.post(context + '/admin/editDevice/', $scope.editModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            },
            cancel: function (index, layero) {
                $scope.loadData(false);
            }
        });
    };
    $scope.delete = function (e) {
        layer.confirm('确定删除？', function (index) {
            $http.post(context + '/admin/deleteDevice/' + e.t_id).success(function (d) {
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
    $scope.addModelProductChange = function () {
        $http.post(context + '/admin/getSoftwaresForList/' + $scope.addModel.t_product_id).success(function (d) {
            $scope.softwareList = d.data;
        })
    };
    $scope.editModelProductChange = function () {
        $http.post(context + '/admin/getSoftwaresForList/' + $scope.editModel.t_product_id).success(function (d) {
            $scope.softwareList = d.data;
        })
    };
    $scope.init = function () {
        $http.post(context + '/admin/getProductsForList').success(function (d) {
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
            t_software_id: null,
            t_code: null,
            t_remarks: null
        };
        $scope.loadData(true);
    };
    $scope.init();
});
app.controller('softwaresCtl', function ($scope, $http) {
    $scope.loadData = function (reset) {
        if (reset) {
            $scope.pageModel.pageIndex = 1;
        }
        $http.post(context + '/admin/getSoftwares/' +
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
        $scope.addModel.t_version = null;
        $scope.addModel.t_remarks = '';
        $('#file').val(null);
        layer.open({
            type: 1,
            shade: 0,
            area: '500px',
            btn: ['保存'],
            content: $('#addModal'),
            yes: function (index, layero) {
                if ($scope.addModel.t_product_id === null || $scope.addModel.t_product_id === '') {
                    alert('请选择软件对应产品');
                    return;
                }
                if ($scope.addModel.t_version === null || $scope.addModel.t_version === '') {
                    alert('请填写软件版本');
                    return;
                }
                var files = $('#file')[0].files;
                if (files.length == 0) {
                    alert('请选择文件');
                    return;
                }
                var formData = new FormData();
                formData.append('t_product_id', $scope.addModel.t_product_id);
                formData.append('t_version', $scope.addModel.t_version);
                formData.append('t_remarks', $scope.addModel.t_remarks);
                formData.append('file', files[0]);
                $.ajax({
                    type: "POST",
                    url: context + '/admin/addSoftware',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (d) {
                        if (d === -1) {
                            alert('文件保存失败');
                        } else if (d === 0) {
                            alert('保存失败');
                        } else {
                            alert('保存成功');
                            $scope.loadData(true);
                            layer.close(index);
                        }
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
                    alert('请选择软件对应产品');
                    return;
                }
                if ($scope.editModel.t_version === null || $scope.editModel.t_version === '') {
                    alert('请填写软件版本');
                    return;
                }
                $http.post(context + '/admin/editSoftware/', $scope.editModel).success(function (d) {
                    if (d) {
                        alert('保存成功');
                        $scope.loadData(true);
                        layer.close(index);
                    } else {
                        alert('保存失败');
                    }
                });
            },
            cancel: function (index, layero) {
                $scope.loadData(false);
            }
        });
    };
    $scope.delete = function (e) {
        layer.confirm('确定删除？', function (index) {
            $http.post(context + '/admin/deleteSoftware/' + e.t_id).success(function (d) {
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
        $http.post(context + '/admin/getProductsForList').success(function (d) {
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
            t_version: null,
            t_remarks: null
        };
        $scope.loadData(true);
    };
    $scope.init();
});
app.controller('logsCtl', function ($scope, $http) {
    $scope.loadData = function (reset) {
        if (reset) {
            $scope.pageModel.pageIndex = 1;
        }
        $http.post(context + '/admin/getLogs/' +
            $scope.pageModel.pageIndex + '/' +
            $scope.pageModel.pageSize + '/' +
            $scope.searchModel.productId + '/' +
            $scope.searchModel.softwareId + '/' +
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
    $scope.searchModelProductChange = function () {
        $http.post(context + '/admin/getSoftwaresForList/' + $scope.searchModel.productId).success(function (d) {
            $scope.softwareList = d.data;
        })
    };
    $scope.init = function () {
        $http.post(context + '/admin/getProductsForList').success(function (d) {
            $scope.productList = d.data;
        })
        $scope.pageModel = {
            pageIndex: 1,
            pageSize: 10
        };
        $scope.searchModel = {
            productId: 0,
            softwareId: 0,
            key: ''
        };
        $scope.loadData(true);
    };
    $scope.init();
});
app.controller('loginCtrl', function ($scope, $http) {
    $scope.authModel = {
        account: null,
        password: null
    }
    $scope.auth = function () {
        if ($scope.authModel.account === null ||
            $scope.authModel.account === '' ||
            $scope.authModel.password === null ||
            $scope.authModel.password === '') {
            alert('请填写账号密码');
            return;
        }
        $http.post(context + '/auth/auth?account=' + $scope.authModel.account + '&password=' + $scope.authModel.password).success(function (d) {
            if (d) {
                window.location.href = context + '/admin/index';
            } else {
                alert('登陆失败');
            }
        })
    };
});