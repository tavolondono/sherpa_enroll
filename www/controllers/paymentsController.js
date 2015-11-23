/**
* Controlador para la pantalla de pagos.
* @class paymentsController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('paymentsController',
    ['hardwareBackButtonManager', '$ionicModal', '$scope', '$state', 'invocationManager', 'busyIndicator', '$timeout', 'jsonStore', 'configProvider', 'logManager', 'errorManager', '$filter', 'scannerProvider', 'utilsProvider', '$ionicScrollDelegate', '$stateParams', 'getBalanceProvider',
    function (hardwareBackButtonManager, $ionicModal, $scope, $state, invocationManager, busyIndicator, $timeout, jsonStore, configProvider, logManager, errorManager, $filter, scannerProvider, utilsProvider, $ionicScrollDelegate, $stateParams, getBalanceProvider) {

    var self = this;

    /**
     * Parametro para almacenar el codigo generado del merchand.
     * @property qrCode
     * @type {Int}
     */
    self.qrCode = null;

    /**
     * Parametro para mostrar el formulario de ingreso del codigo manual.
     * @property isShowFormCode
     * @type {Int}
     */
    self.isShowFormCode = false;

    /**
     * Parametro para validar los permisos de la camara.
     * @property isShowFormCode
     * @type {Int}
     */
    self.isPermissionCam = false;

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
    * Se declara el modal para solicitar permisos de la camara
    */
    $ionicModal.fromTemplateUrl('views/payments-cam-permission.html', {
        id: 'requestCamPermission',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.requestCamPermission = modal;
    });

   /**
    * Se declara el modal de permisos denegados de la camara.
    */
    $ionicModal.fromTemplateUrl('views/payments-cam-permission-denied.html', {
        id: 'camPermissionDenied',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.camPermissionDenied = modal;
    });

   /**
    * Se declara el modal de error de lectura del codigo QR.
    */
    $ionicModal.fromTemplateUrl('views/payments-cam-scan-error.html', {
        id: 'camScanError',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.camScanError = modal;
    });

    $scope.$watch(function(scope) {
        return scope.paymentsControl.qrCode;
    }, function(newValue, oldValue) {
        self.qrCode = $filter('trimTex')(newValue);
        self.qrCode = $filter('trimNumericKey')(newValue);
        if ((utilsProvider.validateNull(oldValue) && oldValue.length > 1) && (newValue==='' || newValue===undefined)) {
            self.qrCode = oldValue;
        }
        if (self.qrCode.length===configProvider.otpSize){
            submitOtp();
        }
    });

    /**
     * Propiedad donde se almacena el saldo disponible para el usuario.
     * @property balanceAvailable
     * @type Double
     */
    self.balanceAvailable = null;

    /**
     * Propiedad donde se almacena el saldo total del usuario.
     * @property balanceTotal
     * @type Double
     */
    self.balanceTotal = null;

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
           self.balanceTotal = response.balance;
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
     * Método para verificar si se tienen permisos sobre la camara del movil para leer QR.
     * @method loadCamPermission
     * @private
     */
    function loadCamPermission() {
       
        $timeout(function() {
            scanQR();
        }, 200);
    }

    /**
     * Metodo callback de exito del scanQR.
     * @method onScanCamSuccess
     * @param {String} codeQr Codigo scaneado del QR.
     * @private
     */
    function onScanCamSuccess(codeQRValue) {
        var prefixQR,
        prefixPay = configProvider.prefixPayQR,
        codeLength = configProvider.otpSize,
        codeQR = codeQRValue,
        code,
        isValidQR = false;
        self.qrCode = code;
        submitOtp();
        
    }

    /**
     * Metodo callback de exito del scanQR.
     * @method onScanCamFail
     * @param {String} message Mensaje de error.
     * @private
     */
    function onScanCamFail(message) {
        if (message === configProvider.permission.cam.denied) {
            jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
                if (resp[0].json.data.permission.cam===null) {
                    /*Primer uso*/
                    resp[0].json.data.permission.cam = false;
                    jsonStore.replace(resp).then(function() {
                        $scope.requestCamPermission.hide();
                        self.goBack();
                    });
                } else {
                    /* Cuando se tenían permisos y se quitan desde el OS */
                    resp[0].json.data.permission.cam = false;
                    jsonStore.replace(resp).then(function() {});
                    $scope.camPermissionDenied.show();
                }
            });
        } else if (message === configProvider.permission.cam.cancel || message === configProvider.permission.cam.miscFailure) {
            self.goBack();
            jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
                if (resp[0].json.data.permission.cam===null) {
                    /*Primer uso*/
                    resp[0].json.data.permission.cam = true;
                    jsonStore.replace(resp).then(function() {});
                }
            });
        } else {
            jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
                if (resp) {
                    resp[0].json.data.permission.cam = true;
                    jsonStore.replace(resp).then(function() {});
                }
            });
        }
    }

    /**
     * Metodo para llamar el provider de scanCam para scanear codigos QR.
     * @method scanQR
     * @async
     * @public
     */
    function scanQR() {
        $timeout(function() {
            scannerProvider.scan().then(function(data){
                
                onScanCamSuccess(data);
            }, function(error){
                onScanCamFail(error);
            });
        }, 200);
    }

    /**
     * Metodo para consultar los permisos de la camara al sistema operativo.
     * @method consultPermissionMobile
     * @public
     */
    self.consultPermissionMobile = function() {
        $scope.requestCamPermission.hide();
        scanQR();
    };

    /**
     * Metodo para controlar el cierre del modal de permisos de la camara.
     * @method consultPermissionMobile
     * @public
     */
    self.deniedPermissionMobile = function() {
        self.goBack();
        $scope.requestCamPermission.hide();
    };

    /**
     * Metodo para realizar el llamado a la función de consultar resumen de un pago.
     * @method submitOtp
     * @private
     */
    function submitOtp() {
        
        var dataPay = {
            transferOrigin: self.transferOrigin,
            pockets: self.pockets,
            code: self.qrCode
        };

        $state.go('payResume', dataPay);
    }

    /**
     * Metodo Para volver a la pagina anterior.
     * @method goBack
     * @public
     */
    self.goBack = function () {
        $state.go('dashboard');
    };

    /**
     * Metodo para cerrar el modal de información de permisos y volver a la pagina anterior.
     * @method closePermissionDenied
     * @public
     */
    self.closePermissionDenied = function () {
        self.goBack();
        $scope.camPermissionDenied.hide();
    };

    /**
     * Metodo del modal de mal lectura del QR para mostrar el formulario de ingreso del codigo.
     * @method closePermissionDenied
     * @public
     */
    self.showFormCode = function () {
        self.isShowFormCode = true;
        $scope.camScanError.hide();
    };

    /**
     * Metodo para cerrar el modal de mal lectura del QR y volver a la pagina anterior.
     * @method closePermissionDenied
     * @public
     */
    self.closeCamScanError = function () {
        self.goBack();
        $scope.camScanError.hide();
    };

    /**
     * Habilitar el backButton navito
     */
    hardwareBackButtonManager.enable(self.goBack);

    /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
     */
    $scope.$on('$ionicView.beforeEnter', function(){
        $ionicScrollDelegate.scrollTop();
        self.transferOrigin = $stateParams.transferOrigin;
        self.pockets = $stateParams.pockets;
        self.isShowFormCode = false;
        self.qrCode = null;

        self.balanceAvailable = 540000;
        
        self.balance = 250000;

        loadCamPermission();
    });

}]);
