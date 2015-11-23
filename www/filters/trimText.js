/**
* Filter para quitar espacios a textos
* @class trimTex
* @constructor
* @return {String} Texto generado sin espacios.
* @module sherpa
**/ 
angular.module('App')
    .filter('trimTex', function() {
    return function(text) {
        var generated = text; 
        if(generated!==undefined && generated!==null ){
            generated = String(generated);
            if(generated!==''){
              generated = generated.replace(/\s/g,'');
            }
        }
        return generated;
    };
}).filter('trimNumericKey', function(){
    return function (number){
        var newValue = number;

        if(newValue!==undefined && newValue!==null ){
            newValue = String(newValue);
            if(newValue!==''){
              newValue = newValue.replace(/[^0-9]/,'');
            }
        } else {
            newValue = '';
        }
        return newValue;
    };
});