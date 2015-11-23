/**
* Descripción controlador para manejar la vista registry-contract.
* @class contractController
* @constructor
* @extends liteRegistryController
* @module sherpa
*/

angular.module('App')
    .controller('configBiometryRegistryController',
     ['$scope', 'messagesProvider', 'invocationManager', 'busyIndicator', 
         'errorManager', '$ionicModal', '$state', '$rootScope',
       function ($scope, messagesProvider, invocationManager, busyIndicator, 
       errorManager, $ionicModal, $state, $rootScope) {

    var self = this;
    
    
    self.notContinue = true;
    self.hasDevice = false;
    self.hasBiometry = false;
    self.hasPassword = false;
    
    
    if ($rootScope.actualUser) {
        if ($rootScope.actualUser.hasDeviceProvided !== undefined) {
            self.hasDevice = $rootScope.actualUser.hasDeviceProvided;
        }
        if ($rootScope.actualUser.hasBiometry !== undefined) {
            self.hasBiometry = $rootScope.actualUser.hasBiometry;
        }
        if ($rootScope.actualUser.hasPassword !== undefined) {
            self.hasPassword = $rootScope.actualUser.hasPassword;
        }
        
        if (self.hasDevice && self.hasBiometry && self.hasPassword) {
            self.notContinue = false;
        }
    }
    
    /* Modal para mostrar el exito del envio del email */
    $ionicModal.fromTemplateUrl('views/modal-send-email-success.html', {
        id: 'sendEmailSuccess',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.sendEmailSuccess = modal;
    });

    /**
     * Callback cuando el proceso de consulta de datos del contrato fue exitoso.
     * @method getActiveContractSuccess
     * @private
    */
    function getActiveContractSuccess(response) {
        busyIndicator.hide();
        $scope.$apply(function(){
            $scope.registryController.registryModel.contract = response.responseJSON.data;
        });
    }

    /**
     * Callback si sucede un error al consultar los datos del contrato
     * @method getActiveContractFail
     * @private
    */
    function getActiveContractFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo privado en el cual solicita el último contrato activo para mostrar al usuario.
     * @method getActiveContract
     * @private
    */
    function getActiveContract() {

        if($scope.registryController.registryModel.hasOwnProperty('contract') &&
            $scope.registryController.registryModel.contract === null) {
            $scope.registryController.registryModel.contract = messagesProvider.liteRegistry.contract;
            
        }
    }

    /**
     * Metodo publico en el cual acepta el contrato
     * @method acceptContract
     * @public
     * @async
    */
    self.acceptContract = function() {
        $scope.sendEmailSuccess.show();
        //$scope.registryController.goToNextPage();
    };

    /**
    * Metodo para redireccionar a la url de PSE
    * @method redirect
    * @public
    */
    self.redirect = function(url) {
        $state.go(url);
    };
    
    
    self.goEnroll = function() {
        if (!self.hasDevice) {
            $state.go('enroll');
        }
    };
    
    self.goChooseBiometry = function () {
        if (self.hasDevice && !self.hasBiometry) {
            $state.go('registry.chooseBiometry');
        }
    };
    
    self.goPassword = function () {
        if (self.hasDevice && self.hasBiometry && !self.hasPassword) {
            $state.go('registry.password');
        }
    };

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function(){
        getActiveContract();
    });
    
    
    self.nextPage = function() {
        $scope.sendEmailSuccess.hide();
        $scope.registryController.goToNextPage();
    };
    
    self.next = function() {
        $state.go('dashboard');
    };

}]);
