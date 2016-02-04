/**
* Filter para enmascarar las fechas de movimientos en los dias en que se realizaron
* @constructor
* @return {String} fecha con el formato del día o fecha sin horas. .
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
}]);