define(function () {
    window.JQueryUtils = {
        focusSelect : function(elementid) {
            $("#" + elementid).focus();
            $("#" + elementid).select();
        },
        focus : function(elementid) {
            $("#" + elementid).focus();
        },
        blur : function(elementid) {
            $("#" + elementid).blur();
        }
    };
    return window.JQueryUtils;
});