/**
* Manager para centralizar la invocación de adaptadores de IBM Mobile First
* @class invocationManager
* @constructor
* @module sherpa
*/

angular.module('App')
    .factory('invocationManager',
    ['deviceManager', 'messagesProvider', 'logManager', '$q', 'configProvider',
    function (deviceManager, messagesProvider, logManager, $q, configProvider){

    /**
    * Propiedad que almacena los métodos para ser retornados como servicio
    * @property invocationHelper
    * @type Object
    */
    var invocationHelper = {deviceUniqueId: null};

    /*
     * Se consulta el identificador único del dispositivo.
     */
    deviceManager.getDeviceUniqueId().then(function (deviceId) {
        invocationHelper.deviceUniqueId = deviceId;
    }, function(deviceId){
        invocationHelper.deviceUniqueId = deviceId;
    });

    /**
    * Función que se encarga de invocar un procedimiento de un adaptador
    * @method invokeAdaptherMethod
    * @param invocationData {Object}
    * @param successFunction {Function}
    * @param errorFunction {Function}
    * @public
    */
    invocationHelper.invokeAdaptherMethod = function (invocationData, successFunction, errorFunction) {
        var jsonResponse = {
            'responseJSON':{
                'success': false,
                'error':{
                    'errorId':configProvider.errors.con001.code,
                    'errorMessage': configProvider.errors.con001.code.text
                }
            }
        };
        invocationHelper.checkOnline().then(function(isConnected){
            if (isConnected) {
                WL.Client.invokeProcedure(invocationData, {
                    timeout : messagesProvider.timeoutConnectionAdapter,
                    onSuccess : function (data) {
                        invocationHelper.defaultSuccessCallback(data, successFunction);
                    },
                    onFailure : function (data) {

                        if (typeof(data.errorCode)!=='undefined' && data.errorCode==='PROCEDURE_ERROR') {
                            data = {
                                'responseJSON':{
                                    'success': false,
                                    'error':{
                                        'errorId':configProvider.errors.con003.code,
                                        'errorMessage': messagesProvider.generalActions.errorOnFailure
                                    }
                                }
                            };
                        }

                        invocationHelper.defaultErrorCallback(data, errorFunction);
                    },
                    onConnectionFailure : function (data) {
                        logManager.error(data);
                        invocationHelper.connectionErrorCallback(jsonResponse, errorFunction);
                    }
                });
            } else {
                jsonResponse.responseJSON.error.errorId = configProvider.errors.con002.code;
                invocationHelper.connectionErrorCallback(jsonResponse, errorFunction);
            }

        });
    };

    /**
    * Callback de éxito por defecto
    * @method defaultSuccessCallback
    * @param data {Object}
    * @param successFunction {Function}
    * @public
    */
    invocationHelper.defaultSuccessCallback = function (data, successCallback){
        logManager.log(data);
        successCallback(data);
    };

    /**
    * Callback de error por defecto
    * @method defaultErrorCallback
    * @param data {Object}
    * @param errorCallback {Function}
    * @public
    */
    invocationHelper.defaultErrorCallback = function (data, errorCallback){
        logManager.error(data);
        errorCallback(data);
    };

    /**
    * Callback de error por defecto para errores de conexión
    * @method connectionErrorCallback
    * @param data {Object}
    * @param errorCallback {Function}
    * @public
    */
    invocationHelper.connectionErrorCallback = function (data, errorCallback){
        errorCallback(data);
    };

    /**
    * Método para generar los datos de invocación de un procedimiento
    * @method getInvocationData
    * @param adapter {String}
    * @param procedureName {String}
    * @param params {Object}
    * @public
    */
    invocationHelper.getInvocationData = function (adapter, procedureName, params) {
        var invocationData = {};
        /*Default value for params when passing null*/
        params = params || [];
        params.push(invocationHelper.deviceUniqueId);

        invocationData = {
            adapter : adapter,
            procedure : procedureName,
            parameters : params
        };

        return invocationData;
    };

    /**
    * Método para generar los datos de invocación de un procedimiento
    * @method getTransactionInvocationData
    * @param adapter {String}
    * @param procedureName {String}
    * @param params {Object}
    * @param transactionID {String}
    * @public
    */
    invocationHelper.getTransactionInvocationData = function (adapter, procedureName, params, transactionID) {
        var invocationData = {};
        /*Default value for params when passing null*/
        params = params || [];
        params.push(invocationHelper.deviceUniqueId);

        /*Default value for transactionID when passing null*/
        transactionID = transactionID || '';
        params.push(transactionID);

        invocationData = {
            adapter : adapter,
            procedure : procedureName,
            parameters : params
        };

        return invocationData;
    };

    /**
    * Método para probar conectividad contra el servidor de Mobile First
    * @method checkOnline
    * @public
    */
    invocationHelper.checkOnline = function(){
        var def = $q.defer();
        WL.Client.connect({
            onSuccess: function(){
                logManager.debug('** User is online!');
                def.resolve(true);
            },
            onFailure: function(){
                logManager.debug('** User is offline!');
                def.resolve(false);
            },
            timeout: 10000
        });
        return def.promise;
    };

    return invocationHelper;
}]);
