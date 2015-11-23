/**
* Manager para los mensajes de error que se muestran al usuairo
* @class deviceManager
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('errorManager',
    ['toastProvider', 'configProvider',
    function(toastProvider, configProvider) {

    var CONNECTION_ERROR = configProvider.errors.con001.code,
    CONNECTION_ERROR_ADAPTER = configProvider.errors.con002.code,
    errorConnectionTest = configProvider.errors.con002.text,
    errorConnectionTestAdapter = configProvider.errors.con002.text,
    GENERAL_ERROR = configProvider.errors.generalError,
    errorManager = {};

    /**
     * Para mostrar el mensaje de error al usuario usando metodo showMessage del toastProvider
     * @method showMessage
     * @param {Object} error Objeto o String del error.
     * @param {String} error.errorCode Codigo con el que se identifica el error.
     * @param {String} error.errorMessage Mensaje del error cuando el error es un objeto.
     * @param {String} typeErrorValue Tipo con el que se visualiza el error `informativo` o `error`.
     * @public
     */
    errorManager.showMessage = function(error, typeErrorValue){
        var errorCode = error &&  error.errorId ? error.errorId : '',
        typeError = typeErrorValue || configProvider.toastTypeMessage.danger,
        errorMessage = error && error.errorMessage ? error.errorMessage : error;
        toastProvider.hideMessage();

        if(!error){
            toastProvider.showMessage(GENERAL_ERROR, typeError);
        }else if (errorCode === CONNECTION_ERROR || errorCode === CONNECTION_ERROR_ADAPTER) {
          toastProvider.showMessage(errorConnectionTest, configProvider.toastTypeMessage.information, true);
        }else {
          toastProvider.showMessage(errorMessage, typeError);
        }
    };

    /**
     * Para mostrar el mensaje de error al usuario usando metodo showAsyncMessage del toastProvider
     * @method showAsyncMessage
     * @param {Object} error Objeto o String del error.
     * @param {String} error.errorCode Codigo con el que se identifica el error.
     * @param {String} error.errorMessage Mensaje del error cuando el error es un objeto.
     * @param {String} typeErrorValue Tipo con el que se visualiza el error `informativo` o `error`.
     * @public
     */
    errorManager.showAsyncMessage = function(error, typeErrorValue){
        toastProvider.hideMessage();
        var errorCode = error && error.errorId ? error.errorId : '',
        typeError = typeErrorValue || configProvider.toastTypeMessage.danger,
        errorMessage = error && error.errorMessage ? error.errorMessage : error;

        if(!error){
            toastProvider.showMessage(GENERAL_ERROR, typeError);
        }else if (errorCode === CONNECTION_ERROR || errorCode === CONNECTION_ERROR_ADAPTER) {
          toastProvider.showMessage(errorConnectionTestAdapter, configProvider.toastTypeMessage.information, true);
        }else {
          toastProvider.showAsyncMessage(errorMessage, typeError);

        }
    };

    /**
     * Para crear una instancia del objeto de error con un código específico
     * @method createErrorInstance
     * @param errorCode {String}
     * @public
     */
    errorManager.createErrorInstance = function(errorCode){
        var errorMessage = configProvider.errorMessages[errorCode] || configProvider.errors.generalError,
        jsonResponse = {
            'responseJSON':{
                'success': false,
                'error':{
                    'errorId':errorCode,
                    'errorMessage': errorMessage
                }
            }
        };
        return jsonResponse;
    };

  return errorManager;

}]);
