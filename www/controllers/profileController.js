/**
* Controlador para la pantalla del perfil, es la pantalla inicial del perfil.
* @class profileController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('profileController',
    ['hardwareBackButtonManager', '$scope', 'messagesProvider', 'invocationManager',
        'busyIndicator', 'userState', '$ionicPopup', '$state', '$ionicModal', 
        'errorManager', 'configProvider', '$ionicScrollDelegate', 
        'getBalanceProvider', 'helpProvider', '$rootScope', 'keySecurityProvider',  '$timeout', 
    function (hardwareBackButtonManager, $scope, messagesProvider, 
    invocationManager, busyIndicator, userState, $ionicPopup, $state, 
    $ionicModal, errorManager, configProvider, $ionicScrollDelegate, 
    getBalanceProvider, helpProvider, $rootScope, keySecurity,  
    $timeout) {

    hardwareBackButtonManager.enable();

    var self = this;

    /**
     * Variable para almacenar el número de celular del usuario.
     * @property phoneNumber
     * @type Number
     */
    self.phoneNumber = null;

    /**
     * Variable para almacenar el email del perfil del usuario.
     * @property email
     * @type String
     */
    self.email = null;

    /**
     * Variable para almacenar el número de la cuenta del perfil del usuario.
     * @property accountNumber
     * @type Number
     */
    self.accountNumber = null;

    /**
     * Variable para almacenar el tipo de idenficicación del usuario.
     * @property typeId
     * @type String
     */
    self.typeId = null;

    /**
     * Variable para almacenar el nombre del tipo de idenficicación del usuario.
     * @property typeIdName
     * @type String
     */
    self.typeIdName = null;

    /**
     * Variable para almacenar el númro de identificación del usuario.
     * @property id
     * @type Number
     */
    self.id = null;

    /**
     * Variable para almacenar el nombre del usuario.
     * @property fullName
     * @type String
     */
    self.fullName = null;

    /**
     * Variable para almacenar el id del contrato que firmo el usuario.
     * @property contractId
     * @type Number
     */
    self.contractId = null;

    /**
     * Variable para almacenar el contrato firmado por el usuario.
     * @property contract
     * @type String
     */
    self.contract = null;

    /**
     * Propiedad para saber si se muestran las opciones de vinculado o enrolado
     * @property isUserEnroll
     * @type Boolean
     */
    self.isUserEnroll = false;

    /**
     * Propiedad para mostrar el perfil cuando se tengan datos.
     * @property showProfile
     * @type Boolean
     */
    self.showProfile = false;

    /**
     * Propiedad para almacenar el balance total del usuario
     * @property balanceTotal
     * @type Double
     */
    self.balanceTotal = null;
    /**
     * Propiedad para saber cuando el balance total es cero o no
     * @property isBalanceZero
     * @type Boolean
     */
    self.isBalanceZero = false;

    /**
    * profile-costs-table Modal
    */
    $ionicModal.fromTemplateUrl('views/profile-costs-table.html' , {
        id: 'profileCostsTable ',
        scope: $scope,
        animation: 'fade-in-scale'
    }).then(function(modal) {
        $scope.profileCostsTable = modal;
    });

    /**
     * CallBack exitoso del metodo ´getProfileUser´.
     * @method getProfileUserSuccess
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true`
     * @param {Object} [response.data] objeto con la información del perfil del usuario.
     * @param {Number} [response.data.id] número de identificación del usuario.
     * @param {Number} [response.data.accountNumber] número de cuenta del usuario.
     * @param {Number} [response.data.phoneNumber] número de teléfono del usuario.
     * @param {String} [response.data.email] string con email del usuario.
     * @param {String} [response.data.contract] string con el resumen del contrato firmado por el usuario.
     * @param {String} [response.data.typeIdName] string con el tipo de identificación del usuario.
     * @param {Number} [response.data.contractId] número con el id del contrato firmado por el usuario.
     * @param {String} [response.data.fullName] string con el nombre del usuario.
     * @param {String} [response.data.typeId] string con el tipo de identificación del usuario.
     * @param {Object} [response.error] objeto con la descripción y el id del error.
     * @private
    */
    function getProfileUserSuccess(response) {
        busyIndicator.hide();
        self.showProfile = true;

        
        
            self.id             = $rootScope.actualUser.documentNumber;
            self.accountNumber  = 1128394746;
            self.phoneNumber    = $rootScope.actualUser.phoneNumber;
            self.email          = $rootScope.actualUser.email;
            self.contract       = "Resumen";
            self.typeIdName     = "Cédula de ciudadanía";
            self.contractId     = 5;
            self.fullName       = $rootScope.actualUser.nickname;
            self.typeId         = $rootScope.actualUser.documentType;

            $scope.userApp.contract     = "Resumen";;
            $scope.userApp.contractId   = 5;
        

       

    }

    /**
     * CallBack error del metodo ´getProfileUser´
     * @method getProfileUserFail
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `false`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @private
     */
    function getProfileUserFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo privado en el cual solicita el perfil del usuario.
     * @method getProfileUser
     * @private
    */
    self.getProfileUser = function() {
        var invocationData,
        params = [];

        busyIndicator.show();

       getProfileUserSuccess();
    };


    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    self.logout = function(){
        $ionicPopup.confirm({
            title: messagesProvider.closeApp.title,
            template: messagesProvider.closeApp.message
        }).then(function(res){
            if( res ){
                    $state.go('home');
            }
        });
    };

    /**
     * Metodo para cerrar la cuenta del usuario.
     * @method closeAccount
     * @public
     */
    self.closeAccount = function(){
        if(self.isBalanceZero) {
            /* TODO: Crear metodo para cerrar la cuenta */
        }
    };

    self.showHelpView = function() {
        helpProvider.showView();
    };

     /**
     * Implementación de funciones de ciclo de vida de la pantalla
     * para setear las variables de la vista antes de cargar la pantalla.
     * @method $ionicView.beforeEnter
     * @async
    **/
    $scope.$on('$ionicView.beforeEnter', function() {
        
        $ionicScrollDelegate.scrollTop();
        self.isUserEnroll = $scope.userApp.state === configProvider.userStates.enroll;
        self.balanceTotal = 600000;
        /* Si el usuario esta enrolado solo le mostramos su número de cuenta */
        
        self.getProfileUser();
           
    });

    /**
     * Implementación para ejecutar metodos al salir de la pantalla.
     * @method $ionicView.afterLeave
     * @async
    **/
    $scope.$on('$ionicView.afterLeave', function() {
        cleanProfile();
    });

    /**
     * Metodo para limpiar las propiedades del controlador.
     * @method cleanProfile
     * @priivate
    **/
    function cleanProfile (){
        self.phoneNumber = null;
        self.email = null;
        self.accountNumber = null;
        self.fullName = null;
        self.typeId = null;
        self.id = null;
        self.typeIdName = null;
    }
    
    /**
     * Metodo en el cual se envia la petición de validación de la
     * clave de transacción del usuario, el callBack de la respuesta
     * del provider de validación de la clave es `keySecurityValidation`.
     * @method openSecurity
     * @async
     **/
    self.openSecurity = function(){
        $state.go('security');
    };

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
            busyIndicator.hide();
            $state.go('security');
            keySecurity.reset();
        }else{
            busyIndicator.hide();
            if(response.responseJSON.error.toasShow){
                errorManager.showAsyncMessage(response.responseJSON.error);
            }
        }
    };

}]);
