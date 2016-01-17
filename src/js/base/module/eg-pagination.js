/**
 * Creator:     Jeng Tam
 * CreateDate:  2014/5/23
 * Description: 分页控件
 * Remark:
 * 
 */
define(function (pagination) {
    var initialize = function(){
        angular.module('eg-pagination', [])
        .directive('pagination', function() {
            return {
                restrict: 'E',
                templateUrl : 'js/tpl/ngPagination.html',//模板url
                transclude : true, //嵌入
                scope:{
                    pgPageInfo:"="
                },
                link:function($scope,$element){

                },
                controller : ["$scope","$element","$attrs",function($scope, $element, $attrs){
                    var omit = 1;
                    $scope.pgPageInfo.total = 0;
                    $scope.$watch('pgPageInfo',function(newVal,oldVal){
                        if(newVal && newVal !== oldVal){
                            $scope.load();
                        }
                    });
                    $scope.showNum = [];
                    $scope.$watch('curPage',function(newVal,oldVal){
                        if(newVal && newVal !== oldVal){
                            $scope.showNum = [];
                            $scope.showNum.push(1);
                            $scope.showNum.push($scope.pages);
                            if($scope.curPage != 1 && $scope.curPage != $scope.pages){
                                $scope.showNum.push($scope.curPage)
                            }
                        }
                    });
                    $scope.load = function(){
                        $scope.curPage = $scope.pgPageInfo.pageNum;//当前页
                        $scope.pageSize = $scope.pgPageInfo.pageSize;//每页总条数
                        $scope.total = $scope.pgPageInfo.total;//总条数
                        if($scope.pgPageInfo.pages){
                            $scope.pages = $scope.pgPageInfo.pages
                        }else{
                            $scope.pages = 1
                        }
                        $scope.pageList = [];
                        for(var i=1;i<=$scope.pages;i++){
                            var page = {
                                isDisabled:false,
                                num:i,
                                isOmit:false,
                                text:"",
                                isShow:true
                            };
                            //如果页码等于当前页禁用点击
                            if(page.num == $scope.curPage){
                                page.isDisabled = true;
                            }
                            //总页数小于7，显示所有分页
                            /*if($scope.pages < 7){
                                $scope.pageList.push(page);
                            }*/
                            //小于3
                            if(i == 1){
                                $scope.pageList.push(page);
                                continue;
                            }
                            //大于最后2页
                            if(i == $scope.pages){
                                $scope.pageList.push(page);
                                continue;
                            }
                            if($scope.curPage >= 1 && $scope.curPage <= $scope.pages){
                                if(($scope.curPage-1)==i || ($scope.curPage+1)==i || i==$scope.curPage){
                                    if(($scope.curPage-1)==i &&  i!=$scope.curPage){
                                        var page2 = angular.copy(page);
                                        page2.isOmit = true;
                                        page2.text = "...";
                                        page2.num=null;
                                        if(i!=2){
                                            $scope.pageList.push(page2);
                                        }
                                        $scope.pageList.push(page);
                                    }else if(($scope.curPage+1)==i && i!=$scope.curPage){
                                        $scope.pageList.push(page);
                                        var page2 = angular.copy(page);
                                        page2.isOmit = true;
                                        page2.text = "...";
                                        page2.num=null;
                                        if(i!=($scope.pages-1)){
                                            $scope.pageList.push(page2);
                                        }
                                    }
                                    if(i==$scope.curPage){
                                        $scope.pageList.push(page);
                                    }
                                }
                            }
                            /*if($scope.curPage > 3 && $scope.curPage < ($scope.pages-2)){
                                //显示当前页的前后页
                                if((i-1)==$scope.curPage || (i+1)==$scope.curPage || i==$scope.curPage){
                                    $scope.pageList.push(page);
                                }
                            }*/
                           // $scope.pageList.push(page);
                        }
                    };
                    $scope.skipPage = function(num){
                        num = parseInt(num);
                        if(num<=$scope.pages && num>=1){
                            $scope.pgPageInfo.pageNum = num;
                            $scope.pgPageInfo.loadData();
                        }else{
                           
                        }
                    };
                    $scope.load();
                }]
            };
        });
    };
    return {
        initialize:initialize
    }
});