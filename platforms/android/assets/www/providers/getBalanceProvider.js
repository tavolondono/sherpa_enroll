/**
* Provider para
* @class getBalanceProvider
* @constructor
* @module sherpa
*/
angular.module('App')
    .service('getBalanceProvider',
    ['$rootScope', '$q', 'invocationManager', 'configProvider', 'logManager', 'jsonStore',
    function ($rootScope, $q, invocationManager, configProvider, logManager, jsonStore) {

    var self = {
        balance : getBalance,
        balanceAvailable: getBalanceAvailable,
        balanceTotal: getBalanceTotal,
        numPockets: getBalanceNumPockets
    };

    var balanceAvailable,
    balanceTotal,
    numPockets;

    /**
     * Metodo para obtener la variable balanceAvailable.
     * @method getBalanceAvailable
     * @return {String} Saldo disponible del usuario (balanceAvailable).
     */
    function getBalanceAvailable() {
        var responseGetAvailable = $q.defer();

        if (typeof balanceAvailable !== 'undefined') {
            responseGetAvailable.resolve(balanceAvailable);
        } else {
            getBalance().then(function(){
                responseGetAvailable.resolve(balanceAvailable);
            }, function(error){
                responseGetAvailable.reject(error);
            });
        }
        return responseGetAvailable.promise;
    }

    /**
     * Metodo para obtener la variable balanceTotal.
     * @method getBalanceTotal
     * @return {String} Saldo total del usuario (balanceTotal).
     */
    function getBalanceTotal() {
        var responseGetTotal = $q.defer();

        if (typeof balanceTotal !== 'undefined') {
            responseGetTotal.resolve(balanceTotal);
        } else {
            getBalance().then(function(){
                responseGetTotal.resolve(balanceTotal);
            }, function(error){
                responseGetTotal.reject(error);
            });
        }
        return responseGetTotal.promise;
    }

    /**
     * Metodo para obtener la variable numPockets.
     * @method getBalanceNumPockets
     * @return {String} Número de bolsillos del usuario (numPockets).
     */
    function getBalanceNumPockets() {
        var responseNumPockets = $q.defer();

        if (typeof numPockets !== 'undefined') {
            responseNumPockets.resolve(numPockets);
        } else {
            getBalance().then(function(){
                responseNumPockets.resolve(numPockets);
            }, function(error){
                responseNumPockets.reject(error);
            });
        }
        return responseNumPockets.promise;
    }

    /**
     * CallBack exitoso del metodo getBalance
     * @method balanceSuccess
     * @param {Object} [response] objeto con los valores del saldo del usuario.
     * @param {String} [response.spendBoundary] Saldo disponible del usuario.
     * @param {String} [response.balance] Saldo total del usuario.
     * @param {String} [response.numPockets] Numero de bolsillos del usuario.
     * @param {Object} [responseGetBalance] Promesa de la respuesta.
     * @return {Object} [data] objeto con la estructura de la respuesta, tanto exitosa como de error.
     * @private
     */
    function getBalanceSuccess(response, responseGetBalance) {
        if (response.responseJSON.success) {
            balanceAvailable = response.responseJSON.data.spendBoundary;
            balanceTotal = response.responseJSON.data.balance;
            numPockets = response.responseJSON.data.numPockets;

            responseGetBalance.resolve(response.responseJSON.data);
        } else {
            responseGetBalance.reject(response.responseJSON.error);
        }
    }

    /**
     * CallBack error del metodo getBalance
     * @method balanceFail
     * @param {Object} [error] objeto con la estructura de la respuesta de error.
     * @param {Object} [responseGetBalance] Promesa de la respuesta.
     * @private
     * @return {Object} [error] objeto con la estructura del error.
     */
    function getBalanceFail(error, responseGetBalance) {
        responseGetBalance.reject(error.responseJSON.error);
    }

    /**
     * Método para realizar el llamado al servicio que consulta el saldo disponible del usuario.
     * @method getBalance
     * @public
     * @async
     */
    function getBalance() {
        var responseGetBalance = $q.defer(),
        user = {},
        procedure = configProvider.requestBalance,
        invocationData,
        params = [];

        jsonStore.find(configProvider.jsonStore.key).then(function(resp) {
            if (typeof resp[0].json.data.auth.state !== 'undefined') {
                user.state = resp[0].json.data.auth.state;
                user.phoneNumber = resp[0].json.data.phoneNumber;

                if(user.state === configProvider.userStates.liteRegistry) {
                    procedure = configProvider.requestBalanceRegistry;
                } else {
                    params.push(String(user.phoneNumber));
                }

                invocationData = invocationManager.getInvocationData(
                    configProvider.middlewareAdapter,
                    procedure,
                    params
                );

                invocationManager.invokeAdaptherMethod(
                    invocationData,
                    function(response){
                        getBalanceSuccess(response, responseGetBalance);
                    }, function (error) {
                        getBalanceFail(error, responseGetBalance);
                    }
                );
            }
        });

        return responseGetBalance.promise;
    }

    return self;

}]);