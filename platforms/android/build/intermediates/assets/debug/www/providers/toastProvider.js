/**
* Provider para el manejo del componente toast
* @class toastProvider
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('toastProvider', ['ngToast', '$timeout', function(toast, $timeout) {
    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        showMessage : showMessage,
        showAsyncMessage : showAsyncMessage,
        hideMessage : hideMessage
    };
    /**
    * Metodo para mostrar el mensaje en la pantalla, con la configuración predeterminada
    * @method showMessage
    * @private
    * @param content {String} Contenido del mensaje.
    * @param typeValue {String} Tipo del mensaje que se enviará.
    * @param closeButton {Boolean} Indica si se muestra opcion para cerrar.
    */
    function showMessage(content, typeValue, closeButton) {
        var type = typeValue || 'danger';
        var close = closeButton || false;
        toast.create({
            className: type,
            content: content,
            animation: 'slide',
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissButton : close
        });
    }
    /**
    * Metodo para mostrar el mensaje de manera asincrona, cuando es llamado desde un callback
    * @method showAsyncMessage
    * @private
    * @param content {String} Contenido del mensaje.
    * @param typeValue {String} Tipo del mensaje que se enviará.
    */
    function showAsyncMessage(content, typeValue) {
        $timeout(function() {
            showMessage(content, typeValue, false);
        }, 100);
    }
    /**
    * Metodo para ocultar el toast de la pantalla
    * @method hideMessage
    * @private
    */
    function hideMessage() {
        toast.dismiss();
    }

    return self;

}]);
