/**
 * Creator:     Jeng Tam
 * CreateDate:  2013/5/23
 * Description: 正则常用函数
 */
var PatternRule = function(){
    /**
     * 数字正则表达式
     * 1.可包含正负小数
     * @param n1    限制位数
     * @param n2    保留小数默认为0
     * @returns {RegExp}
     */
    this.number = function(n1,n2){
        var reg = new RegExp('^-?(([1-9]{1,10})|0)(\\.\\d{1,2})?$');
        console.log(reg.test('01'));
        console.log(reg.test('01.0'));
        console.log(reg.test('01.01'));
        console.log(reg.test('0.'));
        console.log(reg.test('.'));
        console.log(reg.test('0.0'));
        console.log(reg.test('1.'));
        return reg;
    };
    this.integer = function(n1){
    }
};