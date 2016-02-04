// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('App', ['ionic', 'ngAnimate', 'ngCordova', 'ui.bootstrap', 'countTo', 
    'ngToast', 'ui.utils', 'ui.utils.masks', 'ngStorage' , 'ngResource'])

        .run(["$rootScope", "$ionicPlatform", "messagesProvider", "configStyles", 
            'hardwareBackButtonManager', '$ionicHistory', "userManager", 
            function ($rootScope, $ionicPlatform, messagesProvider, configStyles, 
            hardwareBackButtonManager, $ionicHistory, userManager) {
                $ionicPlatform.ready(function () {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    if (window.cordova && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    }
                    if (window.StatusBar) {
                        StatusBar.styleDefault();
                    }
                });
                
                $rootScope.i18n = messagesProvider;
                $rootScope.configStyles = configStyles;

                $rootScope.userApp = {
                    phoneNumber: '',
                    email: '',
                    password: '',
                    state: '0',
                    contract: '',
                    contractId: '',
                    balanceAvailable: 0.00,
                    balanceFree: 0.00,
                    balanceTotal: 0.00,
                    numPockets: 0,
                    errorSoftToken: null
                };
                
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
                    },
                    'hasBiometry': false
                };
                if (window.localStorage.getItem(0) == null) {
                    window.localStorage.setItem(0,JSON.stringify($rootScope.actualUser));
                } else {
                    $rootScope.actualUser = userManager.getUser(0);
                }
                


                /*Función para controlar el boton atras nativo.*/
                $ionicPlatform.onHardwareBackButton(function () {
                    if (!hardwareBackButtonManager.isEnable && typeof hardwareBackButtonManager.goBack === 'undefined') {
                        $ionicPopup.confirm({
                            title: messagesProvider.closeApp.title,
                            template: messagesProvider.closeApp.message
                        }).then(function (res) {
                            if (res) {
                                navigator.app.exitApp();
                            }
                        });
                    } else if (hardwareBackButtonManager.isEnable && typeof hardwareBackButtonManager.goBack === 'function') {
                        hardwareBackButtonManager.goBack();
                        hardwareBackButtonManager.goBack = undefined;
                    } else if (!hardwareBackButtonManager.isEnable && hardwareBackButtonManager.goBack === null) {
                        return false;
                    } else {
                        $ionicHistory.goBack();
                        hardwareBackButtonManager.isEnable = true;
                        hardwareBackButtonManager.goBack = undefined;
                    }
                });


            }]).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
        
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common["X-Requested-With"];
            $urlRouterProvider.otherwise('home');
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'views/home.html'
                })
                .state('vinculacion-documento', {
                    url: '/vinculacion-documento',
                    templateUrl: 'views/vinculacion-documento.html'
                })
                .state('vinculacion-contrato', {
                    url: '/vinculacion-contrato',
                    templateUrl: 'views/vinculacion-contrato.html'
                })
                .state('vinculacion-correo', {
                    url: '/vinculacion-correo',
                    templateUrl: 'views/vinculacion-correo.html'
                })                
                .state('vinculacion-facial', {
                    url: '/vinculacion-facial',
                    templateUrl: 'views/vinculacion-facial.html',
                    params: {
                        toPage : 'home'
                    },
                    hideParams: 'YES'
                })
                .state('facial-help', {
                    url: '/facial-help',
                    templateUrl: 'views/facial-help.html',
                    params: {
                        toPage : 'home'
                    },
                    hideParams: 'YES'
                })
                .state('vinculacion-voice', {
                    url: '/vinculacion-voice',
                    templateUrl: 'views/vinculacion-voice.html',
                    params: {
                        toPage : 'home'
                    },
                    hideParams: 'YES'
                })
                .state('registry', {
                    url: '/registry',
                    templateUrl: 'views/registry.html'
                })
                .state('registry.nickname', {
                    url: '/nickname',
                    templateUrl: 'views/registry-nickname.html'
                })
                .state('registry.id', {
                    url: '/id',
                    templateUrl: 'views/registry-id.html'
                })
                .state('registry.email', {
                    url: '/email',
                    templateUrl: 'views/registry-email.html'
                })
                .state('registry.password', {
                    url: '/password',
                    templateUrl: 'views/registry-password.html'
                })
                .state('registry.contract', {
                    url: '/contract',
                    templateUrl: 'views/registry-contract.html'
                })
                .state('registry.biometryConfigAccount', {
                    url: '/config',
                    templateUrl: 'views/registry-biometry-config-account.html'
                })
                .state('registry.chooseBiometry', {
                    url: '/chooseBiometry',
                    templateUrl: 'views/chooseBiometry.html'
                })
                .state('tour', {
                    url: '/tour',
                    templateUrl: 'views/tour.html'
                })
                .state('enroll', {
                    url: '/enroll',
                    templateUrl: 'views/enroll.html'
                })
                .state('token', {
                    url: '/token',
                    hiddenParam: 'YES',
                    params: {
                        provisionedRegistry: false
                    },
                    templateUrl: 'views/token.html'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html'
                })
                .state('movements', {
                    url: '/movements',
                    templateUrl: 'views/movements-home.html'
                })
                .state('userLogin', {
                    url: '/userLogin', /*Se quito la url /login por problemas en el otherwise*/
                    templateUrl: 'views/login-user.html'
                })
                .state('originMoney', {
                    url: '/originMoney',
                    params: {
                       typeTransfer: null
                    },
                    templateUrl: 'views/origin-money.html'
                })
                .state('payments', {
                    url: '/payments',
                    params: {
                        transferOrigin: null,
                        pockets: []
                    },
                    templateUrl: 'views/payments-QRcode.html'
                })
                .state('payResume', {
                    url: '/payResume',
                    params: {
                        code: '',
                        transferOrigin: null,
                        pockets: []
                    },
                    templateUrl: 'views/pay-resume.html'
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: 'views/profile.html'
                })
                .state('security', {
                    url: '/security',
                    templateUrl: 'views/security.html'
                })
                .state('voice-login', {
                    url: '/voice-login',
                    templateUrl: 'views/voice-login.html'
                })


                ;
    }]);
