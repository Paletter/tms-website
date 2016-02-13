define(function() {
    return ['$scope',"BaseHttp","AppConfig","Dialog","$routeParams","$rootScope","PrintService",function($scope,BaseHttp,AppConfig,Dialog,$routeParams,$rootScope,PrintService) {
        //查询所有角色
        $scope.queryAllRole = function() {
            BaseHttp.post('/CommonBasicInfoController/queryAllRole').success(function(data){
                $scope.roleList = data.result;
            });
        };
        //新增角色
        $scope.addRole = function() {
            var newRole = {};
            $scope.roleList.push(newRole);
        };
        $scope.saveNewRole = function(index) {
            Dialog.updateLoad();
            var params = $scope.roleList[index];
            BaseHttp.post("/RoleController/addRole", params).success(function(data){
                if(data.result) {
                    Dialog.remind("操作成功");
                    $scope.queryAllRole();
                }
            });
        };
        //更新角色
        $scope.updateRole = function(index) {
            Dialog.updateLoad();
            var params = $scope.roleList[index];
            BaseHttp.post("/RoleController/updateRole", params).success(function(data){
                if(data.result) {
                    Dialog.remind("操作成功");
                    $scope.queryAllRole();
                }
            });
        };
        //查询角色资源
        $scope.roleAuthRes = function(index) {
            $scope.currentRole = angular.copy($scope.roleList[index]);
            $scope.currentRoleAuthResList = [];
            $scope.queryRoleAuthRes();
            $scope.showAuthRoleResModal();
        };
        $scope.queryRoleAuthRes = function() {
            var params = {};
            params.cdRoleId = $scope.currentRole.cdRoleId;
            Dialog.queryLoad();
            BaseHttp.get("/RoleController/queryRoleRes", {params: params}).success(function(data){
                if(data.result) {
                    $scope.currentRoleAuthResList = data.result;

                    $scope.currentRoleVoidResList = [];
                    $.each($scope.resourceList, function(key, row) {
                        if($scope.notIncludeInRoleRes(row.cdResourceId)) {
                            $scope.currentRoleVoidResList.push(row);
                        }
                    });

                }
            });
        };
        $scope.notIncludeInRoleRes = function(id) {
            var isNotInclude = true;
            if($scope.currentRoleAuthResList && $scope.currentRoleAuthResList.length > 0) {
                $.each($scope.currentRoleAuthResList, function(key, row){
                    if(row.cdResourceId == id) isNotInclude = false;
                });
            }
            return isNotInclude;
        };
        //添加角色资源权限
        $scope.addRoleAuthRes = function(cdResource) {
            var params = {};
            params.cdRoleId = $scope.currentRole.cdRoleId;
            params.cdResourceId = cdResource.cdResourceId;
            BaseHttp.post("/RoleController/addRoleRes", params).success(function(data){
                if(data.result) {
                    $scope.queryRoleAuthRes();
                }
            });
        };
        //移除角色资源权限
        $scope.removeRoleAuthRes = function(cdResource) {
            var params = {};
            params.cdRoleId = $scope.currentRole.cdRoleId;
            params.cdResourceId = cdResource.cdResourceId;
            BaseHttp.post("/RoleController/removeRoleRes", params).success(function(data){
                if(data.result) {
                    $scope.queryRoleAuthRes();
                }
            });
        };

        //基础信息
        $scope.queryAllResource = function() {
            BaseHttp.post('/CommonBasicInfoController/queryAllActiveResource').success(function(data){
                $scope.resourceList = data.result;
            });
        };

        //小窗口
        $scope.showAuthRoleResModal = function() {
            $("#authRoleResModal").modal("show");
        };
        $scope.cancelAuthRoleResModal = function() {
            $scope.currentRole = {};
            $("#authRoleResModal").modal("hide");
        };

        var initialize = function () {
        	$scope.queryParams = {};
            $scope.queryAllRole();
            $scope.queryAllResource();
        };
        initialize();
    }]
});