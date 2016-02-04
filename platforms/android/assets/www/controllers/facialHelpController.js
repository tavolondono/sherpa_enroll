/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
        .controller('facialHelpController', ['$scope', '$state', 'Camera', 
        'messagesProvider', '$ionicModal', '$timeout', '$rootScope', 
        'userManager', '$ionicPopup', '$stateParams',
        function ($scope, $state, Camera, messagesProvider, $ionicModal, $timeout,
        $rootScope, userManager, $ionicPopup, $stateParams) {
            
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
            $ionicModal.fromTemplateUrl('views/modal-facial-help.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                self.faqsModal = modal;
                ;
            });
            
           
            self.siguiente = function () {
                $state.go("vinculacion-facial", {toPage : self.pageToGo});
            };

            self.atras = function () {
                $state.go(self.pageToGo);
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

        }]);
