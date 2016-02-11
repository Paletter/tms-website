define(function () {
    return [function(){
        return function(sourceVal, emptyVal){
            if(sourceVal == null
               || sourceVal == "undefined"
               || typeof sourceVal == "undefined"
               || sourceVal == '') {

                return emptyVal;
            } else {
                return sourceVal;
            }
        }
    }];
});