/**
 * Provider para administrar el goBack Nativo.
 * @class hardwareBackButtonManager
 * @constructor
 * @module sherpa
*/
angular.module('App')
.service('hardwareBackButtonManager', ['$ionicPlatform', function($ionicPlatform) {

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
    **/
    var self = {
        enable: enable,
        disable: disable,
        goBack: undefined,
        isEnable: true
    };

    /**
     * Metodo para inhabilitar el botón goBack nativo
     * @method disable
     * @private
    **/
    function disable(inactiveButtonValue){
       var inactiveButton = inactiveButtonValue || false;
       $ionicPlatform.registerBackButtonAction(function(e){
            e.preventDefault();
            return false;
        }, 101);
        self.isEnable = false;
        if (inactiveButton) {
            self.goBack = null;
        }else {
            self.goBack = undefined;
        }
    }

    /**
     * Metodo para habilitar el botón goBack nativo
     * @method enable
     * @private
     * @param goBack {Function} Función que se ejecuta cuando se ejecuta el goBack nativo.
    **/
    function enable(goBack){
        self.isEnable = true;
        if (typeof goBack === 'function') {
            self.goBack = goBack;
        }else {
            self.goBack = undefined;
        }
    }

    return self;

}]);