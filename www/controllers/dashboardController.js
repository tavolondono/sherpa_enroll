/**
* Controlador para el dashboard de la app.
* @class dashboardController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('dashboardController',
    ['$ionicModal', '$scope', '$state', 'hardwareBackButtonManager', 'messagesProvider', 
        'configProvider', 'invocationManager', 'logManager', 'busyIndicator',
        '$timeout', '$ionicHistory', '$ionicScrollDelegate', 'jsonStore', 
        'errorManager', '$q', 'userState', 'toastProvider', 'getBalanceProvider',
    function ($ionicModal, $scope, $state, hardwareBackButtonManager, 
    messagesProvider, configProvider, invocationManager, logManager, busyIndicator, 
    $timeout, $ionicHistory, $ionicScrollDelegate, jsonStore, 
    errorManager, $q, userState, toast, getBalanceProvider) {

    /**
    * Deshabilitar el botón goBack nativo
    **/
    hardwareBackButtonManager.disable();

    var self = this;

    /**
    * Se declaran los distintos modales que actuan en el dashboard.
    * coachmarks Modal
    */
    $ionicModal.fromTemplateUrl('views/coachmarks.html', {
        id: 'coachmarks',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.coachmarks = modal;
    });

    /**
    * welcomeSherpa Modal
    */
    $ionicModal.fromTemplateUrl('views/tool-welcome-sherpa.html' , {
        id: 'welcomeSherpa',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.welcomeSherpa = modal;
    });

    /**
    * keepStash Modal
    */
    $ionicModal.fromTemplateUrl('views/tool-keep-stash.html' , {
        id: 'keepStash',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.keepStash = modal;
    });

    /**
    * recharge Modal
    */
    $ionicModal.fromTemplateUrl('views/tool-recharge.html' , {
        id: 'recharge',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.recharge = modal;
    });

    /**
    * safeGoals Modal
    */
    $ionicModal.fromTemplateUrl('views/tool-safe-goals.html' , {
        id: 'safeGoals',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.safeGoals = modal;
    });

    /**
    * pockets Modal
    */
    $ionicModal.fromTemplateUrl('views/tool-pockets.html' , {
        id: 'pockets',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.pockets = modal;
    });

    /**
     * Modal para mostrar mensaje de primera compra para los enrolados.
    */
    $ionicModal.fromTemplateUrl('views/payments-enroll-first-pay.html', {
        id: 'firstEnrollmentPay',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.firstEnrollmentPay = modal;
    });

    /**
     * Modal para mostrar el uso de la plata.
    */
    $ionicModal.fromTemplateUrl('views/dashboard-modal-use-money.html', {
        id: 'modalUseMoney',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalUseMoney = modal;
    });

    /**
     * Modal para mostrar distribución de la plata
    */
    $ionicModal.fromTemplateUrl('views/money-partition.html', {
        id: 'moneyPartition',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        self.moneyPartition = modal;
    });

    /**
    * Propiedad verificamos si es la primera vez que carga la mochila
    * @property firstLoadDashboard
    * @type Boolean
    */
    self.firstLoadDashboard = false;

    /**
    * Propiedad verificamos para mostrar el gif de 0 a 10000
    * @property mountLoandGif
    * @type Boolean
    */
    self.mountLoandGif = false;

    /**
    * Propiedad donde se almacena el saldo actual del usuario
    * @property balance
    * @type Double
    */
    self.balance = null;

    /**
    * Propiedad donde se almacena el saldo disponible para el usuario.
    * @property balanceAvailable
    * @type Double
    */
    self.balanceAvailable = null;

    /**
    * Propiedad donde se almacena el numero de bolsillos.
    * @property numPockets
    * @type Double
    */
    self.numPockets = 0;

    /**
    * Propiedad para mostrar el botón de registro en el dashboard
    * @property showRegistry
    * @type Boolean
    */
    self.showRegistry = $scope.userApp.state === configProvider.userStates.enroll;

    /**
    * Propiedad para mostrar el botón de registro en el dashboard
    * @property showOptionRegister
    * @type Boolean
    */
    self.showOptionRegister = $scope.userApp.state === configProvider.userStates.liteRegistry;

    /**
     * Propiedad para determinar si el usuario es enrolado o vinculado.
     * @property isUserEnroll
     * @type {Boolean}
     */
    self.isUserEnroll = true;

    /**
    * Propiedad para almacenar el saldo disponible
    * @property balanceFree
    * @type Double
    */
    self.balanceFree = null;

    /**
    * Propiedad para almacenar el saldo de los bolsillos
    * @property pocketsValue
    * @type Double
    */
    self.pocketsValue = null;

    /**
    * Propiedad para almacenar el numero de bolsillos
    * @property pocketsSize
    * @type Integer
    */
    self.pocketsSize = null;

    /**
    * Propiedad para almacenar el saldo de las metas
    * @property goalsValue
    * @type Double
    */
    self.goalsValue = null;

    /**
    * Propiedad para almacenar el numero de metas
    * @property goalsSize
    * @type Integer
    */
    self.goalsSize = null;

    /**
    * Propiedad para almacenera el valor del guardadito
    * @property savedValue
    * @type Double
    */
    self.savedValue = null;


    /**
    * CallBack exitoso del metodo getBalance
    * @method dataValidationSuccess
    * @param {Object} [response] objeto con la estructura de la respuesta
    * @param {Boolean} [response.success] variable `true`
    * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
    * @private
    * @return Object Json con el resultado de la validación
    */
    function balanceSuccess(response) {
        busyIndicator.hide();
    }

    /**
    * CallBack error del metodo {{#crossLink "getBalance/balanceFail:method"}}{{/crossLink}}
    * @method dataValidationFail
    * @param {Object} [error] objeto con la estructura de la respuesta
    * @param {Boolean} [error.success] variable `false`
    * @param {Object} [error.error] objeto con la descripción y el id del error
    * @private
    * @return Object Json con datos del error
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
        busyIndicator.show();
       var balance = '';
        balanceSuccess(balance);
        $scope.$broadcast('scroll.refreshComplete');
       
    };

    /**
    * Este timeout verifica los 3 segundos despues de cargado el Dashboard
    * para enseñar el coachmark.
    */
    function loadBalance() {
        $ionicHistory.clearHistory();

        if(self.firstLoadDashboard && self.showRegistry) {
            $timeout(function() {
                self.openTour();
            }, 3000);
        } else {
            self.getBalance();
        }
    }

    /**
    * Método para abrir el tour desde un touch
    * @method openTourTouch
    * @public
    */
    self.openTourTouch = function() {
        if(self.firstLoadDashboard) {
            self.firstLoadDashboard = false;
            self.openTour();
        }
    };

    /**
    * Método para realizar ocultar o mostrar el gif de 0 a 10000.
    * @method setGifReloadMount
    * @param {Boolean} true o false
    * @public
    */
    self.setGifReloadMount = function(data) {
        self.mountLoandGif = data;
        if(data) {
            $timeout(function() {
                self.mountLoandGif = false;
            }, 3000);
        }
    };

    /**
    * Método para realizar el llamado observar el Tour.
    * @method openTour
    * @public
    */
    self.openTour = function() {
        if(self.showRegistry) {
            $scope.coachmarks.show();
        }
    };

    /**
    * Metodo para abrir cualquier modal del Tool
    * @method openToolModal
    * @public
    */
    $scope.openToolModal = function(toolModalValue) {
        if(!self.firstLoadDashboard) {
            toolModalValue.show();
        }
    };

    /**
    * Metodo para cerrar el modal de bienvenida
    * @method closeModalWelcome
    * @public
    */
    $scope.closeModalWelcome = function() {
        $scope.welcomeSherpa.hide();
        self.setGifReloadMount(true);
    };

    /**
    * Metodo para cerrar el modal de coachmarks
    * @method closeCoachMarksModal
    * @public
    */
    $scope.closeCoachMarksModal = function() {
        $scope.coachmarks.hide();
        self.getBalance();
    };

    /**
    * Metodo para cerrar cualquier modal del Tool
    * @method closeToolModal
    * @param {Object} toolModalValue el modal que se quiere cerrar.
    * @public
    */
    $scope.closeToolModal = function(toolModalValue) {
        toolModalValue.hide();
        $state.go('registry.nickname');
    };

    /**
    * Metodo para verificar si se puede ir a la pantalla de transferencias.
    * @method goToTransfers
    * @public
    */
    self.goToTransfers = function() {
        $scope.modalUseMoney.show();
    };

    /**
    * Metodo para cerrar el modal de use de la plata.
    * @method hideUseMoney
    * @public
    */
    self.hideUseMoney = function() {
        $scope.modalUseMoney.hide();
    };

    /**
    * Metodo para verificar si se puede ir a la pantalla de cashOut.
    * @method goToTransactionalId
    * @public
    */
    self.goToTransactionalId = function() {
        if(!self.isUserEnroll) {
            $state.go('transactionalid');
        } else {
            errorManager.showAsyncMessage(messagesProvider.dashboard.messageProfileEnroll);
        }
    };

    /**
    * Metodo para verificar si ingresa a listado de bolsillos
    * @method goToPockets
    * @public
    */
    self.goToPockets = function() {
        if(self.isUserEnroll) {
            $scope.pockets.show();
        } else {
            $state.go('pockets');
        }
    };

    /**
    * Metodo para verificar si ingresa a guardadito
    * @method goToSaved
    * @public
    */
    self.goToSaved = function() {
        if(self.isUserEnroll) {
            $scope.keepStash.show();
        } else {
            $state.go('saved');
        }
    };

    /**
    * Metodo para verificar se ingresa a recargas
    * @method goToCashIn
    * @public
    */
    self.goToCashIn = function() {
        if(self.isUserEnroll) {
            $scope.recharge.show();
        } else {
            $state.go('cashin');
        }
    };

    /**
    * Metodo para simular push
    * @method goToCashout
    * @public
    */
    self.goToCashout = function() {
        if(!self.isUserEnroll) {
            $state.go('cashout');
        } else {
            errorManager.showAsyncMessage(messagesProvider.dashboard.messageProfileEnroll);
        }
    };

    /**
     * Metodo para consultar si el usuario a visto el paseo.
     * @method getloadModal
     * @private
     */
    function getloadModal() {
        var responseGetLoadModal = $q.defer();
        jsonStore.find(configProvider.jsonStore.key).then(function(responseData) {
            if(responseData){
                responseGetLoadModal.resolve(responseData);
            }
        }, function(){
            responseGetLoadModal.reject({});
        });
        return responseGetLoadModal.promise;
    }

    /**
     * Metodo para acualizar en el jsonStore si se muestra el modal.
     * @method updateFirstLoadDashboard
     * @private
     */
    function updateFirstLoadDashboard(){
        getloadModal().then(function(response){
            /*Se valida la existencia del jsonStore*/
            if(response[0].json.data && typeof response[0].json.data.loadModal !== 'undefined'){

                /*Se valida si el paseo ya se ha visto*/
                if(response[0].json.data.loadModal === null && $scope.userApp.state === configProvider.userStates.enroll){
                    response[0].json.data.loadModal = false;
                    jsonStore.replace(response).then(function() {
                        loadBalance();
                    }, function() {
                        self.getBalance();
                        self.firstLoadDashboard = false;
                        errorManager.showAsyncMessage(messagesProvider.generalActions.errorOnFailure);
                    });
                } else {
                    self.getBalance();
                    self.firstLoadDashboard = false;
                    /*Llamar función para validar si es el primer pago del usuario enrolado*/
                    validateFirstEnrollmentPayment();
                }

            } else {
                self.getBalance();
                self.firstLoadDashboard = false;
                /*Llamar función para validar si es el primer pago del usuario enrolado*/
                validateFirstEnrollmentPayment();
            }
        }, function(){
            self.getBalance();
            self.firstLoadDashboard = false;
            /*Llamar función para validar si es el primer pago del usuario enrolado*/
            validateFirstEnrollmentPayment();
            errorManager.showAsyncMessage(messagesProvider.generalActions.errorOnFailure);
        });

    }

    /**
     * Metodo para validar si es la primera vez que ha pagado un enrolado,
     * se debe mostrar modal invitando a registro.
     * @method validateFirstEnrollmentPayment
     * @private
     */
    function validateFirstEnrollmentPayment() {
        jsonStore.find(configProvider.jsonStore.key).then(function(response) {
            if(typeof response[0].json.data.firstPay !== 'undefined' && response[0].json.data.firstPay === true && self.isUserEnroll ){
                /* Mostrar el modal de primer pago enrolado */
                $scope.firstEnrollmentPay.show();
                response[0].json.data.firstPay = false;
                jsonStore.replace(response).then(function(){});
            }
        }, function(error){
            logManager.log('Error first enrollment pay: ' + error);
        });
    }

    /**
     * Función que analiza el estado del usuario.
     * @method setStateUser
     * @private
     */
    function setStateUser() {
        self.isUserEnroll = true;
    }

    /**
     * Metodo para cerrar el modal de primer pago de un enrolado.
     * @method closeModalEnrroll
     * @public
     */
    self.closeModalEnrroll = function() {
        $scope.firstEnrollmentPay.hide();
    };

    /**
     * Metodo para cerrar el modal de primer pago de un enrolado.
     * @method closeModalEnrroll
     * @public
     */
    self.goRegistry = function() {
        $scope.firstEnrollmentPay.hide();
        $state.go('registry.nickname');
    };

    /**
     * Método para ir a una transferencia de envio o de petición de dinero.
     * @method goToTransferContact
     * @param {String} typeTransferValue Tipo de transferencia a realizar ´request´ o ´send´
     * @public
     */
    self.goToTransferContact = function(typeTransferValue) {
        var params = {},
        typeTransfer = typeTransferValue || configProvider.typeTransfer.send;
        if (!self.isUserEnroll) {
            params = {
                typeTransfer : typeTransfer
            };

            if(typeTransferValue === configProvider.typeTransfer.send) {
                $state.go('originMoney', params);
            } else {
                $state.go('transferContact', params);
            }
            self.hideUseMoney();
        }
    };

    /**
     * Metodo para ir a la vista de Pagos.
     * @method goPayments
     * @public
     */
     self.goPayments = function() {
        var dataTransfer = {
            typeTransfer: configProvider.typeTransfer.pay
        };
        
            $state.go('originMoney', dataTransfer);
        
        self.hideUseMoney();
    };

    /**
     * Metodo para ir a la vista de cashOut
     * @method goCashOut
     * @public
     */
    self.goCashOut = function() {
        if (!self.isUserEnroll) {
            $state.go('cashout', {'referentGoBack': 'dashboard'});
            self.hideUseMoney();
        }
    };

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function(){
        $ionicScrollDelegate.scrollTop();
        setStateUser();
        self.showOptionRegister = $scope.userApp.state === configProvider.userStates.liteRegistry;
        //updateFirstLoadDashboard();
        hardwareBackButtonManager.disable();
        self.numPockets = $scope.userApp.numPockets;
    });

    /*
     * Metodo para ir a la pantalla de movimientos.
     * @method goToMovements
     * @public
     */
    self.goToMovements = function() {
        if(!self.isUserEnroll) {
            $state.go('movements');
        }
    };

    function sayHello() {
        var name = 'Ricardo Caicedo';
        cordova.exec(sayHelloSuccess, sayHelloFailure, 'DetectIDPlugin', 'deviceRegistrationByCode', [name]);
    }

    function sayHelloSuccess(data) {
        WL.SimpleDialog.show(
        'Response success from plug-in',
        data,
        [{
            text: 'OK',
            handler: function() {
                WL.Logger.debug('Ok button pressed');
            }
        }]
       );
   }

    function sayHelloFailure(data){
        WL.SimpleDialog.show(
            'Response Fail from plug-in',
            data,
            [{
                text: 'OK',
                handler: function() {
                    WL.Logger.debug('Ok button pressed');
                }
            }]
        );
    }

    self.tryToRegister = function () {
        /*
        detectIdProvider.getSoftToken().then(function(data){
            logManager.debug(data);
            alert(data);
        }, function(error){
            logManager.error(error);
        });
        */
    };

    self.isProvisioned = function () {
        /*
        detectIdProvider.isDeviceProvisioned().then(function(data){
            logManager.debug(data);
            alert(data);
        }, function(error){
            logManager.error(error);
        });
        */
    };

    self.logoutEnroll = function () {
        userState.logoutEnroll().then(function(){
            toast.hideMessage();
            toast.showAsyncMessage('Se cerrará sesion', 'success');
            $state.go('home');
        }, function(){
            logManager.error('No se cerro sesion');
        });
    };

    self.goToPayResumeTest = function(){
        var codeInfo = {
            code: '0078'
        };

        $state.go('payResume', codeInfo);
    };

    /**
     * CallBack exitoso del metodo {{#crossLink "getPockets/getPocketsSuccess:method"}}{{/crossLink}}
     * @method getSavedSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @private
     * @return Object Json con el resultado de la validación
     */
    function getPocketsSuccess(response) {
        var data,
        i=0,
        size;
        self.pocketsSize = null;
        self.goalsSize = null;
        self.pocketsValue = null;
        self.goalsValue = null;
        self.savedValue = null;
        busyIndicator.hide();

        if (response.responseJSON.success) {
            data = response.responseJSON.data;
            size = data.length;
            $timeout(function(){
                self.balanceFree = response.responseJSON.freeAmt;
                $scope.userApp.balanceFree = response.responseJSON.freeAmt;
                for(i; i < size; i++){
                    if(data[i].pocketType === ''+configProvider.pocketsTypes.saved){
                        self.savedValue = self.savedValue +  parseFloat(data[i].value);
                    }else if(data[i].pocketType ===  ''+configProvider.pocketsTypes.pocket){
                        self.pocketsValue = self.pocketsValue + parseFloat(data[i].value);
                        self.pocketsSize++;
                    }else{
                        self.goalsValue = self.goalsValue + parseFloat(data[i].value);
                        self.goalsSize++;
                    }
                }
            },0);

        } else {
            self.moneyPartition.hide();
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
     * CallBack error del metodo {{#crossLink "getPockets/getPocketsFail:method"}}{{/crossLink}}
     * @method getPocketsFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `false`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     * @return Object Json con datos del error
     */
    function getPocketsFail(error) {
        busyIndicator.hide();
        self.moneyPartition.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Método para realizar la consulta de bolsillos.
     * @method getPockets
     * @private
     */
     function getPockets() {
        var invocationData,
        params = [];

        busyIndicator.show();

        params.push(configProvider.pocketsTypes.pocketsAndSaved);

        invocationData = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.getPocketsProcedure,
            params
        );
        invocationManager.invokeAdaptherMethod(invocationData, getPocketsSuccess, getPocketsFail);
    }

    /**
     * Método abrir el modal distribucion de plata
     * @method openMoneyPartition
     * @public
     */
    self.openMoneyPartition = function(){
        getPockets();
        self.moneyPartition.show();
    };
}]);
