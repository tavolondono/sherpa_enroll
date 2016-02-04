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
}]);