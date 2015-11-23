/**
 * Controlador para la pantalla del home, es la pantalla inicial de la app.
 * @class homeController
 * @constructor
 * @module sherpa
 */
angular.module('App')
        .controller('homeController', ['$scope', 'messagesProvider', 'invocationManager',
            'logManager', 'hardwareBackButtonManager', '$cordovaDevice', 'userManager',
            '$rootScope', '$state', '$ionicPopup',
            function ($scope, messagesProvider, invocationManager, logManager,
                    hardwareBackButtonManager, $cordovaDevice, userManager, 
                    $rootScope, $state, $ionicPopup) {
                hardwareBackButtonManager.disable();
                
                
                var self = this;
                var init = function () {
                    console.log("initializing device");
                    try {

                        console.log("************* DECIVE INFO ***********");
                        console.log($cordovaDevice.getUUID());

                    }
                    catch (err) {
                        console.log("Error " + err.message);                       
                    }

                };

                ionic.Platform.ready(function () {
                    init();
                });
                
                self.clearData = function() {
                    // A confirm dialog
                    
                    var confirmPopup = $ionicPopup.confirm({
                        title: '¡¡Borrar datos!!',
                        template: '¿Está seguro de borrar los datos guardados?'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $rootScope.actualUser = { 'sq': 0};
                            localStorage.clear();
                        } else {
                            console.log('You are not sure');
                        }
                    });
                   
                    
                };
                
                
                self.testNequi = function() {
                    
                    if (window.localStorage.getItem(0) == null) {
                        $rootScope.actualUser = { 'sq': 0};
                        window.localStorage.setItem(0,JSON.stringify($rootScope.actualUser));
                    } else {
                        $rootScope.actualUser = userManager.getUser(0);
                    }
                    $state.go("tour");
                };
                
                
                
                
                
            }]);
