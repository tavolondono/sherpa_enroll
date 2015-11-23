/**
 * Controlador para solicitar el token enviado para validar la identidad
 * @class requestTokenController
 * @constructor
 * @module sherpa
 */
angular.module('App')
    .controller('requestTokenController',
    ['$timeout', '$scope', '$ionicModal', 'configProvider', 'invocationManager', 
        '$state', 'busyIndicator', 'jsonStore', 'errorManager', '$filter', 'hardwareBackButtonManager', 
        'toastProvider', '$stateParams', 'logManager', '$ionicHistory', 
        'utilsProvider', 'messagesProvider', '$rootScope', 'userManager',
    function ($timeout, $scope, $ionicModal, configProvider, invocationManager, 
    $state, busyIndicator, jsonStore, errorManager, $filter, hardwareBackButtonManager, 
    toast, $stateParams, logManager, $ionicHistory, utilsProvider, messagesProvider, $rootScope, userManager) {
        
    var self = this;

    hardwareBackButtonManager.enable(self.goBack);

    /**
     * Propiedad donde verificamos si el teclado se esta mostrando
     * @property keyboardShow
     * @type boolean
     */
    self.keyboardShow = false;

    /**
     * Propiedad donde se almacena el celular para el enrolamiento
     * @property currentPhoneNumber
     * @type String
     */
    self.currentPhoneNumber = null;

    /**
     * Propiedad para validar que el token sea ingresado
     * @property invalidToken
     * @type boolean
     */
    self.invalidToken = false;

    /**
     * Propiedad donde se almacena el token
     * @property token
     * @type Int
     */
    self.token = null;

    /**
     * Propiedad para revisar los reintentos del token.
     * @property isRetryToken
     * @type boolean
     */
    self.isRetryToken = true;

    /**
     * Propiedad para detectar si se llama el servicio de validar token de vinculados.
     * @property provisionedRegistry
     * @type Int
     */
    self.provisionedRegistry = false;
    
    
    self.providedToken = null;

    /**
     * Metodo para mostrar el modal en la pantalla
     * @method openLocationsModal
     * @public
     */
    $scope.openLocationsModal = function() {
      $scope.locationsModal.show();
    };

    /**
     * Metodo para cerrar el modal en la pantalla
     * @method closeLocationsModal
     * @public
     */
    $scope.closeLocationsModal = function() {
        $scope.locationsModal.hide();
    };
    
    busyIndicator.hide();
    
    
    self.getNewOtp = function () {
        $timeout(function () {
            toast.hideMessage();
            self.providedToken = generateRandomOTP();
            var otp = self.providedToken;
            toast.showAsyncMessage(messagesProvider.cashout.response.title + " " + otp);
        }, 2000);
    };
    
    self.getNewOtp();
    $ionicModal.fromTemplateUrl('views/modal-token.html', {
        id: 'locationsModal',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.locationsModal = modal;
    });

    /**
     * Callback para cuando la validacion del token fue exitosa
     * @method validateTokenSuccess
     * @param response {Object}
     * @private
     */
    function validateTokenSuccess (response) {
        var sherpaData,
        softToken,
        error;

        if (response.responseJSON.success) {

            jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
                sherpaData = resp;
                if(sherpaData.length > 0) {
                    sherpaData[0].json.data.contacts = null;
                    sherpaData[0].json.data.lastTranfersMoney = [];
                    sherpaData[0].json.data.lastRequestMoney = [];
                    sherpaData[0].json.data.lastCashout = [];
                    sherpaData[0].json.data.firstPay = null;
                    sherpaData[0].json.data.loadModal = null;
                    sherpaData[0].json.data.permission = {
                        cam: null
                    };

                    if (!self.provisionedRegistry) {
                        /*Enrolados*/
                        busyIndicator.hide();
                        if (response.responseJSON.data.state === configProvider.userStates.enroll) {
                            sherpaData[0].json.data.session = true;
                            sherpaData[0].json.data.phoneNumber = self.currentPhoneNumber;
                            sherpaData[0].json.data.auth.state = response.responseJSON.data.state;
                            sherpaData[0].json.data.auth.user = self.currentPhoneNumber;

                            jsonStore.replace(sherpaData).then(function() {
                                $scope.userApp.state = response.responseJSON.data.state;
                                $scope.userApp.phoneNumber = self.currentPhoneNumber;
                                $state.go('dashboard');
                            });
                        }
                    } else {
                        /*Vinculados sin aprovisionar*/
                        $scope.userApp.state = configProvider.userStates.liteRegistry;
                        $scope.userApp.phoneNumber = self.currentPhoneNumber;
                        if (typeof response.responseJSON.data!== 'undefined' &&
                            typeof response.responseJSON.data.softToken !== 'undefined') {
                            softToken = response.responseJSON.data.softToken;
                            provisioning(softToken);
                        } else {
                            /*No se tiene softToken*/
                            busyIndicator.hide();
                            error = errorManager.createErrorInstance(configProvider.errors.provisioning.deviceRegistrationError);
                            logManager.error(error.responseJSON.error.errorMessage);
                            errorManager.showAsyncMessage(error.responseJSON.error);
                        }
                    }

                } else {
                    busyIndicator.hide();
                    logManager.error('Json sin iniciar');
                }

            });
        } else {
            busyIndicator.hide();
            self.isRetryToken = JSON.parse(response.responseJSON.data.flagAttempts);
            self.token = null;
            $scope.locationsModal.show();
        }
    }

    /**
     * Callback para cuando la validacion del token fue erronea
     * @method validateTokenFail
     * @param error {Object}
     * @private
     */
    function validateTokenFail (error) {
        self.token = null;
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo para hacer la invocacion al servicio de validacion de token.
     * @method validateToken
     * @public
     */
    self.validateToken = function () {       
        busyIndicator.hide();
        if (self.token === self.providedToken) {
            $rootScope.actualUser.hasDeviceProvided = true;
            userManager.saveUser($rootScope.actualUser);
            $state.go('registry.biometryConfigAccount');
        } else {
            busyIndicator.hide();
            self.token = "";
            errorManager.showAsyncMessage(messagesProvider.enrollment.requestTokenTitleErrorModal + 
                    ", " + messagesProvider.enrollment.requestTokenContextErrorModal +                     
                    ". " + messagesProvider.enrollment.requestTokenButtonErrorModal);
        }
    };

    /**
     * Metodo para validar que el campo del token sea ingresado
     * @method validateFieldToken
     * @public
     */
    self.validateFieldToken = function() {
        $timeout(function(){
            self.keyboardShow = false;
        }, 300);
    };

    /**
     * Metodo para ir a la pantalla anterior y solicitar un nuevo token [Modal]
     * @method goToRequestPhoneNumber
     * @public
     */
    self.goToRequestPhoneNumber = function() {
        $scope.locationsModal.hide();
        self.generateOTP();
    };

    /**
     * Metodo para ir reintentar validar de nuevo el token [Modal]
     * @method requestValidateTokenAgain
     * @public
     */
    $scope.requestValidateTokenAgain = function() {
        $scope.locationsModal.hide();
    };

    /*
     * Funcion Para enviar el token
     */
    $scope.$watch(function(scope) {
        return scope.tokenControl.token;
    }, function(newValue, oldValue) {
        $scope.tokenControl.token = $filter('trimTex')(newValue);
        $scope.tokenControl.token = $filter('trimNumericKey')(newValue);
        if ( (utilsProvider.validateNull(oldValue) && oldValue.length > 1) && (newValue==='' || newValue===undefined) ) {
            $scope.tokenControl.token = oldValue;
        }
        if ($scope.tokenControl.token.length===configProvider.smsTokenSize){
            self.validateToken();
        }
    });

    /**
     * Ciclo de vida de la vista para setear la variable del phoneNumber
     * cuando llega desde login.
     * @method $ionicView.beforeEnter
     * @async
     */
    $scope.$on('$ionicView.beforeEnter', function(){
        self.currentPhoneNumber = null;
        if ($scope.userApp.phoneNumber !== '' && $scope.userApp.phoneNumber!== null) {
            self.currentPhoneNumber = $scope.userApp.phoneNumber;
        }
        self.provisionedRegistry = $stateParams.provisionedRegistry || false;
        self.token = null;
    });

    /**
     * Callback para cuando se genera un nuevo OTP
     * @method generateOTPSuccess
     * @param response {Object}
     * @private
     */
    function generateOTPSuccess (response) {
        busyIndicator.hide();
        if (response.responseJSON.success) {
            toast.hideMessage();
            toast.showAsyncMessage('Se genero OTP', 'success');
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
        self.token = null;
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo para hacer la invocacion al servicio de generar un nuevo OTP para el usuario.
     * @method generateOTP
     * @public
     */
    self.generateOTP = function () {
        var param = [],
        invocationData;

        busyIndicator.show();

        param = [
            self.currentPhoneNumber
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
    };

    /**
     * CallBack exitoso del llamado a activateDevice.
     * @method provisioningSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable true
     * @param {Object} [response.error] objeto con la descripción y el id del error.
     * @private
     */
    function provisioningSuccess (response){
        var sherpaData;
        busyIndicator.hide();
        if (response.responseJSON.success) {
            jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
                sherpaData = resp;
                if(sherpaData.length > 0) {
                    sherpaData[0].json.data.session = true;
                    sherpaData[0].json.data.phoneNumber = self.currentPhoneNumber;
                    sherpaData[0].json.data.auth.state = configProvider.userStates.liteRegistry;
                    sherpaData[0].json.data.auth.user = self.currentPhoneNumber;

                    jsonStore.replace(sherpaData).then(function() {
                        $state.go('dashboard');
                    });
                } else {
                    logManager.error('Json sin iniciar');
                }
            });
        } else {
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
     * CallBack error del llamado a activateDevice.
     * @method provisioningFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable false
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     */
    function provisioningFail (error){
        busyIndicator.hide();
        logManager.error(error);
        self.token = null;
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo para hacer la invocacion al servicio de aprovisionar el dispositivo del usuario.
     * @method provisioning
     * @public
     */
    function provisioning (softTokenValue) {
        var params = [],
        invocationData,
        error;
        
    }

    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    function logout () {        
        $state.go('registry.biometryConfigAccount');
        /*
        userState.checkUser().then(function(data){
            if (data) {
                userState.logout(true).then(function(){
                    $state.go('userLogin');
                });
            } else {
                logManager.debug('Logout request token');
            }
        
        });*/
    }

    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    self.goBack = function () {
        if (self.provisionedRegistry) {
            logout();
        } else {
            $ionicHistory.goBack();
        }
    };
    
    generateRandomOTP = function(){
        var min = 0000;
        var max = 9999;
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        
        return String(num);
    };

}]);
