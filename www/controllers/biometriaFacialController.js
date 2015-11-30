/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
        .controller('biometriaFacialController', ['$scope', '$state', 'Camera', 
        'messagesProvider', '$ionicModal', '$timeout', '$rootScope', 
        'userManager', '$ionicPopup', '$stateParams', 'utilsProvider',
        function ($scope, $state, Camera, messagesProvider, $ionicModal, $timeout,
        $rootScope, userManager, $ionicPopup, $stateParams, utilsProvider) {
            
            var self = this;
            self.puedeSeguir = false;
            self.foto = [];
            var counter = 0;

            self.pageToGo = $stateParams.toPage;

            /**
             * Propiedad donde se almacenan la categoría actual seleccionada. Sirve como caché para no realizar consultas innecesarias al servicio.
             * @property currentCategory
             * @type String
             */
            self.currentCategory = '';

            /**
             * Propiedad que almacena la instancia del modal a ser presentado.
             * @property faqsModal
             * @type Object
             */
            self.faqsModal = {};

            /**
             * Propiedad para almacenar los datos de la categoria actual
             * @property currentCategoryData
             * @type Object
             */
            self.currentCategoryData = {};

            /**
             * 
             */
            $ionicModal.fromTemplateUrl('views/modal-facial.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                self.faqsModal = modal;
                ;
            });
            
            /**
             * Dispara el evento de la cámara
             * @returns {undefined}
             */
            self.takePhoto = function(){
                Camera.getPicture().then(function(imageURI) {
                    console.log(imageURI);
                    var objFoto = {
                        uri:imageURI,
                        position: counter++
                    };
                    self.foto.push(objFoto);
                    if (self.foto) {
                        if (self.foto.length > 2) {
                            self.puedeSeguir = true;                            
                        }
                    }
                }, function(err) {
                    console.err(err);
                }, {
                    cameraDirection: 1,
                    quality: 75,
                    targetWidth: 60,
                    targetHeight: 60,
                    saveToPhotoAlbum: false
                });
            };
            
            self.showHelp = function () {
                    self.currentCategory = 'registry.facial';
                    self.currentCategoryData = messagesProvider.faqs['registry.facial'];
                    $timeout(function() {
                        self.faqsModal.show();
                    }, 100);
                    
                };
                
            self.hideHelp = function () {
                self.faqsModal.hide();
            };
                


            self.siguiente = function () {
                if ($rootScope.actualUser.hasBiometry) {                    
                    $rootScope.actualUser.biometry.facial = {
                        'hasFacial': true,
                        'enabled': true
                    };                                        
                } else {
                    $rootScope.actualUser.hasBiometry = true;
                    $rootScope.actualUser.biometry = {
                        'facial' : {
                            'hasFacial' : true,
                            'enabled' : true
                        },
                        'principal' :  'facial',
                        'voice' : {
                            'hasVoice' : false,
                            'enabled' : false
                        }
                    };
                }
                
                userManager.saveUser($rootScope.actualUser);
                var alertPopup = $ionicPopup.alert({
                        title: messagesProvider.biometry.successPopUp.title,
                        template: messagesProvider.biometry.successPopUp.description
                    });
                    alertPopup.then(function (res) {
                        $state.go(self.pageToGo);
                    });
            };

            self.atras = function () {
                $state.go("registry.biometryConfigAccount");
            };

        }]);
