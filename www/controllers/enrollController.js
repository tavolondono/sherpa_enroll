/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App').controller('enrollController',
        ['$scope', '$state', '$filter', '$interval', "$ionicModal", '$ionicSlideBoxDelegate', "$timeout", "messagesProvider",
            function ($scope, $state, $filter, $interval, $ionicModal, $ionicSlideBoxDelegate, $timeout, messagesProvider) {
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

                
                $ionicModal.fromTemplateUrl('views/modal-nombre.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    self.faqsModal = modal;
                    ;
                });

                self.siguiente = function () {
                    $state.go("vinculacion-documento");
                };
                
                self.showHelp = function () {
                    self.currentCategory = 'registry.nickname';
                    self.currentCategoryData = messagesProvider.faqs['registry.nickname'];
                    $timeout(function() {
                        self.faqsModal.show();
                    }, 100);
                    
                };
                
                self.hideHelp = function () {
                    self.faqsModal.hide();
                };

            }]);
