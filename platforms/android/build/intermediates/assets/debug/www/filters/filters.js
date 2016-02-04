/**
* Filter para enmascarar las fechas trasnferencias de plata
* @constructor
* @return {String} fecha con el formato .
* @module sherpa
**/
'use strict';

angular.module('App')
    .filter('dateFilter', ['$filter', 'configProvider', function( $filter, configProvider) {

    return function(date) {
        
        var result,
            yesterday,
            inputDate,
            today,
            todayText = configProvider.transactions.todayText,
            yesterdayText = configProvider.transactions.yesterdayText;

        if(typeof date !== 'undefined' && date!==null){
            yesterday = new Date();
            today = new Date();
            inputDate  = new Date(date);

            yesterday.setDate(yesterday.getDate() - 1);

            if(inputDate.toDateString() === today.toDateString()){ 
                result =  todayText + ' ' + $filter('date')(inputDate, '- h:mm a');
            }else if(inputDate.toDateString() === yesterday.toDateString()){
                result =  yesterdayText + ' ' + $filter('date')(inputDate, '- h:mm a');
            }else{
                result =  $filter('date')(inputDate, 'MMM d - h:mm a');
            }

        }else{
            result = date;
        }

        return result;
    };
}]);/**
* Filter para enmascarar las fechas de movimientos en los dias en que se realizaron
* @constructor
* @return {String} fecha con el formato del dÃ­a o fecha sin horas. .
* @module sherpa
**/
'use strict';

angular.module('App')
    .filter('dayFilter', ['$filter', 'configProvider', function( $filter, configProvider) {

    return function(date) {
        
        var result,
            inputDate,
            today,
            yesterday,
            compareDate,
            daysToRest,
            todayText = configProvider.transactions.todayText,
            yesterdayText = configProvider.transactions.yesterdayText;

        if(typeof date !== 'undefined' && date!==null) {

            /* Damos formato correcto a la fecha */
            inputDate  = new Date(date + 'T05:00:00');
            yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            today = new Date();
            daysToRest = (24 * 60 * 60 * 1000) * 7;

            compareDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds());
            compareDate = new Date(compareDate).getTime();
            compareDate = compareDate - daysToRest;

            if(inputDate.toDateString() === today.toDateString()) { 
                result =  todayText;
            } else if(inputDate.toDateString() === yesterday.toDateString()) {
                result =  yesterdayText;
            } else if(inputDate.getTime() > compareDate) {
            	result = configProvider.days[inputDate.getDay()]; 
            } else {
                result =  configProvider.months[inputDate.getMonth()] + ' ' + $filter('date')(inputDate, 'dd') + ' de ' + $filter('date')(inputDate, 'yyyy');
            }

        }else{
            result = date;
        }

        return result;
    };
}]);/**
* Filter para enmascarar los textos
* @class stringMask
* @constructor
* @return {String} Texto con maskara.
* @module sherpa
**/
angular.module('App')
    .filter('stringPhoneNumber', function() {

    return function(phoneNumber) {

        var result,
        phoneMaskINT = new StringMask('+00 000 000 0000'),
        phoneMask = new StringMask('000 000 0000');

        if(typeof phoneNumber !== 'undefined' && phoneNumber!==null){

            phoneNumber = phoneNumber.replace(/-/g, '').replace(/ /g, '').replace(/\+/g, '');

            if (phoneNumber.length < 11) {
                result = phoneMask.apply(phoneNumber);
            } else {
                result = phoneMaskINT.apply(phoneNumber);
            }
        }else{
            result = phoneNumber;
        }
        return result;

    };
});/**
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