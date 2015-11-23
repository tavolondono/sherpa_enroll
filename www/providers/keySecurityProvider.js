/**
 * Provider para el manejo de la ventana de ingreso de clave
 * se creo el provider para que la ventana se llame desde cualquier
 * lugar de la app.
 * @class keySecurityProvider
 * @constructor
 * @module sherpa
*/
angular.module('App')
    .factory('keySecurityProvider',
    ['$rootScope','$ionicModal', '$timeout', 'messagesProvider', 'invocationManager', 'logManager','cypherProvider', 'configProvider',
    function($rootScope, $ionicModal, $timeout, messagesProvider, invocationManager, logManager, cypherProvider, configProvider) {
    
    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        showView : showView,
        setParam: setParam,
        hideView : hideView,
        getControllerCallback: getControllerCallback,
        validationKey: validationKeySecurity,
        reset: reset
    };

    /**
     * Parametro para mostrar el titulo de la pagina.
     * @param {String} titlePage
     */
    self.titlePage = '';

    /**
     * Parametro para mostrar un titulo en la pagina antes de la descripción.
     * @param {String} title
     */
    self.title = '';

    /**
     * Parametro para mostrar la descripción en la pagina.
     * @param {String} description
     */
    self.description = '';

    /**
     * Parametro para almacenar el callBack del controlador que hace la
     * invocación del provider.
     * @param {function} callback
     */
    self.callback = null;

    /**
     * Metodo en el cual se resetean los parametros y se cierra el modal.
     * @method reset
     * @private
     */
    function reset(){
        self.titlePage = '';
        self.title = '';
        self.description = '';
        self.callback = null;
        hideView();
    }

    /**
     * Metodo para obtener el callBack del controlador que invoco al provider.
     * @method getControllerCallback
     * @private
     * @return {function} callback
     */
    function getControllerCallback(){
        return self.callback;
    }

    /**
     * Metodo para mostrar el modal en la pantalla.
     * @method showView
     * @private
     */
    function showView() {
        setTimeout(function(){
            $rootScope.keySecurityModal.show();
        },500);
    }

    /**
     * Metodo para setear los parametros del modal.
     * @param {object} params objeto con los parametros del modal.
     * @param {String} params.titlePage texto para mostrar el titulo de la pagina.
     * @param {String} params.title texto para mostrar un titulo en la pagina.
     * @param {String} params.description texto para mostrar la descripción en la pagina.
     * @param {function} params.callback función que se llama al finalizar la validación de la clave.
     * @method showView
     * @private
     */
    function setParam(params) {
        /**
         * Se declara el modal con la vista de ingreso de la clave.
        **/
        $ionicModal.fromTemplateUrl('views/key-security.html', {
            id: 'keySecurityModal',
            scope: $rootScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $rootScope.keySecurityModal = modal;
        });

        self.titlePage = params.titlePage || messagesProvider.keySecurity.titlePage;
        self.title = params.title || messagesProvider.keySecurity.title;
        self.description = params.description || messagesProvider.keySecurity.description;
        self.callback = params.callBack;
    }

    /**
     * Metodo para ocultar el modal de la clave.
     * @method hideView
     * @private
     */
    function hideView() {
        $rootScope.keySecurityModal.hide();
    }

    /**
     * Método privado para procesar las respuestas exitosas del llamado a la función `validationKeySecurity`.
     * @method validationkeySecuritySuccess
     * @param {Object} response Objeto con la respuesta del servicio.
     * @param {Function} controllerCallback Función callback.
     * @private
     * @async
     */
    function validationkeySecuritySuccess(response, controllerCallback) {
        if (typeof(controllerCallback) === 'function') {
            controllerCallback(response);
        } else {
            logManager.error('ERROR SUCCESS validation key security');
        }
    }

    /**
     * Método privado para procesar las respuestas fallidas del llamado a la función `validationKeySecurity`.
     * @method validationkeySecurityFail
     * @param {Object} error Objeto con la respuesta de error.
     * @param {Function} controllerCallback Función callback.
     * @private
     * @async
     */
    function validationkeySecurityFail(error, controllerCallback) {
        if (typeof(controllerCallback) === 'function') {
            controllerCallback(error);
        }
        else {
            logManager.error('ERROR validation key security');
        }
    }

    /**
     * Metodo privado para enviar la clave a validar.
     * @method validationKeySecurity
     * @async
     */
    function validationKeySecurity(password,controllerCallback) {
        var invocationData,
        params = [];
        cypherProvider.encryptPassword(password).then(function(response) {
            if(response.success){

                params.push(response.password);

                if (typeof(controllerCallback) === 'function') {
                    invocationData = invocationManager.getInvocationData(
                        configProvider.middlewareAdapter,
                        configProvider.validationkeySecurityProcedure,
                        params
                    );
                    invocationManager.invokeAdaptherMethod(
                        invocationData,
                        function(response){
                            validationkeySecuritySuccess(response, controllerCallback);
                        }, function (error) {
                            validationkeySecurityFail(error, controllerCallback);
                        }
                    );
                } else {
                    validationkeySecurityFail({},controllerCallback);
                }
            }
        }, function(error){
            validationkeySecurityFail(error, controllerCallback);
        });
    }

    return self;

}]);
