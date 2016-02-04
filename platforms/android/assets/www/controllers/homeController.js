/**
 * Controlador para la pantalla del home, es la pantalla inicial de la app.
 * @class homeController
 * @constructor
 * @module sherpa
 */
angular.module('App')
        .controller('homeController', ['$scope', 'messagesProvider', 'invocationManager',
            'logManager', 'hardwareBackButtonManager', '$cordovaDevice', 'userManager',
            '$rootScope', '$state', '$ionicPopup', '$http', 'busyIndicator',
            'parametersProvider',
            function ($scope, messagesProvider, invocationManager, logManager,
                    hardwareBackButtonManager, $cordovaDevice, userManager,
                    $rootScope, $state, $ionicPopup, $http, busyIndicator, parametersProvider) {
                hardwareBackButtonManager.disable();
                var self = this;
                
                self.users = null;
                self.selectedUser=null;
                
                
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
                self.clearData = function () {
                    // A confirm dialog

                    var confirmPopup = $ionicPopup.confirm({
                        title: '¡¡Borrar datos!!',
                        template: '¿Está seguro de borrar los datos guardados?'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            userManager.clearAll();
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };
                self.testNequi = function () {

                    if (window.localStorage.getItem(0) == null) {
                        $rootScope.actualUser = {
                            'sq': 0,
                            'biometry': {
                                'facial': {
                                    'hasFacial': false,
                                    'enabled': false
                                },
                                'principal': 'none',
                                'voice': {
                                    'hasFacial': false,
                                    'enabled': false
                                }
                            }
                        };
                        window.localStorage.setItem(0, JSON.stringify($rootScope.actualUser));
                    } else {
                        $rootScope.actualUser = userManager.getUser(0);
                    }
                    $state.go("tour");
                };
                
                self.morphoLaunchRegestry = function(){
                    Morpho.launchRegistry(
                            function(response) {
                                console.log('exito');
                                console.log(response);
                        }, 
                        function(error) { 
                            console.log(error);
                        }, 
                        {'title': 'juan'});
                        
                        
                        
                };
                
                var arrayBufferToBase64 = function ( buffer ) {
                    var binary = '';
                    var bytes = new Uint8Array( buffer );
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode( bytes[ i ] );
                    }
                    return window.btoa( binary );
                };
                
                var successRestService = function (response) {
                    console.log('respuesta 1 ');
                    console.log(response);
                    busyIndicator.hide();
                };
                
                var errorRestService = function (error) {
                    console.log('error respuesta 1 ');
                    console.log(error);
                    busyIndicator.hide();
                };
                
                var successDaonRegistry = function(response) {
                    
                    var model = $cordovaDevice.getDevice().model;
                    var uuid = $cordovaDevice.getDevice().uuid;
                    var manufacturer = $cordovaDevice.getDevice().manufacturer;

                    var obj = {
                        'profileId' : self.selectedUser.code,
                        'uuid' : uuid + '-'+ self.selectedUser.code,
                        'model' : model,
                        'manufacturer' : manufacturer,
                        'applicationIdentifier' : 'bancolombia',
                        'applicationUserIdentifier' : '333333',
                        'pin' : '1234',
                        'face' : response
                        
                    };
                    
                    var req = {
                        method: messagesProvider.webServiceType.POST,
                        url: messagesProvider.endpoints.daonServerConsumer + messagesProvider.endpoints.enrollProfileUrl,
                        headers: {'Content-Type':"text/plain"} ,
                        data: JSON.stringify(obj)
                    };
                    busyIndicator.show();
                    $http(req).then(successRestService, errorRestService);
                    
                    
                };
                var errorDaonRegistry = function(error) {
                    console.log('error');
                    console.log(error);
                };
                
                
                self.daonLaunchRegistration = function () {
                    Daon.launchRegistry(
                        successDaonRegistry, 
                        errorDaonRegistry, 
                        {'title': 'launchRegistry'}
                    );
                };
                
                
                
                var successDaonAuthentication = function(response) {
                    console.log('exito');
                    
                    var model = $cordovaDevice.getDevice().model;
                    var uuid = $cordovaDevice.getDevice().uuid;
                    var manufacturer = $cordovaDevice.getDevice().manufacturer;

                    var obj = {
                        'profileId' : self.selectedUser.code,
                        'uuid' : uuid + '-'+ self.selectedUser.code,
                        'model' : model,
                        'manufacturer' : manufacturer,
                        'applicationIdentifier' : 'bancolombia',
                        'applicationUserIdentifier' : '333333',
                        'pin' : '1234',
                        'face' : response
                        
                    };
                    
                    var req = {
                        method: messagesProvider.webServiceType.POST,
                        url: messagesProvider.endpoints.daonServerConsumer + messagesProvider.endpoints.verifyFaceUrl,
                        headers: {'Content-Type':"text/plain"} ,
                        data: JSON.stringify(obj)
                    };
                    busyIndicator.show();
                    $http(req).then(successRestService, errorRestService);
                    
                    
                };
                var errorDaonAuthentication = function(error) {
                    console.log('error');
                    console.log(error);
                };
                
                
                self.daonLaunchAuthentication = function(){
                    
                    Daon.launchAuthentication(
                        successDaonAuthentication, 
                        errorDaonAuthentication, 
                        {'title': 'juan'}
                );
                      /*  */
                     
//                        
//                        $http.get('http://172.31.12.109:10080/DanoNequi/rest/hello/verify', "")
//                            .success(function(result) {
//                                console.log('respuesta ' + result);
//                            })
//                            .error(function (data) {
//                                console.log("error: ");
//                                console.log(data);
//                            });

                  
                        
                };
                
                /**
                * Implementación de funciones de ciclo de vida de la pantalla
                * para setear las variables de la vista antes de cargar la pantalla.
                * @method $ionicView.beforeEnter
                * @async
               **/
               $scope.$on('$ionicView.beforeEnter', function(){
                   self.users = angular.copy(parametersProvider.getParameters(messagesProvider.getBiometryUsers));
               });
                
                function arrayBufferToBase64( buffer ) {
                    var binary = '';
                    var bytes = new Uint8Array( buffer );
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode( bytes[ i ] );
                    }
                    return window.btoa( binary );
                }
            }]);
