/**
* Descripción controlador para manejar la vista password.
* @class passwordDataController
* @constructor
* @module sherpa
* @author [hildebrando.rios]
*/
angular.module('App')
    .controller('passwordDataController',
    ['messagesProvider', 'configProvider', 'configStyles',  '$scope', '$filter', 
        'invocationManager', 'busyIndicator', 'jsonStore', 'logManager', 
        'errorManager', '$timeout', 'utilsProvider', '$state', '$rootScope', 'userManager',
    function (messagesProvider, configProvider, configStyles, $scope, $filter, 
    invocationManager, busyIndicator, jsonStore, logManager, errorManager, 
    $timeout, utilsProvider, $state, $rootScope, userManager) {

    var self = this;

    self.password = {
        verify: false,
        total: null
    };

    self.styles = {
        passwordSpan:'passwordOne'
    };

    self.activationCode = '';

    /**
     * Método para cambiar la informacion en la pantalla
     * @method viewChange
     * @param {String} [pwsSpan] clase que se aplica para los puntos en la pantalla de verificacion
     * @param {String} [bgClass] clase que se aplica para un estilo aplicable en toda la pantalla
     * @param {Boolean} [verify] true o false para definir que pantalla mostrar
     * @public
     */
    self.viewChange = function(pwsSpan, bgClass, verify) {

        $timeout(function(){
            self.password.total = null;
        }, 100);

        if(pwsSpan === configProvider.password.one) {
            messagesProvider.liteRegistry.password.explanetionText = messagesProvider.generalActions.tempExplanetionText;
            messagesProvider.generalActions.tempExplanetionText = '';
            messagesProvider.liteRegistry.password.defaultPassword = messagesProvider.generalActions.createPassword;
        } else if(pwsSpan === configProvider.password.two) {

            messagesProvider.generalActions.tempExplanetionText = messagesProvider.liteRegistry.password.explanetionText;
            messagesProvider.liteRegistry.password.explanetionText = '';
            messagesProvider.liteRegistry.password.defaultPassword = messagesProvider.generalActions.validatePassword;
        }

        configStyles.backgroundColor.nameClass = bgClass;
        self.styles.passwordSpan = pwsSpan;

        self.password.verify = verify;
    };

    /**
     * Callback para cuando la respuesta de la promesa fue exitosa
     * @method createSessionSuccess
     * @param response {Object}
     * @private
     */
    function createSessionSuccess(response) {
        busyIndicator.hide();
        if (typeof response.responseJSON !== 'undefined' && response.responseJSON.isSuccessful) {

            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                responseJsonStore[0].json.data.session = true;
                responseJsonStore[0].json.data.auth.state = $scope.userApp.state;
                jsonStore.replace(responseJsonStore).then(function() {
                     $scope.registryController.goToNextPage();
                });
            });

        } else {
            /*Fallo de creación de sesión, se redirecciona al usuario a iniciar sessión
            y se presenta toast informativo informando que ya se encuentra registrado.*/
            logManager.error(response);
            logout();
        }
    }

    /**
     * Callback para cuando la respuesta de la promesa fue fallida
     * @method createSessionFail
     * @param response {Object}
     * @private
     */
    function createSessionFail(error) {
        /*Fallo de creación de sesión, se redirecciona al usuario a iniciar sessión
        y se presenta toast informativo informando que ya se encuentra registrado.*/
        busyIndicator.hide();
        logManager.error(error);
        logout();
    }

    /**
     * Metodo para crear session despues de vincularse.
     * @method createSession
     * @param {String} phoneNumberValue
     * @param {String} passwordValue
     * @private
     */
    function createSession(phoneNumberValue, passwordValue) {
        var phoneNumber = phoneNumberValue,
            password = passwordValue,
            deviceInfo = '',
            options = '',
            param = [];

        
        options = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.userAuthenticationProcedure,
            param
        );

        //userState.login(options).then(createSessionSuccess, createSessionFail);
    }

    /**
     * CallBack exitoso del llamado a activateDevice.
     * @method deviceActivationSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable true
     * @param {Object} [response.error] objeto con la descripción y el id del error.
     * @private
     */
    function deviceActivationSuccess(response) {
        if (response.responseJSON.success) {
            /*Llamar servicio session*/
            createSession($scope.userApp.phoneNumber, self.password.pwsTwo);
        } else {
            /* Proceso de aprovisionamiento error, se debe cerrar session y
            redireccionar al usuario al proceso de login y mostrarle el mensaje. */
            busyIndicator.hide();
            logManager.error(response.responseJSON.error);
            logout();
        }
    }

    /**
     * CallBack error del llamado a activateDevice.
     * @method deviceActivationFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable false
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     */
    function deviceActivationFail (error){
        /* Proceso de aprovisionamiento error, se debe cerrar session y
        redireccionar al usuario al proceso de login y mostrarle el mensaje. */
        busyIndicator.hide();
        logManager.error(error);
        logout();
    }

    /**
     * CallBack exitoso del metodo dataSend.
     * @method dataSendSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable true
     * @param {Object} [response.data] objeto con el estado del usuario.
     * @param {String} [response.data.state] string con el estado del usuario en la app.
     * @param {String} [response.data.message] string con una descripción del estado del usuario.
     * @param {Object} [response.error] objeto con la descripción y el id del error.
     * @private
     */
    function dataSendSuccess(response) {
        if (response.responseJSON.success) {
            /* Se asigna el phone Number y el state al userApp para mostrar
             * los datos en la pantalla de dashboard
             */
            $scope.userApp.phoneNumber = $scope.registryController.registryModel.phoneNumber;
            $scope.userApp.state = response.responseJSON.data.state;


            /* Se aprovisiona el dispositivo con el código
            generado desde el integrador en Easy Solutions */
            if (typeof response.responseJSON.data!== 'undefined' &&
                typeof response.responseJSON.data.softToken !== 'undefined') {
                self.activationCode = response.responseJSON.data.softToken;
                provisioning();
            }

        } else {
            busyIndicator.hide();
            self.viewChange(configProvider.password.one, configProvider.password.create, false);
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
     * Metodo para enviar el aprovicionamiento del dispositivo.
     * @method provisioning
     * @private
     */
    function provisioning(){
        var params = [],
        invocationData;
       
    }

    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    function logout() {
      //TODO logout  
    }

    /**
     * Metodo para cerrar el proceso de registro,
     * el usuario ya se encuentra registrado pero ocurrio un error al momento
     * de aprovisionar, activar el dispositivo aprovisionado o inicio de sesion.
     * @return {[type]} [description]
     */
    function closeRegistry() {
        var error;
        $state.go('userLogin');
        error = errorManager.createErrorInstance(
            configProvider.errors.provisioning.deviceRegistrationErrorInRegistry
        );
        errorManager.showAsyncMessage(
            error.responseJSON.error,
            configProvider.toastTypeMessage.information
        );
    }

    /**
     * CallBack error del metodo dataSend
     * @method dataSendFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable false
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     */
    function dataSendFail(error) {
        busyIndicator.hide();
        self.viewChange(configProvider.password.one, configProvider.password.create, false);
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo publico en el cual se procede con el resgistro liviano
     * @method dataSend
     * @public
     * @async
     */
    self.dataSend = function() {
//        busyIndicator.show();
        var password = $scope.registryController.registryModel.password;
        var invocationData,
        params,
        formatDateValidation = messagesProvider.liteRegistry.id.formatDateValidation,
        expeditionDate = $filter('date')($scope.registryController.registryModel.expeditionDate, formatDateValidation),
        birthDate = $filter('date')($scope.registryController.registryModel.birthDate, formatDateValidation) || '';

//        params = [
//            $scope.userApp.phoneNumber,
//            $scope.registryController.registryModel.nickname,
//            $scope.registryController.registryModel.documentType.code,
//            $scope.registryController.registryModel.documentNumber,
//            expeditionDate,
//            birthDate,
//            $scope.registryController.registryModel.email,
//            $scope.registryController.registryModel.password,
////            $scope.registryController.registryModel.contract.id,
////            $scope.registryController.registryModel.isSendContract,
////            $scope.registryController.registryModel.firstName,
////            $scope.registryController.registryModel.firstName2,
////            $scope.registryController.registryModel.lastName,
////            $scope.registryController.registryModel.lastName2,
//            $scope.registryController.registryModel.acceptContract
//        ];

        
        $rootScope.actualUser.hasPassword = true;
        $rootScope.actualUser.password = password;
        userManager.saveUser($rootScope.actualUser);
//        busyIndicator.hide();
        $state.go("registry.biometryConfigAccount");
        /*TODO: guardar datos en el local storage */
/*        invocationData = invocationManager.getInvocationData(messagesProvider.middlewareAdapter,
            messagesProvider.acceptContractProcedure, params);
        invocationManager.invokeAdaptherMethod(invocationData, dataSendSuccess, dataSendFail);
        */
    };

    /*
     * Funcion Para enviar el PIN, en la cual verifica y encripta la contraseña
     * procediendo a ejecutar el registro liviano.
     */
    $scope.$watch(function(scope) {
        return scope.passwordDataControl.password.total;
    }, function(newValue, oldValue) {
        var pass;
        $scope.passwordDataControl.password.total = $filter('trimTex')(newValue);
        $scope.passwordDataControl.password.total = $filter('trimNumericKey')(newValue);
        if ( (utilsProvider.validateNull(oldValue) && oldValue.length > 1) && (newValue==='' || newValue===undefined) ) {
            $scope.passwordDataControl.password.total = oldValue;
        }

        pass = $scope.passwordDataControl.password.total;

        if(pass.length === 4 && self.password.verify === false){
            self.password.pwsOne = pass;
            self.viewChange(configProvider.password.two, configProvider.password.validate, true);
        } else if(pass.length === 4 && self.password.verify === true) {
            self.password.pwsTwo = pass;
            if(self.password.pwsOne === self.password.pwsTwo){
                $scope.registryController.registryModel.password = self.password.pwsOne;
                    self.password.total = null;
                    self.dataSend();

               
            }else if(pass.length === 4) {
                self.viewChange(configProvider.password.one, configProvider.password.create, false);
                errorManager.showAsyncMessage(messagesProvider.liteRegistry.password.errorPIN);
            }
        }
    });

}]);