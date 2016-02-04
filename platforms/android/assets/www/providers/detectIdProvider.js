/**
* Provider para el manejo de las funciones de contactos con el dispositivo
* @class detectIdProvider
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('detectIdProvider',
        [ '$q', 'logManager', 'errorManager', 'configProvider', 'utilsProvider', 'jsonStore',
        function($q, logManager, errorManager, configProvider, utilsProvider, jsonStore) {
    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        deviceRegistrationByActivationCode: deviceRegistrationByActivationCode,
        getSoftToken: getSoftToken,
        isDeviceProvisioned: isDeviceProvisioned
    },
    PLUGIN_NAME = 'DetectIDPlugin',
    DEVICE_REGISTRATION_ACTION_NAME = 'deviceRegistrationByActivationCode',
    GET_SOFT_TOKEN_ACTION_NAME = 'getSoftToken',
    IS_DEVICE_PROVISIONED = 'isDeviceProvisioned';

    /**
    * Función que se encarga de aprovisionar un dispositivo por
    * medio de un código
    * @method deviceRegistrationByActivationCode
    * @param activationCode {String}
    * @public
    */
    function deviceRegistrationByActivationCode (activationCode){
        var deferer = $q.defer(),
        error;

        if (utilsProvider.validateNull(WL) && utilsProvider.validateNull(WL.Logger) &&
                WL.Client.getEnvironment() !== WL.Environment.PREVIEW &&
                WL.Client.getEnvironment() !== WL.Environment.DESKTOPBROWSER) {
            cordova.exec(function (data){
                logManager.log('Aprovisionamiento exitoso: '+data);
                deferer.resolve(data);
            }, function (data) {
                error = errorManager.createErrorInstance(configProvider.errors.provisioning.deviceRegistrationError);
                logManager.error(error.responseJSON.error.errorMessage+ ': ' +data);

                deferer.reject(data);
            }, PLUGIN_NAME, DEVICE_REGISTRATION_ACTION_NAME, [activationCode]);
        } else {
            logManager.log('Aprovisionamiento fake exitoso: ');
            deferer.resolve({});
        }
        return deferer.promise;
    }

    /**
    * Función que se encarga de generar un token con el SDK para
    * ser enviado en las transacciones
    * @method getSoftToken
    * @public
    */
    function getSoftToken(){
        var deferer = $q.defer(),
        error;
        if (utilsProvider.validateNull(WL) && utilsProvider.validateNull(WL.Logger) &&
                WL.Client.getEnvironment() !== WL.Environment.PREVIEW &&
                WL.Client.getEnvironment() !== WL.Environment.DESKTOPBROWSER) {
            cordova.exec(function (data){
                logManager.log('Soft Token: '+data);
                deferer.resolve(data);
            }, function (data) {
                error = errorManager.createErrorInstance(configProvider.errors.provisioning.softTokenError);
                logManager.error(error.responseJSON.error.errorMessage+ ': ' +data);

                deferer.reject(data);
            }, PLUGIN_NAME, GET_SOFT_TOKEN_ACTION_NAME, []);
        } else {
            logManager.log('Soft Token fake');
            deferer.resolve('faketoken');
        }

        return deferer.promise;
    }

    /**
    * Función que se encarga de validar si un dispositivo está aprovisionado
    * @method isDeviceProvisioned
    * @public
    */
    function isDeviceProvisioned(){
        var deferer = $q.defer(),
        error;

        if (utilsProvider.validateNull(WL) && utilsProvider.validateNull(WL.Logger) &&
                WL.Client.getEnvironment() !== WL.Environment.PREVIEW &&
                WL.Client.getEnvironment() !== WL.Environment.DESKTOPBROWSER) {
            cordova.exec(function (data){
                logManager.log('Dispositivo aprovisionado: '+data);
                deferer.resolve(data);
            }, function (data) {

                error = errorManager.createErrorInstance(configProvider.errors.provisioning.isDeviceProvisionedError);
                logManager.error(error.responseJSON.error.errorMessage+ ': ' +data);

                deferer.reject(data);
            }, PLUGIN_NAME, IS_DEVICE_PROVISIONED, []);
        } else {
            logManager.log('Is device provisioned fake');
            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                if (utilsProvider.validateNull(responseJsonStore[0].json.data)) {
                    deferer.resolve(responseJsonStore[0].json.data.provisioned);
                } else {
                    deferer.resolve(false);
                }
            });
        }

        return deferer.promise;
    }

    return self;
}]);