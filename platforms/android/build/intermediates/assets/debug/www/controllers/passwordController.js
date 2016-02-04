/**
* Descripción controlador para manejar la vista password.
* @class passwordController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('passwordController',
    ['$scope', '$state', 'invocationManager', 'busyIndicator', 'userState','jsonStore', 
        'configProvider', 'errorManager', '$filter', '$ionicModal', 
        'hardwareBackButtonManager', '$ionicHistory', 'detectIdProvider', 
        'logManager', 'utilsProvider', 'messagesProvider', '$rootScope', 'userManager',
    function ($scope, $state, invocationManager, busyIndicator, userState, 
    jsonStore, configProvider, errorManager, $filter, $ionicModal, 
    hardwareBackButtonManager, $ionicHistory, detectIdProvider, logManager, 
    utilsProvider, messagesProvider, $rootScope, userManager) {

    var self = this;

    hardwareBackButtonManager.enable(self.noProvisionedPhone);

    /**
     * Propieda para almacenar el valor de la contraseña
     * @property password
     * @type String
     */
    self.password = null;

    /**
     * Creación de modal de aprovisionamiento.
     */
    $ionicModal.fromTemplateUrl('views/modal-provisioned.html', {
        id: 'provisionedModal',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.provisionedModal = modal;
    });

    /**
     * Creación de modal de ingresar clave ultima vez
     */
    $ionicModal.fromTemplateUrl('views/modal-final-warning.html', {
        id: 'finalWarningModal',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.finalWarningModal = modal;
    });

    /**
     * Creación de modal de acceso blockeado
     */
    $ionicModal.fromTemplateUrl('views/modal-block-account.html', {
        id: 'blockAccountModal',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.blockAccountModal = modal;
    });

    /**
     * Accion para dirigir al userLogin en el modal de bloqueo
     */
    $scope.$on('modal.hidden', function(event, modal) {
        if(modal.id === 'blockAccountModal'){
            $state.go('userLogin');
        }
    });

    /**
     * Callback para cuando la respuesta de la promesa fue exitosa
     * @method submitLoginSuccess
     * @param response {Object}
     * @private
     */
    function submitLoginSuccess(response) {
        self.password = null;
        busyIndicator.hide();
        if (typeof response.responseJSON !== 'undefined' && response.responseJSON.isSuccessful) {

            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {

                /*Revisar aprovisionamiento de easy solution.*/
                detectIdProvider.isDeviceProvisioned().then(function(success){
                    logManager.debug(success);

                    if($scope.errorSoftToken){
                        $scope.provisionedModal.show();
                        $scope.errorSoftToken = null;
                    }else if (JSON.parse(success)) {
                        responseJsonStore[0].json.data.session = true;
                        responseJsonStore[0].json.data.auth.state = $scope.userApp.state;
                        jsonStore.replace(responseJsonStore).then(function() {
                             $state.go('dashboard');
                        });
                    }else {
                        $scope.provisionedModal.show();
                        $scope.errorSoftToken = null;
                    }
                }, function(error){
                    /*Error en la validación de aprovisionamiento.*/
                    logManager.error(error);
                    error = errorManager.createErrorInstance(configProvider.errors.provisioning.isDeviceProvisionedError);
                    errorManager.showAsyncMessage(error.responseJSON.error);
                });

            });
        } else {
            if(response.responseJSON.error.attempts === '0' && response.responseJSON.error.timeUnblock === '00:00:00') {
                $scope.goToRecoverPassword();
            } else if (response.responseJSON.error.attempts === '0' && response.responseJSON.error.timeUnblock !== '00:00:00') {
                $scope.blockAccountModal.show();
                messagesProvider.blockAccountModal.time = response.responseJSON.error.timeUnblock;
            } else if(response.responseJSON.error.attempts === '1'){
                $scope.finalWarningModal.show();
            } else{
                errorManager.showAsyncMessage(response.responseJSON.error);
            }
        }
    }

    /**
     * Callback para cuando la respuesta de la promesa fue fallida
     * @method submitLoginFail
     * @param response {Object}
     * @private
     */
    function submitLoginFail(error) {
        self.password = null;
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Método para realizar el llamado al servicio para la validacion del login
     * @method submitLogin
     * @private
     */
    function submitLogin () {
        busyIndicator.show();
        var phoneNumber = $scope.userApp.phoneNumber,
        password = self.password,
        deviceInfo = '',
        options = '',
        param = [];

        userState.construct();

        userState.setParams({
            username : phoneNumber,
            password : password,
            deviceInfo: deviceInfo
        });

        options = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.userAuthenticationProcedure,
            param
        );
        $rootScope.actualUser.hasPassword = true;
        $rootScope.actualUser.password = password;
        userManager.saveUser($rootScope.actualUser);
        $state.go("registry.biometryConfigAccount");
//        userState.login(options).then(submitLoginSuccess, submitLoginFail);
    }

    $scope.$on('$ionicView.beforeEnter', function(){
        self.password = null;
        hardwareBackButtonManager.enable(self.noProvisionedPhone);
    });

    /*
     * Funcion Para enviar el PIN
     */
    self.validate = function(val){
        self.password = $filter('trimTex')(val);
        self.password = $filter('trimNumericKey')(val);

        if (self.password.length===4){
            submitLogin();
        }
    };

    /**
     * Callback para cuando se genera un nuevo OTP
     * @method generateOTPSuccess
     * @param response {Object}
     * @private
     */
    function generateOTPSuccess (response) {
        busyIndicator.hide();
        if (response.responseJSON.success) {
            $scope.provisionedModal.hide();
            $state.go('token', {provisionedRegistry: true});
        }else{
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
     * Callback de error para cuando se genera un nuevo OTP
     * @method generateOTPFail
     * @param error {Object}
     * @private
     */
    function generateOTPFail (error) {
        self.password = null;
        userState.checkUser().then(function(data){
            if (data) {
                userState.logout(true).then(function(){});
            }
        });
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo para hacer la invocacion al servicio de generar un nuevo OTP para el usuario.
     * @method generateOTP
     * @private
     */
    function generateOTP () {
        var param = [],
        invocationData;

        busyIndicator.show();

        param = [
            $scope.userApp.phoneNumber
        ];

        invocationData = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.generateOTPProcedure,
            param
        );

        invocationManager.invokeAdaptherMethod(
            invocationData,
            generateOTPSuccess,
            generateOTPFail
        );
    }

    /**
     * Metodo para generar un OTP y aprovisionar el dispositivo.
     * @method provisionedPhone
     * @public
     */
    self.provisionedPhone = function () {
        deleteDevice();
    };

    /**
     * Metodo para llamar el loguot desde la pantalla.
     * @method noProvisionedPhone
     * @public
     */
    self.noProvisionedPhone = function () {
        jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
            if (responseJsonStore.length > 0) {
                responseJsonStore[0].json.data.session = false;
                jsonStore.replace(responseJsonStore).then(function() {
                    logout();
                });
            }
        });
    };

    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    function logout () {
        $scope.provisionedModal.hide();

        userState.checkUser().then(function(data){
            if (data) {
                userState.logout(true).then(function(){
                    $state.go('userLogin');
                });
            } else {
                $ionicHistory.goBack();
            }
        });
    }

    /**
    * CallBack exitoso del metodo {{#crossLink "deleteDevice/deleteDeviceSuccess:method"}}{{/crossLink}}
    * @method deleteDeviceSuccess
    * @param {Object} [response] objeto con la estructura de la respuesta
    * @param {Boolean} [response.success] variable `true`
    * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
    * @private
    * @return Object Json con el resultado de la operacion
    */
    function deleteDeviceSuccess(response){
        busyIndicator.hide();
        if (response.responseJSON.success) {
            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                if (responseJsonStore.length > 0) {
                    responseJsonStore[0].json.data.session = false;
                    jsonStore.replace(responseJsonStore).then(function() {
                        generateOTP();
                    });
                }
            });
        }else{
            errorManager.showAsyncMessage(response.responseJSON.error);
            self.noProvisionedPhone();
        }
    }

    /**
    * CallBack error del metodo {{#crossLink "deleteDevice/deleteDeviceSFail:method"}}{{/crossLink}}
    * @method deleteDeviceSFail
    * @param {Object} [error] objeto con la estructura de la respuesta
    * @param {Boolean} [error.success] variable `false`
    * @param {Object} [error.error] objeto con la descripción y el id del error
    * @private
    * @return Object Json con datos del error
    */
    function deleteDeviceSFail(error){
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
        self.noProvisionedPhone();
    }

    /**
     * Metodo que invoca la eliminacion de dispositivos en DetectID
     * @method deleteDevice
     * @private
     */
    function deleteDevice(){
        var param = [],
        invocationData;

        busyIndicator.show();

        invocationData = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.deleteDeviceProcedure,
            param
        );

        invocationManager.invokeAdaptherMethod(
            invocationData,
            deleteDeviceSuccess,
            deleteDeviceSFail
        );
    }

    /**
     * Metodo para ir a recuperar la contraseña
     * @method goToRecoverPassword
     * @public
     */
    $scope.goToRecoverPassword = function(){
        $state.go('recoverPassMail');
        $scope.finalWarningModal.hide();
    };

}]);
