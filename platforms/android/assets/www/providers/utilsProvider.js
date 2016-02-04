/**
* Provider para publicar las funciones utilitarias de la aplicación
* @class utilsProvider
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('utilsProvider', function(){

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        validateNull: validateNull
    };

    /**
    * Método para validar si una variable es nula o indefinida
    * @method validateNull
    * @param value {Object}
    * @private
    */
    function validateNull (value) {
        return typeof value !== 'undefined' && value !== null && value !== '';
    }

    return self;
});