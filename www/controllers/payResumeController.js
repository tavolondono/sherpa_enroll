/**
* Controlador para la pantalla de resumen de pago.
* @class payResumeController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('payResumeController',
    ['hardwareBackButtonManager', '$scope', 'invocationManager', 'busyIndicator', 
        '$state', 'configProvider', 'errorManager', '$stateParams', '$document', 
        'keySecurityProvider', 'detectIdProvider', 'messagesProvider', '$ionicModal', 
        'jsonStore', '$timeout', 'logManager', 'getBalanceProvider', 
        'transactionManager',  '$ionicPopup',
    function (hardwareBackButtonManager, $scope, invocationManager, busyIndicator, 
    $state, configProvider, errorManager, $stateParams, $document, keySecurity, 
    detectIdProvider, messagesProvider, $ionicModal, jsonStore, $timeout, 
    logManager, getBalanceProvider, transactionManager, $ionicPopup) {

    var self = this;

    /**
    * Propiedad para inyectar una clase bastante al bar-footer
    * @property classBar
    * @type boolean
    */
    self.classBar = false;

    /* Se inyecta la clase para normalizar los estilos de la vista */
    $document.ready(function(){
        self.classBar = true;
    });

    /**
    * Propiedad donde se almacena el saldo actual del usuario
    * @property balance
    * @type Double
    */
    self.balance = null;

    /**
    * Propiedad donde se almacena el saldo libre sin contar bolsillos ni guardadito
    * @property balanceFree
    * @type Double
    */
    self.balanceFree = null;

     /**
    * Propiedad donde se almacena el saldo disponible para gastar por el usuario
    * @property spendBoundary
    * @type Double
    */
    self.spendBoundary = null;

    /**
     * Propiedad donde se almacena si se actualiza el saldo
     * @property refreshBalance
     * @type Boolean
     */
    self.refreshBalance = false;

    /**
     * Propiedad para almacenar la referencia de la vista a la que debe volver
     * la vista actual.
     * @property referentGoBack
     * @type {String}
     */
    self.referentGoBack = null;

    /**
     * Propiedad para almacenar el nombre del punto donde se hara el pago
     * @property pointName
     * @type {String}
     */
    self.pointName = null;

    /**
     * Propiedad para almacenar la cantidad a pagar
     * @property mountToPay
     * @type {String}
     */
    self.mountToPay = null;

    /**
     * Propiedad para almacenar el codigo que trae el QR para el pago.
     * @property code
     * @type {String}
     */
    self.code = null;

    /**
     * Propiedad para almacenar la fecha de pago.
     * @property paymentDate
     * @type {String}
     */
    self.paymentDate = null;

     /**
     * Propiedad para almacenar la referencia del pago.
     * @property reference
     * @type {String}
     */
    self.reference = null;

    /**
     * Propiedad para almacenar el texto del error en el modal.
     * @property errorMessageModal
     * @type {String}
     */
    self.errorMessageModal = null;

    /**
     * Propiedad que activa o no el boton de pago.
     * @property buttonAvailable
     * @type {Boolean}
     */
    self.buttonAvailable = false;

    /**
     * Propiedad para determinar si el usuario es enrolado o vinculado.
     * @property isUserEnroll
     * @type {Boolean}
     */
    self.isUserEnroll = true;

    /**
     * Propiedad para almacenar el origen de la transferencia.
     * @property transferOrigin
     * @type {String}
     */
    self.transferOrigin = null;

    /**
     * Propiedad para almacenar si el pago proviene de un bolsillo
     * @property pockets
     * @type {Array}
     */
    self.pockets = [];

    /**
     * Propiedad para setear todos los parametros de la transferencia
     * @property paramsTransfer
     * @type {Array}
     **/
    self.paramsTransfer = {};

    /**
     * Propiedad para almacenar los datos que se presentaran en el modal de dinero insuficiente.
     * @property insufficientMoney
     * @type {Object}
     **/
    $scope.insufficientMoneyData = {};

    /* Modal cuando el origen del dinero no alcanza para cumplir el pago o transferencia */
    $ionicModal.fromTemplateUrl('views/modal-insufficient-money.html', {
        id: 'insufficientMoney',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.insufficientMoney = modal;
    });

    /**
     * Se declara el modal para pago exitoso.
     */
     $ionicModal.fromTemplateUrl('views/modal-success-pay.html', {
         id: 'successPay',
         scope: $scope,
         animation: 'fade-in-scale'
     }).then(function(modal) {
           $scope.successPay = modal;
     });

     /**
      * Se declara el modal para pago exitoso.
      */
      $ionicModal.fromTemplateUrl('views/modal-voucher.html', {
          id: 'voucher',
          scope: $scope,
          animation: 'fade-in-scale'
      }).then(function(modal) {
            $scope.voucher = modal;
      });

    /**
    * Se declara el modal saldo insuficiente.
    */
    $ionicModal.fromTemplateUrl('views/modal-insufficient-balance.html', {
        id: 'insufficientBalance',
        scope: $scope,
        animation: 'fade-in-scale'
        }).then(function(modal) {
            $scope.insufficientBalance = modal;
    });

    /**
    * Modal para mostrar que hubo un error en la consulta del QR.
    */
    $ionicModal.fromTemplateUrl('views/pay-resume-modal-error.html', {
        id: 'payResumeError',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.payResumeError = modal;
    });

    /**
     * CallBack exitoso del metodo getBalance
     * @method balanceSuccess
     * @param {Object} [response] objeto con los valores del saldo del usuario.
     * @private
     */
    function balanceSuccess(response) {
        busyIndicator.hide();
        $timeout(function() {
           self.spendBoundary = response.spendBoundary;
           self.balance = response.balance;
        }, 0);
    }

    /**
     * CallBack error del metodo getBalance
     * @method balanceFail
     * @param {Object} [error] objeto con la estructura de la respuesta de error.
     * @param {String} [error.errorId] id del error.
     * @param {String} [error.errorMessage] descripción del error.
     * @private
     */
    function balanceFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error);
    }

    /**
     * Método para solicitar el saldo del usuario.
     * @method getBalance
     * @public
     */
    self.getBalance = function() {
        
        getBalanceProvider.balance().then(function(balance){
            balanceSuccess(balance);
            $scope.$broadcast('scroll.refreshComplete');
        }, function(error){
            balanceFail(error);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    /**
     * Metodo para verificar a que pantalla debe llevar el boton GoBack
     * @method goBack
     * @async
    **/
    self.goBack = function (){
        clearView();
        $state.go('dashboard');
    };

    /**
     * Metodo para limpiar los campos de la vista.
     * @method clearView
     * @private
     */
    function clearView() {
        self.pointName = null;
        self.mountToPay = null;
        self.paymentDate = null;
        self.reference = null;
    }

    /**
     * Callback de consulta de resumen de pago fallida
     * @method getPayResumeFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `false`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     * @return Object Json con datos del error
    **/
    function getPayResumeFail(error) {
        busyIndicator.hide();
        self.errorMessageModal = error.responseJSON.error.errorMessage;
        $scope.payResumeError.show();
    }

    /**
     * Callback de consulta de resumen de pago fallida
     * @method getPayResumeSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @private
     * @return Object Json con el resultado de la validación
    **/
    function getPayResumeSuccess() {
        busyIndicator.hide();

        var response = {
              'status':'12',
              'phoneNumber':'3122658978',
              'date': '2015-05-12',
              'name': 'el rancherito',
               'trnId': '4654s',
               'value': '7500'
        };
        self.mountToPay = response.value;
        self.pointName = response.name;
        self.paymentDate = response.date;
        self.reference = response.trnId;
    }

    /**
     * Callback de consulta de resumen de pago exitoso para ver el voucher
     * @method getPayVoucherSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @private
     * @return Object Json con el resultado de la validación
    **/
    function getPayVoucherSuccess(response) {
        var error;
        busyIndicator.hide();
        if (response.responseJSON.success) {
            /*Validar el estado del pago.*/
            switch(response.responseJSON.data.status) {
                case configProvider.paymentsStatus.pay:

                    $scope.$apply(function() {
                        self.reference = response.responseJSON.data.trnId;
                        self.mountToPay = response.responseJSON.data.value;
                        self.pointName = response.responseJSON.data.name;
                        self.paymentDate = response.responseJSON.data.date;
                    });

                    break;
                case configProvider.paymentsStatus.pending:
                    /* Mostrar mensaje de error cuando el pago esta pendiente */
                    error = errorManager.createErrorInstance(configProvider.errors.payments.statusPending);
                    errorManager.showAsyncMessage(error.responseJSON.error);
                    clearView();
                    break;
                case configProvider.paymentsStatus.cancel:
                    /* Mostrar mensaje de error cuando el pago esta cancelado */
                    error = errorManager.createErrorInstance(configProvider.errors.payments.statusCancel);
                    errorManager.showAsyncMessage(error.responseJSON.error);
                    clearView();
                    break;
                default:
                    /* Mostrar mensaje de error generico */
                    error = errorManager.createErrorInstance();
                    errorManager.showAsyncMessage(error.responseJSON.error);
                    clearView();
            }
        } else {
            self.errorMessageModal = response.responseJSON.error.errorMessage;
            $scope.payResumeError.show();
        }
    }

    /**
     * Metodo para consultar los datos del pago.
     * @method getPayResume
     * @params typeResumValue Propiedad para desiganar el tipo de vista a mostrar (resume - voucher).
     * @async
    **/
    self.getPayResume = function(typeResumValue) {
        var params = [],
        invocationData,
        successResume;

        if (typeResumValue === configProvider.paymentsSummaryType.resumen) {
            successResume = getPayResumeSuccess;
        } else {
            successResume = getPayVoucherSuccess;
        }

        
        getPayResumeSuccess();
       
    };

    /**
     * Metodo para cerrar el modal de error de consulta de codigo de pago.
     * @method closeErrorModal
     * @public
    **/
    self.closeErrorModal = function(){
        $scope.payResumeError.hide();
        $state.go('dashboard');
    };

    /**
     * Metodo para cerrar los modales de pagos,
     * los que redireccionan a transferencias regargan el saldo.
     * @method closeModal
     * @public
     */
    self.closeModal = function(modal){
        $scope[modal].hide();
        switch(modal){
            case 'successPay':
            case 'voucher':
                $state.go('dashboard', {
                    refreshBalance: true
                });
                break;
            default:
        }
    };

    /**
     * CallBack exitoso del metodo setPay
     * @method setPaySuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @private
     * @return Object Json con el resultado de la validación
    */
    function setPaySuccess(response) {
        busyIndicator.hide();
        $scope.insufficientMoney.hide();
        $scope.successPay.show();
    }

    /**
     * CallBack error del metodo setPay
     * @method setPayFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @private
     * @return Object Json con datos del error
    */
    function setPayFail(error) {
        busyIndicator.hide();
        $scope.insufficientMoney.hide();

        if (transactionManager.shouldCleanTransactionID(error)) {
            /*Se limpia el transactionID cuando no son errores de
            * conexión o transacción en proceso */
            transactionManager.cleanTransactionForOperation(transactionManager.operationTypes.paymentRegistered);
            transactionManager.cleanTransactionForOperation(transactionManager.operationTypes.paymentEnrolled);

            $state.go('operationResult',{
                type: 'error',
                value: 'pay'
            });
        } else {
            errorManager.showAsyncMessage(error.responseJSON.error);
        }
    }

    /**
     * Metodo para completar el pago desde el disponible.
     * @method completeTransfer
     * @public
    **/
    $scope.completeTransfer = function() {
        
        $scope.insufficientMoney.show();
        liteRegistryPay(self.paramsTransfer.params, self.paramsTransfer.procedure, self.paramsTransfer.operationType);
    };

    /**
     * Metodo para volver al origen del dinero de la transacción.
     * @method goToPockets
     * @public
    **/
    $scope.goToPockets = function() {
        var dataTransfer = {
            typeTransfer : configProvider.typeTransfer.pay
        };

        $state.go('originMoney', dataTransfer);
        $scope.insufficientMoney.hide();
    };


    /**
     * Metodo privado para proceder con el pago para un vinculado
     * @method liteRegistryPay
     * @param {Object} params Objeto con la información del pago.
     * @param {String} procedure Procedimiento al que se llamará para el pago.
     * @async
    **/
    function liteRegistryPay(params, procedure, operationType) {
        var invocationData = {};

        transactionManager.getTransactionIDForOperation(operationType).then(
            function(transactionID) {
                detectIdProvider.getSoftToken().then(function (softToken){

                    params.push(softToken);

                    invocationData = invocationManager.getTransactionInvocationData(
                        configProvider.middlewareAdapter,
                        procedure,
                        params,
                        transactionID
                    );

                    invocationManager.invokeAdaptherMethod(
                        invocationData,
                        setPaySuccess,
                        setPayFail
                    );
                }, function(){
                    /*TODO: Flujo Wilson */
                });
        }, function(error){
            busyIndicator.hide();
            errorManager.showAsyncMessage(error.responseJSON.error);
        });

    }


    /**
     * Metodo privado para configurar el pago a realizar. Enrolado/Vinculado.
     * @method setPay
     * @async
    **/
    function setPay() {
        
        setPaySuccess();
        
    }

    /**
     * CallBack de la validación de la contraseña, este metodo
     * es llamado desde el provider `keySecuriryProvider`
     * @method keySecurityValidation
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true` o `false`
     * @param {Object} [response.error] objeto con la descripción y el id del error
     * @public
     * @return Object Json con el resultado de la validación
     * @async
    */
    self.keySecurityValidation = function(response){
        if (response.responseJSON.success) {
            setPay();
            keySecurity.reset();
        }else{
            busyIndicator.hide();
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    };

    /**
    * Metodo en el cual se envia la petición de validación de la
    * clave de transacción del usuario, el callBack de la respuesta
    * del provider de validación de la clave es `keySecurityValidation`.
    * @method sendPay
    * @async
    **/
    self.sendPay = function(){
        setPay();    
    };

    /**
    * Metodo para redireccionar al usuario
    * @method redirect
    * @param {String} url Donde se va a redireccionar al usuario
    * @param {String} modal Nombre del modal invocado
    **/
    self.redirect = function(url, modal){
        if(modal === 'insufficient'){
            $scope.insufficientBalance.hide();
        }else{
            $scope.voucher.hide();
        }
        $state.go(url);
    };

    /**
   * Metodo para manejar las validaciones de saldos
   * @method balanceValidate
   * @private
   * @return boolean
   **/
   function balanceValidate(){
       var valid = false,
           valuePockets = 0;

        /* Validamos si el usuario es vinculado o enrolado */
        if(!self.isUserEnroll) {
            
            /* Sumamos el valor de los bolsillos que se usaran para pagar */
            self.pockets.forEach(function(pocket) {
                    valuePockets += pocket.value;
            });

            if(parseInt(self.balanceFree) + parseInt(valuePockets) >= self.mountToPay) {
                valid = true;
            }

        } else {
            if(parseInt(self.spendBoundary) >= self.mountToPay) {
                valid = true;
            }
        }
        return valid;
    }

    /**
    * Metodo consultar el comprobante
    * @method getVoucher
    * @public
    **/
    self.getVoucher = function(){
        $scope.successPay.hide();
        $scope.voucher.show();
        self.getPayResume(configProvider.paymentsSummaryType.voucher);
    };

    /**
     * Función que analiza el estado del usuario.
     * @method setStateUser
     * @private
     */
    function setStateUser() {
        jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
            if (resp) {
                self.isUserEnroll = resp[0].json.data.auth.state === configProvider.userStates.enroll;
            }
        });
    }

    /**
     * Metodo para validar si es la primera vez que ha pagado un enrolado.
     * @method validateFirstEnrollmentPayment
     * @private
     */
    function validateFirstEnrollmentPayment() {
        jsonStore.find(configProvider.jsonStore.key).then(function(response) {
            if(typeof response[0].json.data.firstPay !== 'undefined' && response[0].json.data.firstPay === null){
                response[0].json.data.firstPay = true;
                jsonStore.replace(response).then(function(){});
            }
        }, function(error){
            logManager.log('Error first enrollment pay: ' + error);
        });
    }

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de saldo del usuario antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function(){

        self.spendBoundary = 100000;
        
        self.balance = 250000;

        hardwareBackButtonManager.enable(self.goBack);

        self.transferOrigin = $stateParams.transferOrigin;
        self.pockets = $stateParams.pockets;
        self.balanceFree = $scope.userApp.balanceFree;

        clearView();

        if($stateParams.code !== null && typeof($stateParams.code) !== 'undefined') {
            self.code = $stateParams.code;
            self.getPayResume(configProvider.paymentsSummaryType.resumen);
            setStateUser();
        }
    });
}]);
