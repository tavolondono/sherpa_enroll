/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
    .controller('chooseBiometryController',['$scope', '$state', 'messagesProvider', "$ionicModal",
    function ($scope, $state, messagesProvider, $ionicModal){
        var self = this;
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

        
        $ionicModal.fromTemplateUrl('views/modal-facial.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            self.faqsModal = modal;
            ;
        });


        self.siguiente = function () {
            $state.go("registry.password");
        };
        
        self.atras = function () {
            $state.go("vinculacion-correo");
        };
        
        self.irFacial = function () {
            $state.go("vinculacion-facial");
        };
        
        self.irVoice = function () {
            $state.go("vinculacion-voice");
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
