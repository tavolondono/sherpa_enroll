/**
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
});