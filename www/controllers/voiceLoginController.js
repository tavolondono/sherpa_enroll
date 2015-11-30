/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
        .controller('voiceLoginController', ['$scope', '$state', '$cordovaMedia',
            '$ionicModal', '$ionicLoading', '$interval', '$stateParams', '$rootScope',
            'userManager', 'messagesProvider', '$ionicPopup', 'utilsProvider',
            function ($scope, $state, $cordovaMedia, $ionicModal, $ionicLoading,
                    $interval, $stateParams, $rootScope, userManager, messagesProvider,
                    $ionicPopup, utilsProvider) {
                var self = this;
                self.puedeSeguir = false;


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

                self.isRecording = false;
                $ionicModal.fromTemplateUrl('views/modal-facial.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    self.faqsModal = modal;
                    ;
                });



                self.showHelp = function () {
                    self.currentCategory = 'registry.facial';
                    self.currentCategoryData = messagesProvider.faqs['registry.facial'];
                    $timeout(function () {
                        self.faqsModal.show();
                    }, 100);

                };

                self.hideHelp = function () {
                    self.faqsModal.hide();
                };

                var amt = 0;
                
                /**
                 * Tiempos de control
                 */
                self.countTo = 4;
                self.countFrom = 0;
                self.progressValue = 0;
                self.type = "info";







                self.siguiente = function () {
                    $state.go('dashboard');
                };

                self.atras = function () {
                    if (self.pageToGo == 'security') {
                        $state.go("security");
                    } else {
                        $state.go("registry.biometryConfigAccount");
                    }
                };

                //var src = "/android_asset/src/audio.mp3";
                var src = "myrecording.mp3";
                //var media = $cordovaMedia.newMedia(src);


                var mediaStatusCallback = function (status) {
                    if (status == 1) {
                        $ionicLoading.show({template: 'Loading...'});
                    } else {
                        $ionicLoading.hide();
                    }
                }

                var successCallback = function () {
                    console.log("recordAudio():Audio Success");
                };

                var errorCallback = function (error) {
                    console.log("recordAudio():Audio Error: " + error.code);
                    console.log('message: ' + error.message);
                };

                // media.getDuration(media); not working yet

                // media.getCurrentPosition().then(...); not working yet

                self.startRecord = function () {

                    var srcs = "/android_asset/src/audio.mp3";
                    var src1 = "audio1.amr";
                    var mediaRec = new Media(src1, successCallback, errorCallback);
                    mediaRec.startRecord();
                };

                self.stopRecord = function () {
                    media.stopRecord();
                };

                self.play = function (src) {
                    var media = new Media(src, null, null, mediaStatusCallback);
                    $cordovaMedia.play(media);
                };

                // Set audio position
                //
                self.setAudioPosition = function (position) {
                    document.getElementById('audio_position_voice').innerHTML = position;
                };

                var resetValues = function () {
                    self.progressValue = 0;
                    self.type = "info";
                    amt = 0;
                };
                var finishValues = function () {
                    self.progressValue = 6;
                    self.type = "success";
                    amt = 0;
                    self.isRecording = false;
                };


                var recording;
                // Record audio
                //
                self.recordAudio = function () {
                    var mediaRec = new Media(src, successCallback, errorCallback);
                    self.progressValue = 0;
                    self.isRecording = true;
                    self.puedeSeguir = false;
                    // Record audio
                    resetValues();
                    mediaRec.startRecord();

                    // Stop recording after 5 sec
                    var recTime = 0;
                    recording = $interval(function () {
                        recTime = recTime + 0.5;
                        if (recTime - Math.floor(recTime) === 0) {
                            self.setAudioPosition('Quedan ' + (self.countTo - recTime) + " segundos");
                        }
                        amt = amt + 0.5;
                        self.progressValue = amt;
                        if (recTime >= self.countTo) {
                            mediaRec.stopRecord();
                            self.type = "success";
                            finishValues();
                            $interval.cancel(recording);

                            self.isRecording = false;
                            var alertPopup = $ionicPopup.alert({
                                title: messagesProvider.biometry.facial.successLogin.title,
                                template: messagesProvider.biometry.facial.successLogin.description
                            });
                            alertPopup.then(function (res) {
                                $state.go("dashboard");
                            });
                        }
                    }, 500);
                };

                self.playRecordedAudio = function () {
                    var media = new Media(src, null, null, mediaStatusCallback);
                    $cordovaMedia.play(media);
                };

                self.siguiente = function () {
                    if (utilsProvider.validateNull($rootScope.actualUser.hasBiometry)) {
                        if ($rootScope.actualUser.hasBiometry) {
                            $rootScope.actualUser.biometry.voice = {
                                'hasVoice': true,
                                'enabled': true
                            }
                        }
                        ;
                    } else {
                        $rootScope.actualUser.hasBiometry = true;
                        $rootScope.actualUser.biometry = {
                            'facial': {
                                'hasFacial': false,
                                'enabled': false
                            },
                            'principal': 'voice',
                            'voice': {
                                'hasVoice': true,
                                'enabled': true
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
                
                $scope.$on('$ionicView.beforeEnter', function(){
                    self.setAudioPosition('Quedan ' + self.countTo + " segundos");
                });
            }]);


