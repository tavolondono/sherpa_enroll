/**
 * Provider para scanear los codigo QR
 * Implementacón basada en https://github.com/tjwoon/csZBar
 *
 * @class scannerProvider
 * @constructor
 * @module sherpa
*/

angular.module('App')
    .factory('scannerProvider',
    ['configProvider', '$q', 'logManager', 'errorManager',
    function (configProvider, $q, logManager, errorManager) {

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */

    var self = {
        scan : scan
    },
    PLUGIN_NAME= 'scannerPlugin',
    SCAN = 'scan';

    /**
     * Metodo encargado de realizar al invocación para abrir la camara y scanear el QR.
     * @method scan
     * @param {function} onSuccess callback cuando el proceso es exitoso.
     * @param {function} onError callback cuando el proceso es fallido.
     * @private
    **/
    function scan(){
        var params = {},
         responseScan = $q.defer(),
         errorCam;

        params.text_title = configProvider.scanner.title;
        params.text_instructions = configProvider.scanner.instructions;
        params.drawSight = false;

        cordova.exec(function(data){
            responseScan.resolve(data);
        },function(error){
            errorCam = errorManager.createErrorInstance(configProvider.errors.camera.cancel);
            logManager.error(errorCam.responseJSON.error.errorMessage+ ': ' +error);
            responseScan.reject(error);
        }, PLUGIN_NAME, SCAN, [params]);

        return responseScan.promise;
    }

    return self;
}]);
