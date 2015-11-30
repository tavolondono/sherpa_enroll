/**
* Controlador para manejar la vista de loginUser.
* @class userLoginController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('userLoginController',
    ['$scope', '$state', 'configProvider', 'messagesProvider', 'invocationManager',
        '$filter', 'busyIndicator', 'toastProvider', '$ionicPopup','jsonStore', 
        'errorManager', 'utilsProvider', '$rootScope', 'Camera', 'userManager',
    function ($scope, $state, configProvider, messagesProvider, invocationManager, 
    $filter, busyIndicator, toast, $ionicPopup, jsonStore, errorManager, 
    utilsProvider, $rootScope, Camera, userManager) {

    var self = this;

    /**
     * Cadena con el teléfono o email del usuario
     * @property sherpaUserName
     * @type String
    */
    self.sherpaUserName = null;

    /**
     * Bandera para validar si el sherpaUserName es un teléfono valido.
     * @property validPhoneNumber
     * @type Bolean
    */
    self.validPhoneNumber = 0;

    /**
     * Bandera para validar si el sherpaUserName es un email valido.
     * @property validEmail
     * @type Bolean
    */
    self.validEmail = 0;

    /**
     * Bandera para validar si el formulario es valido.
     * @property validForm
     * @type Bolean
    */
    self.validForm = true;
    
    
    
    self.doesNotBiometry = true;
    self.puedeSeguir = false;   
    
    self.hasFacial = false;
    self.hasVoice = false;
    

    /**
     * Función para actualizar la vista del usuario y quitarle los espacios
    **/
    $scope.$watch(function(scope) {
        return scope.userLoginControl.sherpaUserName;
    }, function(newValue) {
        $scope.userLoginControl.sherpaUserName = $filter('trimTex')(newValue);
    });
    
    
    
    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function(){
        if(utilsProvider.validateNull($rootScope.actualUser)) {
            console.log($rootScope.actualUser);
            if($rootScope.actualUser.hasBiometry) {
                self.doesNotBiometry = false;
                if ($rootScope.actualUser.hasBiometry) {
                    if (utilsProvider.validateNull($rootScope.actualUser.biometry.facial)) {
                        self.hasFacial = $rootScope.actualUser.biometry.facial.enabled;
                        userManager.saveUser($rootScope.actualUser);
                    }                    
                    if (utilsProvider.validateNull($rootScope.actualUser.biometry.voice)) {
                        self.hasVoice = $rootScope.actualUser.biometry.voice.enabled;
                        userManager.saveUser($rootScope.actualUser);
                    }
                }                
            } else {
                self.doesNotBiometry = true;
            }
        } else {
            self.doesNotBiometry = true;
            console.log('vacio');
        }
    });
    
    

    /**
     * Metodo para enviar a enrolamiento al usuario, este metodo se llama si el usuario ingresado no existe en la app
     * @method enrollProcess
     * @param {String} [msg] mensaje que se muestra en el pop-Up para invitar al usuario a enrolarce.
     * @private
    */
    function enrollProcess(msg) {
        $ionicPopup.confirm({
            title: messagesProvider.login.enrollDialogTitle,
            template: msg,
            okText: '<b>'+ messagesProvider.login.enrollDialogAcept +'</b>',
            cancelText: messagesProvider.generalActions.cancel
        }).then(function (response) {
            if (response) {
                $state.go('enroll');
            }
        });
    }

    /**
     * CallBack exitoso del metodo ´sendLogin´, se valida el estado del usuario y se redirecciona a la
     * pantalla requerida por el estado y el aprovisionamiento
     * @method validateLoginSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.data] objeto con el número de teléfono, email y el estado del usuario.
     * @param {String} [response.data.state] string con el estado del usuario en la app.
     * @param {String} [response.data.phoneNumber] string con el número de teléfono del usuario.
     * @param {String} [response.data.email] string con el número de teléfono del usuario.
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @private
     * @async
     * @return Object Json con el resultado de la validación
    */
    function validateLoginSuccess(response) {
        var provisioned = false;
        busyIndicator.hide();
        if (response.responseJSON.success) {

            $scope.userApp.state = response.responseJSON.data.state;

            if (response.responseJSON.data.phoneNumber!==null) {
                $scope.userApp.phoneNumber = response.responseJSON.data.phoneNumber;
            }

            jsonStore.find(configProvider.jsonStore.key).then(function(responseJSON) {

                if (responseJSON.length > 0) {
                    provisioned = responseJSON[0].json.data.phoneNumber === $scope.userApp.phoneNumber;
                }

                /*TODO: Implementar switch para validar el estado preEnrolado.*/
                if ($scope.userApp.state === configProvider.userStates.enroll){
                    if (provisioned) {
                        responseJSON[0].json.data.session = true;
                        responseJSON[0].json.data.auth.state = response.responseJSON.data.state;
                        responseJSON[0].json.data.auth.user = response.responseJSON.data.phoneNumber;

                        jsonStore.replace(responseJSON).then(function() {
                             $state.go('dashboard');
                        });
                    } else {
                        $state.go('token');
                    }
                } else if ($scope.userApp.state === configProvider.userStates.liteRegistry) {
                    $state.go('password');
                } else {
                    $state.go('home');
                }
            });
            self.sherpaUserName = null;

        } else {
            if (response.responseJSON.error.errorId === configProvider.errorMiddleware.validateLoginNull) {
                enrollProcess(response.responseJSON.error.errorMessage);
            } else {
                errorManager.showAsyncMessage(response.responseJSON.error);
            }
        }
    }

    /**
     * CallBack error del metodo ´sendLogin´
     * @method validateLoginFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `false`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     * @async
     * @return Object Json con datos del error
    */
    function validateLoginFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo publico que analiza el sherpaUserName ingresado por el usuario y pasa a la pantalla de password.
     * @method sendLogin
     * @public
    */
    self.sendLogin = function() {
        var invocationData, params, provisioned;
        validatePhone();
        validateEmail();
        toast.hideMessage();

        if (self.validPhoneNumber===0) {
            $scope.userApp.phoneNumber = self.sherpaUserName;
            $scope.userApp.email = '';
        }
        if (self.validEmail===0) {
            $scope.userApp.email = self.sherpaUserName;
            $scope.userApp.phoneNumber = '';
        }
        if (self.validPhoneNumber===0 || self.validEmail===0) {

            params = [
                $scope.userApp.phoneNumber,
                $scope.userApp.email
            ];

            busyIndicator.show();

            jsonStore.find(configProvider.jsonStore.key).then(function(response) {
                provisioned = response[0].json.data.phoneNumber === $scope.userApp.phoneNumber;
                params.push(provisioned);

                invocationData = invocationManager.getInvocationData(
                    messagesProvider.middlewareAdapter,
                    messagesProvider.userLoginValidationProcedure,
                    params
                );
                invocationManager.invokeAdaptherMethod(
                    invocationData,
                    validateLoginSuccess,
                    validateLoginFail
                );
            });


        }else{
            errorManager.showMessage(messagesProvider.login.user.errorLogin);

        }
    };

    /**
     * Metodo publico que analiza el sherpaUserName ingresado por el usuario.
     * @method validateLogin
     * @public
    */
    self.validateLogin = function() {
        validatePhone();
        validateEmail();
        toast.hideMessage();

        if (self.validPhoneNumber===0) {
            $scope.userApp.phoneNumber = self.sherpaUserName;
            $scope.userApp.email = '';
        }
        if (self.validEmail===0) {
            $scope.userApp.email = self.sherpaUserName;
            $scope.userApp.phoneNumber = '';
        }
        if (self.validPhoneNumber!==0 && self.validEmail!==0) {
            self.validForm = false;
            errorManager.showMessage(messagesProvider.login.user.errorLogin);
        }else{
            self.validForm = true;
            toast.hideMessage();
        }
    };

    /**
     * Metodo para validar el campo de teléfono
     * @method validatePhone
     * @private
     */
    function validatePhone() {
        if (typeof self.sherpaUserName !== 'undefined' && self.sherpaUserName!==null) {
            self.validPhoneNumber = self.sherpaUserName.search(/^.[0-9]{9}$/);
        } else {
            self.validPhoneNumber = -1;
        }
    }

    /**
     * Metodo para validar el campo de email
     * @method validateEmail
     * @private
    */
    function validateEmail() {
        if (typeof self.sherpaUserName !== 'undefined' && self.sherpaUserName!==null) {
            self.validEmail = self.sherpaUserName.search(/^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/);
        } else {
            self.validEmail = -1;
        }
    }

    $scope.$on('$ionicView.beforeEnter', function(){
        self.sherpaUserName = null;
    });

    /**
     * Metodo pare redireccionar al home
     * @method goHome
     * @public
    */

    self.goHome = function (){
        $state.go('home');
    };
    
    
    self.goRegister = function () {
        $state.go('registry.nickname');
    };
    
    /**
     * 
     * @returns {undefined}
     */
    self.takePhoto = function(){
        Camera.getPicture().then(function(imageURI) {
            var alertPopup = $ionicPopup.alert({
                title: messagesProvider.biometry.facial.successLogin.title,
                template: messagesProvider.biometry.facial.successLogin.description
            });
            alertPopup.then(function (res) {
                $state.go("dashboard");
            });                          

        }, function(err) {
            console.err(err);
        }, {
            cameraDirection: 1,
            quality: 75,
            targetWidth: 60,
            targetHeight: 60,
            saveToPhotoAlbum: false
        });
    };
    
    self.takeVoice = function () {
        $state.go('voice-login');
    };

}]);
