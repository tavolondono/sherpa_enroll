/**
* Manager para centralizar el registro de logs de la aplicación
* @class logManager
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('logManager',
    ['$log', 'utilsProvider',
    function ($log, utilsProvider) {

    var loggerManager = {},
    logger = null;

    /**
     * Función que se encarga de registrar en el log un mensaje con nivel log
     * @method log
     * @param message {Object}
     * @public
     */
    loggerManager.log = function (message) {
        
        console.log('/***** ');
        console.log(message);
        console.log(' *****/');
    };

    /**
     * Función que se encarga de registrar en el log un mensaje con nivel debug
     * @method debug
     * @param message {Object}
     * @public
     */
    loggerManager.debug = function (message) {
        console.log('/***** ');
        console.log(message);
        console.log(' *****/');
    };

    /**
     * Función que se encarga de registrar en el log un mensaje con nivel error
     * @method error
     * @param message {Object}
     * @public
     */
    loggerManager.error = function (message) {
        

        console.log('/***** ');
        console.log(message);
        console.log(' *****/');
    };

    /**
     * Función que se encarga de obtener el logger indicado para el ambiente actual
     * @method getLogger
     * @public
     */
    loggerManager.getLogger = function (){
        
            logger = $log;
       
        return logger;
    };

    return loggerManager;
}]);