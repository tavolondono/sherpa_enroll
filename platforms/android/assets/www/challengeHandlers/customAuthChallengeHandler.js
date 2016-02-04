/**
* ChallengeHandler para el manejo de la autenticación.
* @class userState
* @constructor
* @module sherpa
*/
'use strict';

angular.module('App')
    .factory('userState',
     ['$q', '$rootScope', 'invocationManager', 'configProvider','cypherProvider', 'jsonStore', 'busyIndicator', '$ionicHistory', 'detectIdProvider', 'logManager', '$state', 'errorManager',
      function($q, $rootScope, invocationManager, configProvider, cypherProvider, jsonStore, busyIndicator, $ionicHistory, detectIdProvider,logManager, $state, errorManager) {

    var realm = 'SherpaCustomAuthenticatorRealm',
    params = {},
    userObj = {
        dialog: false,
        authError: '',
        loggedIn: null
    },
    defunct = null,
    ch = {},
    ERROR_CODE='1-802',
    NO_TOKEN_ERROR_CODE='1-811';

    /**
    * Método para verificar el customResponse
    * @method isCustomResponse
    * @public
    */
    function isCustomResponse(response) {
        if (!response || !response.responseJSON) {
            return false;
        }
        /*Para ocultar el busyIndicator cuando el servidor respnde con tiemeout*/
        /*if(response.responseJSON.errorCode ==='REQUEST_TIMEOUT'){
            busyIndicator.hide();
        }*/

        if (response.responseJSON.authStatus){
            return true;
        }else{
            return false;
        }
    }

    /**
    * Método se encarga de manejar el Challenge
    * @method handleChallenge
    * @public
    */
    function handleChallenge(response) {
        var authStatus = response.responseJSON.authStatus,
        authError = response.responseJSON.errorMessage,
        errorSoftToken = response.responseJSON.AUTH_ERROR,
        errorCode = '',
        encryptedData = {
            passphrase: response.responseJSON.authKey,
            iv: response.responseJSON.iv,
            size: response.responseJSON.keySize,
            salt: response.responseJSON.salt,
            count: response.responseJSON.iterationCount
        },
        encryptedPassword,
        reqURL,
        options,
        errorSplit;

        if (authStatus === 'required') {
            if (authError) {
                errorSplit = authError.split('::');

                response.responseJSON.error = {
                    'errorId': errorSplit[0],
                    'errorMessage': errorSplit[1],
                    'attempts': errorSplit[2],
                    'timeUnblock': errorSplit[3]
                };

                onFailure(response, defunct);
                defunct.resolve(response);
                return;
            }
            reqURL = '/sherpa_custom_auth_request';
            options = {};
            options.parameters = params;

            jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                if(responseJsonStore[0].json.data.session &&
                    responseJsonStore[0].json.data.auth.state === configProvider.userStates.liteRegistry) {
                    options.parameters.username = responseJsonStore[0].json.data.auth.user;
                    options.parameters.password = responseJsonStore[0].json.data.auth.password;
                } else {
                    encryptedPassword = cypherProvider.encrypt(options.parameters.password, encryptedData);
                    options.parameters.password = encryptedPassword;
                    params.password = encryptedPassword;
                }
                options.headers = {};
                ch.submitLoginForm(reqURL, options, ch.submitLoginFormCallback);
            });

        } else if (authStatus === 'complete') {

            if (errorSoftToken) {
                response.responseJSON.error = {
                    'errorId': errorSoftToken,
                    'errorMessage': 'Error validando soft token '
                };
                if(errorSoftToken === ERROR_CODE || errorSoftToken === NO_TOKEN_ERROR_CODE){
                    jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                        if(!responseJsonStore[0].json.data.session) {
                            responseJsonStore[0].json.data.session = true;
                            responseJsonStore[0].json.data.auth.user = params.username;
                            responseJsonStore[0].json.data.auth.password = params.password;
                            jsonStore.replace(responseJsonStore).then(function() {
                                ch.submitSuccess();
                            });
                        } else {
                             ch.submitSuccess();
                        }
                    });
                    $rootScope.errorSoftToken = true;
                }else{
                    onFailure(response);
                    defunct.reject(response);
                }
            }else{
                jsonStore.find(configProvider.jsonStore.key).then(function(responseJsonStore) {
                    if(!responseJsonStore[0].json.data.session) {
                        responseJsonStore[0].json.data.session = true;
                        responseJsonStore[0].json.data.auth.user = params.username;
                        responseJsonStore[0].json.data.auth.password = params.password;
                        jsonStore.replace(responseJsonStore).then(function() {
                            ch.submitSuccess();
                        });
                    } else {
                         ch.submitSuccess();
                    }
                });
            }
        }
    }

    /**
    * Callback cuando se reciba la respuesta del server.
    * @method submitLoginFormCallback
    * @public
    */
    function submitLoginFormCallback(response) {
        var isLoginFormResponse = ch.isCustomResponse(response);
        if (isLoginFormResponse) {
            ch.handleChallenge(response);
        }
    }

    /**
    * Callback cuando se reciba la respuesta error del server en el proceso de autenticacion.
    * @method onFailure
    * @public
    */
    function onFailure(response, callback){
        var errorID = response.responseJSON && response.responseJSON.error ? response.responseJSON.error.errorId : null;

        switch(errorID) {
            case configProvider.ldapErrorsId.blockTemp:
                closeSession(false);
                break;
            case configProvider.ldapErrorsId.block:
                closeSession(true);
                break;
            default:
                return true;
        }

        if(!callback){
            busyIndicator.hide();
            errorManager.showAsyncMessage(response.responseJSON.error);
        }
    }

    /**
    * Método para hacer inicializar el challengeHandler
    * @method chConstruct
    * @private
    */
    function chConstruct(){
        ch = WL.Client.createChallengeHandler(realm);
        ch.isCustomResponse = isCustomResponse;
        ch.handleChallenge = handleChallenge;
        ch.submitLoginFormCallback = handleChallenge;
    }

    /**
     * Metodo pare cerrar session cuando
     * @method closeSession
     * @private
    */
    function closeSession(type){
        chCheckUser().then(function(data){
            if (data) {
                chLogout(true).then(function(){
                    if(type !== false){
                        $state.go('userLogin');
                    }
                });
            }else{
                chLogout(false).then(function(){
                    if(type !== false){
                        $state.go('userLogin');
                    }
                });
            }
        }, function(){
            chLogout(false).then(function(){
                $state.go('userLogin');
            });
        });
    }

    /**
    * Metodo para limpiar la data del usuario.
    * @method cleanOnlineLoginData
    * @private
    */
    function cleanOnlineLoginData(logoutDefer){
        WL.Client.logout(realm,{onSuccess: function(){
            /*ReloadServices.clearAll(); */
            userObj.loggedIn = false;
            userObj.user = {};

            $rootScope.userApp = {
                phoneNumber: null,
                email: null,
                password: null,
                state: null,
                contract: null,
                contractId: null,
                balanceAvailable: null,
                balanceFree: null,
                balanceTotal: null,
				errorSoftToken: null
            };

            $rootScope.currentTransfer = {};

            jsonStore.find(configProvider.jsonStore.key).then(function(response) {
                response[0].json.data.session = false;
                response[0].json.data.auth = {};
                response[0].json.data.loadModal = null;
                response[0].json.data.firstPay = null;
                response[0].json.data.phoneNumber = null;
                response[0].json.data.lastTranfersMoney = [];
                response[0].json.data.lastRequestMoney = [];
                response[0].json.data.lastCashout = [];
                response[0].json.data.provisioned = false;
                response[0].json.data.permission = {
                    cam: false
                };
                jsonStore.replace(response).then(function() {
                     logoutDefer.resolve();
                });
            });

            $ionicHistory.clearCache();
        }});
    }

    /**
    * Método  para saber si hay un usuario autenticado.
    * @method checkUser
    * @private
    */
    function chCheckUser(){
        var def = $q.defer();

        userObj.loggedIn = WL.Client.isUserAuthenticated(realm);

        /*check success*/
        if (!userObj.loggedIn){
            def.resolve(false);
        } else {
            def.resolve(true);
        }
        return def.promise;
    }

    /**
    * Método para hacer logout de la app.
    * @method logout
    * @private
    */
    function chLogout (invokeBusinessClose) {
        invokeBusinessClose = (typeof(invokeBusinessClose) !== undefined ) ? !!invokeBusinessClose : true;
        var logoutdef = $q.defer();
        invocationManager.checkOnline().then(function (onl){
            if (onl){
                if(invokeBusinessClose){
                    var optionData = invocationManager.getInvocationData(
                        configProvider.middlewareAdapter,
                        configProvider.procedureCloseSherpaSession,
                        null
                    );
                    invocationManager.invokeAdaptherMethod(optionData, function(){
                        cleanOnlineLoginData(logoutdef);
                    }, function (){
                        cleanOnlineLoginData(logoutdef);
                    });
                } else {
                    cleanOnlineLoginData(logoutdef);
                }

            } else {
                logoutdef.resolve();
            }
        });

        return logoutdef.promise;
    }

    /**
    * Se exponen los metodos del challengeHandler publicamente.
    */
    return {
        logoutEnroll: function () {
            var logoutDefer = $q.defer();
            jsonStore.find(configProvider.jsonStore.key).then(function(response) {
                response[0].json.data.session = false;
                response[0].json.data.auth = {};
                response[0].json.data.loadModal = null;
                response[0].json.data.firstPay = null;
                response[0].json.data.phoneNumber = null;
                response[0].json.data.lastTranfersMoney = [];
                response[0].json.data.lastRequestMoney = [];
                response[0].json.data.lastCashout = [];
                response[0].json.data.provisioned = false;
                response[0].json.data.permission = {
                    cam: false
                };

                $rootScope.userApp = {
                    phoneNumber: null,
                    email: null,
                    password: null,
                    state: null,
                    contract: null,
                    contractId: null,
                    balanceAvailable: null,
                    balanceFree: null,
                    balanceTotal: null,
                    errorSoftToken: null
                };

                $rootScope.currentTransfer = {};

                $ionicHistory.clearCache();

                jsonStore.replace(response).then(function() {
                     logoutDefer.resolve(true);
                }, function() {
                    logoutDefer.reject(false);
                });
            });
            return logoutDefer.promise;
        },

        /**
        * Método para setear los parametros
        * @method setParams
        * @public
        */
        setParams: function (loginParams) {
            params = loginParams;
        },

        /**
        * Método para obtener los datos de un usuario de sesión.
        * @method getUser
        * @public
        */
        getUser: function() {
            return userObj;
        },

        /**
        * Método para inicializar un usuario.
        * @method initUser
        * @public
        */
        initUser: function () {
            var def = $q.defer();
            invocationManager.checkOnline().then(function (onl){
                if (onl){ /*online*/
                    WL.Client.updateUserInfo({onSuccess: function(){
                        userObj.loggedIn = WL.Client.isUserAuthenticated(realm);
                        def.resolve();
                    }});
                } else { /*offline*/
                    userObj.loggedIn = false;
                    def.resolve();
                }
            });
            return def.promise;
        },
        /**
        * Método para saber si hay un usuario autenticado.
        * @method checkUser
        * @public
        */
        checkUser:  chCheckUser,

        /**
        * Método para manejar el login del usuario.
        * @method login
        * @public
        */
        login: function(options) {
            var logindef = $q.defer(),
            parameters = options.parameters;
            defunct = logindef;
            userObj.user = parameters.username;
            params.softToken ='';
            
            detectIdProvider.isDeviceProvisioned().then(function(isProvisioned){
                if ((typeof isProvisioned === 'boolean' && isProvisioned) ||
                (typeof isProvisioned === 'string' && isProvisioned === 'true')) {
                    detectIdProvider.getSoftToken().then(function(softToken){
                        params.softToken = softToken;
                        invocationManager.invokeAdaptherMethod(options, function (successResponse) {
                            WL.Client.updateUserInfo({onSuccess: function() {
                                logindef.resolve(successResponse);
                            }});

                        }, function(errorResponse) {
                            logindef.reject(errorResponse);
                        });
                        logManager.debug(softToken);
                    }, function(error){
                        logManager.error(error);
                    });
                }else{
                    invocationManager.invokeAdaptherMethod(options, function (successResponse) {
                        WL.Client.updateUserInfo({onSuccess: function() {
                            logindef.resolve(successResponse);
                        }});

                    }, function(errorResponse) {
                        logindef.reject(errorResponse);
                    });
                }
                logManager.debug(isProvisioned);
            }, function(error){
                logManager.error(error);
            });
            return logindef.promise;
        },

        /**
        * Método para hacer logout de la app.
        * @method logout
        * @public
        */
        logout: chLogout,

        /**
        * Método para hacer inicializar el challengeHandler
        * @method construct
        * @public
        */
        construct: chConstruct
    };

}]);
