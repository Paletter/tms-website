/**
 * Creator:     Jeng Tam
 * CreateDate:  2014/5/23
 * Description: 表单校验模块
 * Remark:
 * 1.表单提交之前不做校验
 * 2.失去焦点进行校验，并提示错误信息
 * 
 */
angular.module('eg-validation', [])

.constant('VALIDATION_RULE',{
    require:'require',
    length:'length'
})

.directive('egValidation', ['$http','VALIDATION_RULE', function($http,VALIDATION_RULE) {
    return {
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                var rules = eval('('+attrs.egValidation+')');
                var formName = element[0].form.name;
                var formObj = scope[formName];
                var valida = function(){
                    var errors = [];
                    for(var ruleName in rules){
                        var rule = rules[ruleName];
                        switch(ruleName){
                            case VALIDATION_RULE.require:
                                if(ctrl.$viewValue == undefined || ctrl.$viewValue == ""){
                                    errors.push(rule.msg);
                                }
                                break;
                            case VALIDATION_RULE.length:
                                break;
                            default:
                                console.log('未识别的规则');
                        }
                    }
                    if(errors.length > 0){
                        ctrl.$setValidity(attrs.ngModel, false, errors);
                        ctrl.errorMsg = errors;
                    }else if(errors.length == 0) {
                        ctrl.$setValidity(attrs.ngModel, true);
                        ctrl.errorMsg = undefined;
                    }
                    return errors;
                };
                scope.$watch(attrs.ngModel, function() {
                    if(!formObj.$pristine){
                        valida();
                    }
                });
            }
        }
}]);