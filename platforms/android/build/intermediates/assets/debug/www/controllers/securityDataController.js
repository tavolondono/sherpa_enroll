/**
* Controlador de la pantalla del paso 3 del registro liviano
* @class securityDataController
* @constructor
* @uses liteRegistryController
* @module sherpa
**/
angular.module('App')
    .controller('securityDataController',
     ['$scope', '$filter', 'messagesProvider', 'invocationManager', 'busyIndicator', 'errorManager',
      function ($scope, $filter, messagesProvider, invocationManager, busyIndicator, errorManager) {

    var self = this;

    /**
    * Instancia de la clase PasswordMeter que se encarga de validar el peso del password del usuario
    * @property pm
    * @type Object
    */
    self.pm = null;

    /**
    * Propiedad donde se almacenan el peso del password del usuario
    * @property valuePassword
    * @type String
    */
    self.valuePassword = null;

    /**
    * Propiedad donde se controla la visualización del password
    * @property showPasswordIsChecked
    * @type Boolean
    */
    self.showPasswordIsChecked = true;

    /**
    * Propiedad donde se almacenan el peso del password del usuario
    * @property stylePassword
    * @type String
    */
    self.stylePassword = '';

    /**
    * Función para actualizar la vista del usuario y quitarle los espacios
    **/
    $scope.$watch(function(scope) {
        return scope.registryController.registryModel.password;
    }, function(newValue, oldValue) {
        if ( (typeof newValue==='undefined' && typeof oldValue !== 'undefined') && (oldValue.length > 1 && typeof newValue === 'undefined') ) {
            newValue = oldValue;
        }
        $scope.registryController.registryModel.password = $filter('trimTex')(newValue);
    });

    /**
    * CallBack exitoso del metodo {{#crossLink "securityDataController/dataValidation:method"}}{{/crossLink}}
    * @method dataValidationSuccess
    * @param {Object} [response] objeto con la estructura de la respuesta
    * @param {Boolean} [response.success] variable `true`
    * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
    * @private
    * @async
    * @return Object Json con el resultado de la validación
    */
    function dataValidationSuccess(response) {
        busyIndicator.hide();
        if (response.responseJSON.success) {
            $scope.registryController.goToNextPage();
        } else {
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
    * CallBack error del metodo {{#crossLink "securityDataController/dataValidation:method"}}{{/crossLink}}
    * @method dataValidationFail
    * @param {Object} [error] objeto con la estructura de la respuesta
    * @param {Boolean} [error.success] variable `false`
    * @param {Object} [error.error] objeto con la descripción y el id del error
    * @private
    * @async
    * @return Object Json con datos del error
    */
    function dataValidationFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
    * Metodo para realizar el llamado al servicio para validar el email del usuario
    * @method dataValidation
    * @public
    */
    self.dataValidation = function() {
        var invocationData,
        params = [
            $scope.registryController.registryModel.email
        ];
        busyIndicator.show();

        invocationData = invocationManager.getInvocationData(messagesProvider.middlewareAdapter, messagesProvider.emailValidationProcedure, params);
        invocationManager.invokeAdaptherMethod(invocationData, dataValidationSuccess, dataValidationFail);
    };

    /**
    * Validar el peso de la contraseña
    * @method checkPassword
    * @public
    **/
    self.checkPassword = function(){
        var password;
        password = $scope.registryController.registryModel.password;
        self.pm = new PasswordMeter();
        self.pm.checkPassword(password);

        if (self.pm.Complexity.value === self.pm.COMPLEXITY.WEAK){
            self.valuePassword = messagesProvider.passwordMeter.weak;
            self.stylePassword = 'weak';
        } else if (self.pm.Complexity.value === self.pm.COMPLEXITY.FAIR){
            self.valuePassword = messagesProvider.passwordMeter.fair;
            self.stylePassword = 'fair';
        } else if (self.pm.Complexity.value === self.pm.COMPLEXITY.GOOD){
            self.valuePassword = messagesProvider.passwordMeter.good;
            self.stylePassword = 'good';
        } else if (self.pm.Complexity.value === self.pm.COMPLEXITY.STRONG){
            self.valuePassword = messagesProvider.passwordMeter.strong;
            self.stylePassword = 'strong';
        } else {
            self.valuePassword = messagesProvider.passwordMeter.veryWeak;
            self.stylePassword = 'veryWeak';
        }
    };

    /**
     * Método para ocultar y mostrar la contraseña.
     * @method showPassword
     * @public
    */
    self.showPassword = function () {
        self.showPasswordIsChecked = !self.showPasswordIsChecked;
    };

}]);
