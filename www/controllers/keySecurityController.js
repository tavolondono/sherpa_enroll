/**
* Controlador del modal de ingreso de clave
* @class keySecurityController
* @constructor
* @module sherpa
**/
angular.module('App')
    .controller('keySecurityController',
    ['$scope', '$filter', 'utilsProvider','$ionicModal','messagesProvider', '$state', 
    function ($scope, $filter, utilsProvider, $ionicModal, messagesProvider, $state ) {

    var self = this;

    /**
     * Parametro de password para la vista
     * @property password
     * @type {String}
    **/
    self.password = null;
    /**
     * Parametro de password para enviar al metodo de validación de la clave.
     * @property passwordSecurity
     * @type {String}
    **/
    self.passwordSecurity = null;

    /**
     * Parametro para mostrar el titulo de la pagina.
     * @param {String} titlePage
    **/
    self.titlePage = messagesProvider.liteRegistry.password.title;
    /**
     * Parametro para mostrar un titulo en la pagina antes de la descripción.
     * @param {String} title
    **/
    self.title = messagesProvider.liteRegistry.password.title;
    /**
     * Parametro para mostrar la descripción en la pagina.
     * @param {String} description
    **/
    self.description = messagesProvider.liteRegistry.password.description;

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
     * Metodo para ocultar el modal de la clave.
     * @method hide
     * @private
    */
    self.hide = function (){
        self.password = '';
        
    };

    $scope.$watch(function(scope) {
        return scope.keySecurityControl.password;
    }, function(newValue, oldValue) {
        $scope.keySecurityControl.password = $filter('trimTex')(newValue);
        $scope.keySecurityControl.password = $filter('trimNumericKey')(newValue);
        if ( (utilsProvider.validateNull(oldValue) && oldValue.length > 1) && (newValue==='' || newValue===undefined) ) {
            $scope.keySecurityControl.password = oldValue;
        }
        if ($scope.keySecurityControl.password.length===4){

            self.passwordSecurity = $scope.keySecurityControl.password;
            $scope.keySecurityControl.password = null;
            self.validationkeySecurity();
        }
    });

    /**
     * CallBack del metodo `validationkeySecurity`, este metodo hace el llamdo
     * al callBack del provider y se ejecuta la función del controlador que invoco
     * al provider.
     * @method successValidationKey
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `true` o `false`
     * @param {Object} [response.error] objeto con la descripción y el id del error, es vacio
     * @public
     * @return Object Json con el resultado de la validación
     * @async
    */
    self.successValidationKey = function (response){
        
            console.log('ERROR EN CONTROLLER KEY');
        
    };

    /**
     * Metodo que invoca cierre de session de la applicacion
     * @method logout
     * @private
     */
    function logout() {
       
    }

    /**
     * Metodo privado para enviar la transferencia al provider.
     * @method validationkeySecurity
     * @async
    **/
    self.validationkeySecurity = function (){
        
    };

     /**
     * Metodo para ir a recuperar la contraseña
     * @method goToRecoverPassword
     * @public
     */
    $scope.goToRecoverPassword = function(){
        $state.go('recoverPassMail');
        $scope.finalWarningModal.hide();
        self.hide();
    };

}]);
