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
        
        $scope.registryController.current.state = 'registry.chooseBiometry';
        
        $ionicModal.fromTemplateUrl('views/modal-choose-biometry.html', {
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
            $state.go("facial-help", {toPage : 'home'});
            self.requestCamPermission.hide();
        };
        self.showPermission = function () {
            self.requestCamPermission.show();            
        };
        
        self.irVoice = function () {
            $state.go("vinculacion-voice");
        };
        
        /**
        * Se declara el modal para solicitar permisos de la camara
        */
        $ionicModal.fromTemplateUrl('views/modal-camera-permission.html', {
            id: 'requestCamPermission',
            scope: $scope,
            animation: 'fade-in-scale'
        }).then(function(modal) {
            self.requestCamPermission = modal;
        });

        
        self.showHelp = function () {
                    $scope.registryController.current.state = 'registry.chooseBiometry';
                    self.currentCategoryData = messagesProvider.faqs['registry.chooseBiometry'];
                    $timeout(function() {
                        self.faqsModal.show();
                    }, 100);
                    
                };
                
        self.hideHelp = function () {
            self.faqsModal.hide();
        };
        
        self.hidePermisson = function () {
            self.requestCamPermission.hide();
        };
        
    }]);
