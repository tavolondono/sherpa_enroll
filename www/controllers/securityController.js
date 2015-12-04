/**
* Controlador para la pagina security de la app.
* @class securityController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('securityController',
    ['$scope', 'invocationManager', 'busyIndicator', '$timeout', 'errorManager', 
        'configProvider','$filter', 'cypherProvider', '$state', 'jsonStore', '$q', 
        '$ionicScrollDelegate', 'logManager', 'hardwareBackButtonManager', 
        '$ionicHistory', 'utilsProvider', '$rootScope',
    function ($scope, invocationManager, busyIndicator, $timeout, errorManager, 
    configProvider, $filter, cypherProvider, $state, jsonStore, $q, 
    $ionicScrollDelegate, logManager, hardwareBackButtonManager, 
    $ionicHistory, utilsProvider, $rootScope) {

    var self = this;

    /**
     * Propiedad para almacenar la informacion de la contraseña
     * @property password
     * @type String
     */
    self.password = null;

    /**
     * Propiedad para almacenar la informacion de la contraseña confirmada
     * @property confirm_password
     * @type String
     */
    self.confirmPassword = null;

    /**
     * Propiedad para la visibilidad del campo contraseña
     * @property showPassword
     * @type String
     */
    self.showPassword = false;

    /**
     * Propiedad para la visibilidad de la confimacion de contraseña
     * @property showConfirm
     * @type String
     */
    self.showConfirm = true;

    /**
     * Propiedad para almacenar el mensaje de error de igualdad de contraseña
     * @property errorMessage
     * @type String
     */
    self.errorMessage = $scope.i18n.liteRegistry.password.errorPIN;
    
    /**
     * Control para los checkbox
     */
    self.biometryCheckboxModel = {
        voice : false,
        facial : true
    };
    
    
    /**
     * 
     */    
    self.canDisableVoice = false;
    /**
     * 
     */
    self.canDisableFace = false;
    /**
     * 
     */
    self.hasChange = false;
    
    /**
     * Propiedad para controlar el ingreso a la página por primera vez
     * @type Boolean|Boolean
     */
    var counter = true;
    
    /**
     * Obliga a que haya al menos  un biométrico activado
     * @param {type} model
     * @returns {undefined}
     */
    self.almostOneValidation = function (model) {
        
        /**
         * model = 1 -> face
         * model = 2 -> voice
         */
        if(utilsProvider.validateNull(model)) {
            if (model === 1) {
                if (!$rootScope.actualUser.biometry.facial.hasFacial) {
                    console.log('Face: ');
                    $state.go("vinculacion-facial", {toPage : 'security'});
                } else {
                    $rootScope.actualUser.biometry.facial.enabled = self.biometryCheckboxModel.facial;
                }
            }            
            if (model === 2) {
                if (!$rootScope.actualUser.biometry.voice.hasVoice) {
                    console.log('Voice: ');
                    $state.go("vinculacion-voice", {toPage : 'security'});
                } else {
                    $rootScope.actualUser.biometry.voice.enabled = self.biometryCheckboxModel.voice;
                }
            }
        }
        /**
         * Valida que simpre haya un método biométrico activado
         */
        if (self.biometryCheckboxModel.voice && self.biometryCheckboxModel.facial) {
            self.canDisableVoice = false;
            self.canDisableFace = false;
        } else {
            if (self.biometryCheckboxModel.voice) {
                self.canDisableVoice = true;
                self.canDisableFace = false;
            }
            if (self.biometryCheckboxModel.facial) {
                self.canDisableFace = true;
                self.canDisableVoice = false;
            }
        }
    };

    self.validatePassword = function (){
        self.password = $filter('trimTex')(self.password);
        self.password = $filter('trimNumericKey')(self.password);
        if(self.password.length === 4){
            self.showConfirm = false;
        }
    };

    /**
     * Método para limpiar la informacion de la vista
     * @method validateConfim
     * @public
     */
    self.validateConfim = function (){
        self.confirmPassword = $filter('trimTex')(self.confirmPassword);
        self.confirmPassword = $filter('trimNumericKey')(self.confirmPassword);

        if(self.confirmPassword.length === 4){
            if(self.confirmPassword === self.password){

                cypherProvider.encryptPassword(self.confirmPassword).then(function(response) {
                    self.cleanView();
                    updatePassword(response.password);
                }, function(error) {
                    self.cleanView();
                    errorManager.showAsyncMessage(error.responseJSON.error);
                });

            }else{
                errorManager.showAsyncMessage(self.errorMessage);
                self.cleanView();
            }

        }

    };

    /**
     * Método para limpiar la informacion de la vista
     * @method cleanView
     * @public
     */
    self.cleanView = function(){
        self.showConfirm = true;
        self.password = null;
        self.confirmPassword = null;
        $ionicScrollDelegate.scrollTop();
    };

    /**
     * Método para habilitar los campos de restablecimiento de la contraseña
     * @method activate
     * @public
     */
    self.activate = function(value){
        self.showPassword = value;
        self.cleanView();
    };

    /**
     * CallBack error del metodo updatePassword
     * @method updatePasswordFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `false`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     * @return Object Json con datos del error
     */
    function updatePasswordFail(error){
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * CallBack exitoso del metodo updatePassword
     * @method updatePasswordSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @private
     * @return Object Json con el resultado de la validación
     */
    function updatePasswordSuccess(response){
        busyIndicator.hide();
        if (response.responseJSON.success) {
            self.showPassword = false;
            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                if (typeof responseJsonStore[0].json.data.auth.password !== 'undefined') {
                    responseJsonStore[0].json.data.auth.password = self.password;
                    self.showPassword = false;
                }

                jsonStore.replace(responseJsonStore).then(function() {
                    $state.go('operationResult',{
                        type: 'success',
                        value: 'security',
                        referentClose: function(){$ionicHistory.goBack();},
                        referentAccept: function(){$state.go('dashboard');},
                        referentCancel: function(){$ionicHistory.goBack();}
                    });
                }, function(error) {
                    /*Mostrar mensaje de errror*/
                    logManager.error(error);
                });
            });

        }else{
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
     * Método para actualizar la contraseña del usuairo
     * @method updatePassword
     * @private
     */
    function updatePassword(pass){
        var invocationData,
        params = [];
        busyIndicator.show();
        self.password = pass;
        params.push(pass);

        invocationData = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.changePasswordProcedure,
            params
        );
        invocationManager.invokeAdaptherMethod(invocationData, updatePasswordSuccess, updatePasswordFail);
    }

    /**
     * Método para verificar cual es la pantalla previa a la que se debe ir
     * @method goBack
     * @public
     */
    self.goBack = function(){
        $state.go('profile');
    };

    /**
     * Implementación para ejecutar metodos al salir de la pantalla.
     * @method $ionicView.afterLeave
     * @async
    **/
    $scope.$on('$ionicView.afterLeave', function() {
        self.cleanView();
        self.showPassword = false;
    });

    /**
     * Implementación para ejecutar metodos al entrar en la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function(){
        $ionicScrollDelegate.scrollTop();
        
        if (utilsProvider.validateNull($rootScope.actualUser.biometry)) {
            if(utilsProvider.validateNull($rootScope.actualUser.biometry.facial)) {
                self.biometryCheckboxModel.facial = $rootScope.actualUser.biometry.facial.enabled;
                self.canDisableFace = false;
            }
            if(utilsProvider.validateNull($rootScope.actualUser.biometry.voice)) {
                self.biometryCheckboxModel.voice = $rootScope.actualUser.biometry.voice.enabled;
                self.canDisableVoice = false;
            }
        }
        self.almostOneValidation();
        hardwareBackButtonManager.enable(self.goBack);
        
        
        
    });

}]);
