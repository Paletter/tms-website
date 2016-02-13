define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog","$routeParams","$rootScope","PrintService",function($scope,BaseHttp,AppConfig,Dialog,$routeParams,$rootScope,PrintService) {
    	$scope.pageInfoInitial = function() {
            $scope.pgPageInfo = {pageNum:1, pageSize:10};
        };
        //查询分单信息
        $scope.searchUserList = function() {
        	$scope.pageInfoInitial();
        	$scope.userList = [];
        	$scope.queryUserList();
        };
        $scope.queryUserList = function() {
            Dialog.queryLoad();
        	var params = $scope.queryParams;
        	params.pageInfo = $scope.pgPageInfo;
            BaseHttp.post("/UserController/queryUser", params).success(function(data){
                $scope.userList = data.result;
                $scope.pgPageInfo = data.pageInfo;
                $scope.pgPageInfo.loadData = $scope.queryUserList;
            });
        };
        //新增用户
        $scope.addUser = function() {
            $scope.currentUser = {};
            $scope.showUserModal();
        };
        $scope.saveNewUser = function() {
            if($scope.validateUser($scope.currentUser)) {
                Dialog.updateLoad();
                var param = $scope.currentUser;
                BaseHttp.post("/UserController/addUser", param).success(function(data){
                    if(data.result) {
                        Dialog.remind("操作成功");
                        $scope.cancelUserModal();
                        $scope.searchUserList();
                    }
                });
            }
        };
        //编辑用户
        $scope.editUser = function(index){
            $scope.currentUser = angular.copy($scope.userList[index]);
            $scope.showUserModal();
        };
        $scope.updateUser = function() {
            if($scope.validateUser($scope.currentUser)) {
                Dialog.updateLoad();
                var params = $scope.currentUser;
                BaseHttp.post("/UserController/updateUser", params).success(function(data){
                    if(data.result) {
                        Dialog.remind("操作成功");
                        $scope.cancelUserModal();
                        $scope.searchUserList();
                    }
                });
            }
        };
        $scope.validateUser = function(param){
            if(StringUtils.isBlank(param.userName)) {
                Dialog.alert('用户名不能为空');
                return false;
            }
            return true;
        };
        //用户生效
        $scope.activeUser = function(index){
            $scope.currentUser = angular.copy($scope.userList[index]);
            var params = $scope.currentUser;
            params.isActive = 1;
            Dialog.updateLoad();
            BaseHttp.post("/UserController/updateUser", params).success(function(data){
                if(data.result) {
                    Dialog.remind("操作成功");
                    $scope.searchUserList();
                }
            });
        };
        //用户失效
        $scope.inactiveUser = function(index){
            $scope.currentUser = angular.copy($scope.userList[index]);
            var params = $scope.currentUser;
            params.isActive = 0;
            Dialog.updateLoad();
            BaseHttp.post("/UserController/updateUser", params).success(function(data){
                if(data.result) {
                    Dialog.remind("操作成功");
                    $scope.searchUserList();
                }
            });
        };
        //查询用户仓库权限
        $scope.userAuthWare = function(index) {
            $scope.currentUser = angular.copy($scope.userList[index]);
            $scope.currentUserAuthWareList = [];
            $scope.queryUserAuthWare();
            $scope.showAuthWareModal();
        };
        $scope.queryUserAuthWare = function() {
            var params = {};
            params.cdUserId = $scope.currentUser.cdUserId;
            Dialog.queryLoad();
            BaseHttp.post("/UserController/queryUserAuthWare", params).success(function(data){
                if(data.result) {
                    $scope.currentUserAuthWareList = data.result;

                    $scope.currentUserVoidWareList = [];
                    $.each($scope.warehouseList, function(key, row) {
                        if($scope.notIncludeInUserWare(row.cdWarehouseId)) {
                            $scope.currentUserVoidWareList.push(row);
                        }
                    });
                    
                }
            });
        };
        $scope.notIncludeInUserWare = function(id) {
            var isNotInclude = true;
            if($scope.currentUserAuthWareList && $scope.currentUserAuthWareList.length > 0) {
                $.each($scope.currentUserAuthWareList, function(key, row){
                    if(row.cdWarehouseId == id) isNotInclude = false;
                });
            }
            return isNotInclude;
        };
        //添加仓库权限
        $scope.addUserAuthWare = function(index) {
            var params = {};
            params.cdUserId = $scope.currentUser.cdUserId;
            params.cdWarehouseId = $scope.currentUserVoidWareList[index].cdWarehouseId;
            BaseHttp.post("/UserController/addUserAuthWare", params).success(function(data){
                if(data.result) {
                    $scope.queryUserAuthWare();
                }
            });
        };
        //移除仓库权限
        $scope.removeUserAuthWare = function(index) {
            var params = {};
            params.cdUserId = $scope.currentUser.cdUserId;
            params.cdWarehouseId = $scope.currentUserAuthWareList[index].cdWarehouseId;
            BaseHttp.post("/UserController/removeUserAuthWare", params).success(function(data){
                if(data.result) {
                    $scope.queryUserAuthWare();
                }
            });
        };
        //查询用户角色
        $scope.userAuthRole = function(index) {
            $scope.currentUser = angular.copy($scope.userList[index]);
            $scope.currentUserAuthRole = {};
            $scope.queryUserAuthRole();
            $scope.showAuthRoleModal();
        };
        $scope.queryUserAuthRole = function() {
            var params = {};
            params.cdUserId = $scope.currentUser.cdUserId;
            Dialog.queryLoad();
            BaseHttp.post("/UserController/queryUserAuthRole", params).success(function(data){
                if(data.result) {
                    $scope.currentUserAuthRole = data.result;
                }
            });
        };
        //更新用户角色
        $scope.updateUserAuthRole = function() {
            var params = {};
            params.cdUserId = $scope.currentUser.cdUserId;
            params.cdRoleId = $scope.choseRoleId;
            Dialog.updateLoad();
            BaseHttp.post("/UserController/updateUserAuthRole", params).success(function(data){
                if(data.result) {
                    Dialog.remind("操作成功");
                }
            });
        };
        //重置密码
        $scope.resetPwd = function(index) {
            Dialog.confirm("密码将重置为123456，确定重置？", function() {
                var params = {};
                params.cdUserId = $scope.userList[index].cdUserId;
                Dialog.updateLoad();
                BaseHttp.post("/UserController/resetPwd", params).success(function(data){
                    if(data.result) {
                        Dialog.alert("操作成功。密码重置为123456");
                    }
                });
            });
        };

        //基础信息
        $scope.queryAllCompany = function() {
            BaseHttp.post('/CommonBasicInfoController/queryAllActiveCompany').success(function(data){
                $scope.companyList = data.result;
            });
        };
        $scope.queryAllWarehouse = function() {
            BaseHttp.post('/CommonBasicInfoController/queryAllActiveWarehouse').success(function(data){
                $scope.warehouseList = data.result;
            });
        };
        $scope.queryAllRole = function() {
            BaseHttp.post('/CommonBasicInfoController/queryAllRole').success(function(data){
                $scope.roleList = data.result;
            });
        };

        //小窗口
        $scope.showUserModal = function() {
            $("#userModal").modal("show");
        };
        $scope.cancelUserModal = function() {
            $scope.currentUser = {};
            $("#userModal").modal("hide");
        };
        $scope.showAuthWareModal = function() {
            $("#authWareModal").modal("show");
        };
        $scope.cancelAuthWareModal = function() {
            $scope.currentUser = {};
            $scope.currentUserAuthWareList = [];
            $("#authWareModal").modal("hide");
        };
        $scope.showAuthRoleModal = function() {
            $("#authRoleModal").modal("show");
        };
        $scope.cancelAuthRoleModal = function() {
            $scope.currentUser = {};
            $("#authRoleModal").modal("hide");
        };

        var initialize = function () {
        	$scope.queryParams = {};
        	$scope.pageInfoInitial();
            $scope.queryAllCompany();
            $scope.queryAllWarehouse();
            $scope.queryAllRole();
        };
        initialize();
    }]
});