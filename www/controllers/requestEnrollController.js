/**
 * Controlador para manejar la vista de enrolamiento.
 * @class requestEnrollController
 * @constructor
 * @module sherpa
 */
angular.module('App')
        .controller('requestEnrollController',
                ['$timeout', '$scope', '$state', 'configProvider', 'invocationManager', 
                    'busyIndicator', '$document', 'errorManager', 'hardwareBackButtonManager', 
                    '$ionicModal', 'messagesProvider', '$rootScope', 'userManager', 
                    function ($timeout, $scope, $state, configProvider, 
                    invocationManager, busyIndicator, $document, errorManager, 
                    hardwareBackButtonManager, $ionicModal, messagesProvider, 
                    $rootScope, userManager) {

                        var self = this;

                        hardwareBackButtonManager.enable();

                        /**
                         * Propiedad para inyectar una clase bastante al bar-footer
                         * @property classBar
                         * @type boolean
                         */
                        self.classBar = false;
                        $document.ready(function () {
                            self.classBar = true;
                        });

                        /**
                         * Propiedad donde verificamos si el teclado se esta mostrando
                         * @property keyboardShow
                         * @type boolean
                         */
                        $scope.keyboardShow = true;

                        /**
                         * Propiedad donde se almacena el celular para el enrolamiento
                         * @property phoneNumber
                         * @type Int
                         */
                        self.phoneNumber = '';

                        /**
                         * Propiedad donde se almacena el check de aceptar terminos y condiciones.
                         * @property termsConditions
                         * @type Boolean
                         */
                        self.termsConditions = false;

                        /**
                         * Propiedad para validar el formato del teléfono
                         * @property isInvalidPhoneNumber
                         * @type boolean
                         */
                        self.isInvalidPhoneNumber = null;

                        /**
                         * Propiedad para validar el formulario
                         * @property isInvalidForm
                         * @type boolean
                         */
                        self.isInvalidForm = true;

                        /**
                         * Modal de explicación del ingreso del número del celular.
                         */
                        $ionicModal.fromTemplateUrl('views/why-enroll.html', {
                            id: 'whyEnroll',
                            scope: $scope,
                            animation: 'fade-in-scale'
                        }).then(function (modal) {
                            $scope.whyEnroll = modal;
                        });

                        /**
                         * Callback para cuando la solicitud del token fue exitosa
                         * @method sendRequestEnrollSuccess
                         * @param response {Object}
                         * @private
                         */
                        function sendRequestEnrollSuccess(response) {
                            busyIndicator.hide();
                            if (!response.responseJSON.success) {
                                errorManager.showAsyncMessage(response.responseJSON.error);
                            } else {
                                $state.go('token', {});
                                $scope.userApp.phoneNumber = self.phoneNumber;
                            }
                        }

                        /**
                         * Callback para cuando la solicitud del token fue erronea
                         * @method sendRequestEnrollFail
                         * @param error {Object}
                         * @private
                         */
                        function sendRequestEnrollFail(error) {
                            busyIndicator.hide();
                            errorManager.showAsyncMessage(error.responseJSON.error);
                        }

                        /**
                         * Metodo para solicitar al Middleware el token para el enrolamiento
                         * @method sendRequestEnroll
                         * @public
                         */
                        self.sendRequestEnroll = function () {
                            var params;

                            if (!self.validateForm()) {
                                params = [
                                    self.phoneNumber.toString(),
                                    self.termsConditions
                                ];

                                busyIndicator.show();
                                $state.go('token', {});
                                $scope.userApp.phoneNumber = self.phoneNumber;
                                $rootScope.actualUser.phoneNumber = self.phoneNumber;
                                userManager.saveUser($rootScope.actualUser);
                            }
                        };

                        /**
                         * Metodo para validar el campo de teléfono
                         * @method validatePhone
                         * @public
                         */
                        self.validatePhone = function () {

                            $timeout(function () {
                                $scope.keyboardShow = true;
                            }, 250);

                            if (typeof self.phoneNumber !== 'undefined' && self.phoneNumber.length === 10) {
                                self.isInvalidPhoneNumber = false;
                            } else {
                                self.isInvalidPhoneNumber = true;
                                errorManager.showMessage(messagesProvider.login.user.errorLogin);
                            }

                            self.validateForm();
                        };

                        /**
                         * Metodo para validar el formulario entero.
                         * @method validateForm
                         * @public
                         */
                        self.validateForm = function () {
                            if (!self.isInvalidPhoneNumber && self.termsConditions) {
                                self.isInvalidForm = false;
                            } else {
                                self.isInvalidForm = true;
                            }
                            return self.isInvalidForm;
                        };

                        window.addEventListener('native.keyboardshow', function () {
                            $scope.keyboardShow = false;
                        });
                        window.addEventListener('native.keyboardhide', function () {
                            $scope.keyboardShow = true;
                        });

                        self.checkTerms = function () {
                            if (self.termsConditions) {
                                self.termsConditions = false;
                            } else {
                                self.termsConditions = true;
                            }
                            self.validateForm();
                        };

                    }]);
