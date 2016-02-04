/**
 * Provider para el manejo de la ventana de ayuda
 * @class helpProvider
 * @constructor
 * @module sherpa
*/
angular.module('App')
    .factory('helpProvider',
    ['$rootScope','$ionicModal', '$timeout', 'invocationManager', 'logManager', 'configProvider', 'messagesProvider',
    function($rootScope, $ionicModal, $timeout, invocationManager, logManager, configProvider, messagesProvider) {

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        showView : showView,
        hideView : hideView,
        getHelp: getHelp
    };

    /**
     * Propiedad para almacenar el helpId.
     * @type {String}
     */
    self.currentHelpId = '';

    /**
     * [helpCache description]
     * @type {Object}
     */
    self.helpCache = {};

    /**
     * [helpTitleCache description]
     * @type {Object}
     */
    self.helpTitleCache = {};

    self.helpTitleCache[configProvider.help.idHelp] = '';

    /**
     * Metodo para mostrar el modal de ayuda en la pantalla.
     * @method showView
     * @param {Int} helpIdValue id del contenido a solicitar, si no se envia se asigna `1`.
     * @private
     */
    function showView(helpIdValue) {
        var helpId = helpIdValue || configProvider.help.idHelp;

        setCurrentHelpId(helpId);
        /**
         * Se declara el modal con la vista de la ayuda.
         */
        $ionicModal.fromTemplateUrl('views/help.html', {
            id: 'helpModal',
            scope: $rootScope,
            animation: 'slide-in-up',
            hardwareBackButtonClose: false,
            backdropClickToClose: true,
            focusFirstInput: false
        }).then(function(modal){
           $rootScope.helpModal = modal;
        });

        /**
         * Se muestra el modal.
         */
        $timeout(function(){
            $rootScope.helpModal.show();
        },500);
    }

    /**
     * Set currentHelpId para el primer llamado del servicio.
     * @method setCurrentHelpId
     * @param {String} id currentId para el primer llamado de la ayuda.
     */
    function setCurrentHelpId(id){
        self.currentHelpId = id;
    }

    /**
     * Get currentHelpId para el primer llamado del servicio.
     * @method getCurrentHelpId
     * @return {String} id currentId para el primer llamado de la ayuda.
     */
    function getCurrentHelpId(){
        return self.currentHelpId;
    }

    /**
     * Metodo para ocultar el modal de la ayuda.
     * @method hideView
     * @private
     */
    function hideView() {
        $rootScope.helpModal.hide();
    }

    /**
     * Método privado para procesar las respuestas exitosas del llamado a la función `getHelp`.
     * @method getHelpSuccess
     * @param {Object} response Objeto con la respuesta del servicio.
     * @param {Function} controllerCallback Función callback.
     * @private
     * @async
     */
    function getHelpSuccess(response, controllerCallback) {
        if (response.responseJSON.success) {
            self.helpCache[getCurrentHelpId()] = response.responseJSON.data;
            if (response.responseJSON.data.length >= 1 && !JSON.parse(response.responseJSON.data[0].isLeaf)) {
                angular.forEach(response.responseJSON.data, function(category) {
                    self.helpTitleCache[category.helpId] = category.content;
                });
            }
            if (typeof(controllerCallback) === 'function') {
                controllerCallback(self.helpCache[getCurrentHelpId()]);
            } else {
                logManager.error('ERROR SUCCESS help App');
            }
        } else {
            controllerCallback(null);
        }

    }

    /**
     * Método privado para procesar las respuestas fallidas del llamado a la función `getHelp`.
     * @method getHelpFail
     * @param {Object} error Objeto con la respuesta de error.
     * @param {Function} controllerCallback Función callback.
     * @private
     * @async
     */
    function getHelpFail(error, controllerCallback) {
        if (typeof(controllerCallback) === 'function') {
            controllerCallback(null);
        } else {
            logManager.error('ERROR help App');
            logManager.error(error);
        }
    }

    /**
     * Método para obtener los parámetros
     * @method getHelp
     * @param {Function} controllerCallback función success del controlador de la ayuda.
     * @param {String} parameter Nombre del parámetro a buscar.
     * @public
     */
    function getHelp(controllerCallback, idHelpValue) {
        var idHelp = idHelpValue || getCurrentHelpId();
        if(self.helpCache.hasOwnProperty(idHelp) && self.helpCache[idHelp].length !== 0) {
            if (typeof(controllerCallback) === 'function') {
                setCurrentHelpId(idHelp);
                controllerCallback(self.helpCache[idHelp]);
            } else {
                logManager.error('ERROR: getHelpProvider');
            }
        } else {
            getServiceHelp(controllerCallback, idHelp);
        }
    }

    /**
     * Metodo privado para llamar el servicio de la ayuda.
     * @method getServiceHelp
     * @param {Function} controllerCallback función success del controlador de la ayuda.
     * @param {Int} helpIdValue id del contenido a solicitar, si no se envia se solicitan las categorias.
     * @private
     * @async
     */
    function getServiceHelp(controllerCallback, idHelpValue) {
        var invocationData,
        params = [],
        idHelp = idHelpValue || getCurrentHelpId();
        setCurrentHelpId(idHelp);
        params.push(idHelp);

        if (typeof(controllerCallback) === 'function') {

            invocationData = invocationManager.getInvocationData(
                configProvider.middlewareAdapter,
                configProvider.getHelpProcedure,
                params
            );

            invocationManager.invokeAdaptherMethod(
                invocationData,
                function(response){
                    getHelpSuccess(response, controllerCallback);
                }, function (error) {
                    getHelpFail(error, controllerCallback);
                }
            );
        } else {
            getHelpFail({},controllerCallback);
        }
    }

    return self;

}]);
