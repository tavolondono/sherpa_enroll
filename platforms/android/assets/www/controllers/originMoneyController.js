/**
* Controlador para el manejo de bolsillos.
* @class pocketsController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('originMoneyController',
    ['$scope', '$state', 'hardwareBackButtonManager', 'configProvider', 'invocationManager', 'busyIndicator','$timeout', 'userState', 'errorManager', '$stateParams', '$ionicSlideBoxDelegate', 'messagesProvider', 'getBalanceProvider',
    function ($scope, $state, hardwareBackButtonManager, configProvider, invocationManager, busyIndicator, $timeout, userState, errorManager, $stateParams, $ionicSlideBoxDelegate, messagesProvider, getBalanceProvider) {

    var self = this;

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
    * Propiedad para almacenar los bolsillos
    * @property pockets
    * @type Array
    */
    self.pockets = [
        {
            'name':'transporte',
            'value': '50000',
            'newValuePocket': '40000',
            'pocketType': '2'
        },
        {
            'name':'estudio',
            'value': '100000',
            'newValuePocket': '30000',
            'pocketType': '0'
        },
               
        ];


    /**
    * Propiedad para almacenar el tipo de transferencia que se esta realizando.
    * @property typeTransfer
    * @type String
    */
    self.typeTransfer = null;

    /**
    * Propiedad para almacenar el indice del bolsillo del que se quiere hacer uso de la plata.
    * @property indexPocket
    * @type Integer
    */
    self.indexPocket = 0;

    /**
    * Propiedad para colocar la acción del boton.
    * @property actionButton
    * @type String
    */
    self.actionButton = '';

    /**
    * Propiedad para activar o no el boton de pago si el bolsillo es mayor a cero.
    * @property transferAvailable
    * @type Boolean
    */
    self.transferAvailable = true;

    /**
    * Propiedad para almacenar el numero de bolsillos.
    * @property numPockets
    * @type Integer
    */
    self.numPockets = null;

    /**
     * CallBack exitoso del metodo getBalance
     * @method balanceSuccess
     * @param {Object} [response] objeto con los valores del saldo del usuario.
     * @private
     */
    function balanceSuccess(response) {
        busyIndicator.hide();
        $scope.$apply(function() {
           self.balanceAvailable = response.spendBoundary;
           self.balance = response.balance;
        });
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
        busyIndicator.show();
        getBalanceProvider.balance().then(function(balance){
            balanceSuccess(balance);
            $scope.$broadcast('scroll.refreshComplete');
        }, function(error){
            balanceFail(error);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    /**
    * CallBack exitoso del metodo {{#crossLink "getPockets/getPocketsSuccess:method"}}{{/crossLink}}
    * @method getPocketsSuccess
    * @param {Object} [response] objeto con la estructura de la respuesta
    * @param {Boolean} [response.success] variable `true`
    * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
    * @private
    * @return Object Json con el resultado de la validación
    */
    function getPocketsSuccess(response) {
        var pockets = [],
            freeMoney,
            pocketData;

        busyIndicator.hide();

        if (response.responseJSON.success) {

            pockets.push({
                name: configProvider.pocketsName.available,
                value: response.responseJSON.freeAmt
            });

            $scope.userApp.balanceFree = response.responseJSON.freeAmt;

            pocketData = response.responseJSON.data;

            if(pocketData.length > 0) {
                pocketData = pocketData.reverse();
                pockets = pockets.concat(pocketData);
            }

            /* Enviamos los bolsillos a la vista */
            $timeout(function() {
                self.pockets = pockets;
                $ionicSlideBoxDelegate.update();
                self.selectOriginTransfer(0);
                $ionicSlideBoxDelegate.slide(0);
            }, 0);
        } else {
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
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

   /**
    * Método para realizar la consulta de bolsillos.
    * @method getPockets
    * @public
    */
    self.getPockets = function() {

        var params = [],
            invocationData;

        busyIndicator.show();
        
        self.showPocketContainer = false;

        params.push(configProvider.pocketsTypes.pocketsAndSaved);

        invocationData = invocationManager.getInvocationData(
            configProvider.middlewareAdapter,
            configProvider.getPocketsProcedure,
            params
        );
        invocationManager.invokeAdaptherMethod(invocationData, getPocketsSuccess, getPocketsFail);
    };

    /**
    * Método para dirigir el flujo según el tipo de transferencia.
    * @method goToTypeTransfer
    * @private
    */
    function goToTypeTransfer(dataTransferValue) {
        switch(self.typeTransfer) {
            case configProvider.typeTransfer.pay:
                $state.go('payments', dataTransferValue);
            break;
            case configProvider.typeTransfer.send:
                $state.go('transferContact', dataTransferValue);
            break;
            case configProvider.typeTransfer.cashout:
                $state.go('cashoutSend', dataTransferValue);
            break;
            default:
                $state.go('payments', dataTransferValue);
            break;
        }
    }

    /**
    * Método para iniciar el flujo de transferencias.
    * @method goToTransfer
    * @public
    */
    self.goToTransfer = function(){
        if(self.transferAvailable) {
            var dataTransfer = {},
                transferOrigin,
                pockets = [];

            if(self.indexPocket !== 0){
                pockets.push(self.pockets[self.indexPocket]);
                transferOrigin = configProvider.pocketsCode[self.pockets[self.indexPocket].pocketType];
            } else {
                transferOrigin = configProvider.transferOrigin.available;
            }

            dataTransfer = {
                typeTransfer: self.typeTransfer,
                transferOrigin: transferOrigin,
                pockets: pockets
            };

            goToTypeTransfer(dataTransfer);
        }
    };

    /**
    * Método para seleccionar el bolsillo del que se quiere hacer uso de la plata.
    * @method selectOriginTransfer
    * @public
    */
    self.selectOriginTransfer = function(indexPocket) {
        self.indexPocket = indexPocket;
        if(parseInt(self.pockets[indexPocket].value) === 0){
            self.transferAvailable = false;
        } else {
            self.transferAvailable = true;
        }
    };

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function() {
        var dataTransfer = {};
    	self.typeTransfer = $stateParams.typeTransfer;
        
        self.balanceAvailable = 540000;
        
        self.balance = 250000;
        
        
        self.actionButton = messagesProvider.generalActions[self.typeTransfer];

        

        
    });

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista despues de salir.
     * @method $ionicView.afterLeave
     * @async
     */
    $scope.$on('$ionicView.afterLeave', function(){
        self.typeTransfer = null;
        self.indexPocket = null;
        self.actionButton = messagesProvider.generalActions[configProvider.typeTransfer.pay];
    });

}]);
