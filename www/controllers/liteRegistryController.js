/**
* Controlador para el wizzard de registro liviano
* @class liteRegistryController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('liteRegistryController',
    ['$scope', '$ionicHistory', 'messagesProvider', '$ionicPopup', '$state', 'hardwareBackButtonManager', '$timeout', 'configStyles',
    function ($scope, $ionicHistory, messagesProvider, $ionicPopup, $state, hardwareBackButtonManager, $timeout, configStyles) {

    var self = this;

    /**
    * Propiedad donde se almacenan los datos para el almacenamiento liviano
    * @property registryModel
    * @type Object
    */
    self.registryModel = {};

    /**
     * Propiedad para controlar la iteración de animación de vinculación.
     * @property countView
     * @type {Number}
     */
    self.registryModel.countView = 0;

    /**
     * Propiedad para visualizar los veneficios.
     * @property isShowAdvantage
     * @type {Boolean}
     */
    self.registryModel.isShowAdvantage = true;

    /**
     * Propiedad para visualizar el formulario de nickName.
     * @property isShowNickName
     * @type {Boolean}
     */
    self.registryModel.isShowNickName = false;

    /**
     * Cadena con el nickname
     * @property nickname
     * @type String
     */
    self.registryModel.nickname = null;

    /**
    * Propiedad donde se almacenan la fecha de nacimiento del usuario
    * @property birthDate
    * @type Date
    */
    self.registryModel.birthDate = null;

    self.registryModel.birthDateString = 'dd/mm/aaaa';

    /**
    * Propiedad donde se almacenan la fecha de expedición del documento del usuario
    * @property expeditionDate
    * @type Date
    */
    self.registryModel.expeditionDate = null;

    self.registryModel.expeditionDateString = 'dd/mm/aaaa';

    /**
    * Propiedad donde se almacena el celular para el registro liviano
    * @property phoneNumber
    * @type Int
    */
    self.registryModel.phoneNumber = $scope.userApp.phoneNumber;

    /**
    * Propiedad donde se almacena el tipo de documento del usuario
    * @property documentType
    * @type String
    */
    self.registryModel.documentType = null;

    /**
    * Propiedad donde se almacenan el numero del documeto del usuario
    * @property documentNumber
    * @type Int
    */
    self.registryModel.documentNumber = null;

    /**
    * Propiedad donde se almacenan el email del usuario
    * @property email
    * @type String
    */
    self.registryModel.email = null;

    /**
    * Propiedad donde se almacenan el password del usuario
    * @property password
    * @type String
    */
    self.registryModel.password = null;

    /**
     * Propiedad para saber si el usuario requiere que el contrato sea enviado a su email.
     * @property isSendContract
     * @type Boolean
    */
    self.registryModel.isSendContract = false;

    /**
    * Propiedad donde se almacenan el contrato
    * @property contract
    * @type String
    */
    self.registryModel.contract = null;

    /**
    * Propiedad donde se almacenan el contrato
    * @property acceptContract
    * @type Boolean
    */
    self.registryModel.acceptContract = false;

    /**
    * Propiedad donde se almacenan el primer nombre del usuario
    * se obtiene de FINACLE
    * @property firstName
    * @type String
    */
    self.firstName = '';

    /**
    * Propiedad donde se almacenan el segundo nombre del usuario
    * se obtiene de FINACLE
    * @property firstName2
    * @type String
    */
    self.firstName2 = '';

    /**
    * Propiedad donde se almacenan el primer apellido del usuario
    * se obtiene de FINACLE
    * @property lastName
    * @type String
    */
    self.lastName = '';

    /**
    * Propiedad donde se almacenan el segundo apellido del usuario
    * se obtiene de FINACLE
    * @property lastName2
    * @type String
    */
    self.lastName2 = '';

    /**
    * Metodo para obtener la primera pantalla del wizard
    * @method getFirstStepPath
    * @public
    */
    self.getFirstStepPath = function() {
        return 'registry.nickname';
    };

    /**
    * Metodo para obtener el primer titulo de la primera pantalla del wizard
    * @method getFirstStepTitle
    * @private
    */
    function getFirstStepTitle() {
        return messagesProvider.liteRegistry.advantage.title;
    }

    /**
    * Metodo que reinicia el estado de los formularios
    * @method clearForms
    * @private
    */
    function clearForms(){
        $ionicHistory.clearCache();
    }

    /**
    * Propiedad donde se almacenan los datos de la pantalla actual del wizard donde se encuentra el usuario.
    * @property current
    * @type Object
    */
    self.current = {
        state: self.getFirstStepPath(),
        title: getFirstStepTitle()
    };
    /**
    * Metodo para cancelar el proceso de vinculación liviana realizado con el wizard
    * @method cancelProcess
    * @public
    */
    self.cancelProcess = function () {
        $ionicPopup.confirm({
            title: messagesProvider.liteRegistry.cancelDialogTitle,
            template: messagesProvider.liteRegistry.cancelDialogText
        }).then(function (response) {
            if (response) {
                self.registryModel = {};
                self.current.state = self.getFirstStepPath();
                self.current.title = getFirstStepTitle();
                $state.go('dashboard');
                clearForms();
                configStyles.backgroundColor.nameClass = '';
            } else {
                hardwareBackButtonManager.enable(self.cancelProcess);
            }
        });
    };

    /**
    * Metodo para finanlizar el proceso de vinculacion liviana ejecutado en el wizard
    * @method finishProcess
    * @private
    */
    function finishProcess() {
        $state.go(
            'welcome',
            {email: self.registryModel.email}
        );
        self.registryModel = {};
        self.current.state = self.getFirstStepPath();
        self.current.title = getFirstStepTitle();
        clearForms();
    }

    /**
    * Metodo para cargar la pantalla de clave transacional
    * @method loadTransPassword
    * @public
    */
    self.loadTransPassword = function() {
        configStyles.backgroundColor.nameClass = 'password';
        if(messagesProvider.liteRegistry.password.explanetionText === '') {
            messagesProvider.liteRegistry.password.explanetionText = messagesProvider.generalActions.tempExplanetionText;
        }
    };

    /**
    * Metodo para ir a la siguiente pantalla del proceso de vinculación liviana en el wizard
    * @method goToNextPage
    * @public
    */
    self.goToNextPage = function () {
        var switchTo = '',
        title = '';
        switch (self.current.state) {
            case 'registry.nickname':
                switchTo = 'registry.id';
                title = messagesProvider.liteRegistry.id.title;
            break;
            case 'registry.id':
                switchTo = 'registry.contract';
                title = messagesProvider.liteRegistry.contract.title;
            break;
            case 'registry.contract':
                switchTo = 'registry.biometryConfigAccount';
                title = messagesProvider.liteRegistry.configureAccount.title;
            break;
            case 'registry.email':
                switchTo = 'registry.password';
                title = messagesProvider.liteRegistry.password.title;
                self.loadTransPassword();
            break;
            case 'registry.password':
                switchTo = 'welcome';
            break;
            default:
                switchTo = '#';
            break;
        }
        if(switchTo === 'welcome') {
            finishProcess();
        } else {
            $state.go(switchTo);
            self.current.state = switchTo;
            self.current.title = title;
        }
    };

    /**
    * Metodo para ir a la pantalla anterior del proceso de vinculación liviana en el wizard
    * @method goToPreviousPage
    * @public
    */
    self.goToPreviousPage = function () {
        var switchTo = '',
        title = '';
        switch (self.current.state) {
            case 'registry.password':
                switchTo = 'registry.email';
                title = messagesProvider.liteRegistry.email.title;
                configStyles.backgroundColor.nameClass = '';
            break;
            case 'registry.email':
                switchTo = 'registry.contract';
                title = messagesProvider.liteRegistry.id.title;
            break;
            case 'registry.contract':
                switchTo = 'registry.id';
                title = messagesProvider.liteRegistry.email.title;
            break;
            case 'registry.id':
                switchTo = 'registry.nickname';
                title = messagesProvider.liteRegistry.nickname.title;
            break;
            case 'registry.nickname':
                switchTo = 'dashboard';
                title = messagesProvider.liteRegistry.nickname.title;
            break;
            default:
                switchTo = '#';
            break;
        }
        if(switchTo === 'dashboard') {
            self.cancelProcess();
        } else {
            $state.go(switchTo);
            self.current.state = switchTo;
            self.current.title = title;
        }
    };

    self.closeAdvantage = function (){
        self.registryModel.countView = 3;
        self.showNickName();
    };

    /**
     * Metodo para visualizar el formulario del nickname.
     * @method showNickName
     * @public
     */
    self.showNickName = function() {
        self.registryModel.isShowNickName = true;
        $timeout(function() {
            self.registryModel.countView++;
            self.current.title = messagesProvider.liteRegistry.nickname.title;
            self.registryModel.isShowAdvantage = false;
        }, 1000);
    };

    /**
    * Habilitar el backButton navito
    **/
    hardwareBackButtonManager.enable(self.cancelProcess);
}]);
