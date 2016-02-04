/**
* Manager para centralizar las operaciones transaccionales (débito).
* @class transactionManager
* @constructor
* @module sherpa
*/

angular.module('App')
    .factory('transactionManager',
    ['messagesProvider', 'logManager', '$q', 'configProvider', 'invocationManager', 'utilsProvider', 'errorManager',
    function (messagesProvider, logManager, $q, configProvider, invocationManager, utilsProvider, errorManager){

    /**
    * Propiedad que almacena las constantes de los tipos de transacción
    * @property operationTypes
    * @type Object
    */
    var operationTypes = Object.freeze({
        'transfSherpaSherpa': 'TSS',
        'transfSherpaNoSherpa': 'TSN',
        'cashOut': 'CSO',
        'paymentRegistered': 'PAV',
        'paymentEnrolled': 'PAE'
    }),
    /**
    * Propiedad que almacena los métodos y objetos para ser retornados como servicio
    * @property self
    * @type Object
    */
    self = {
        getTransactionIDForOperation: getTransactionIDForOperation,
        getEnrolledTransactionIDForOperation: getEnrolledTransactionIDForOperation,
        cleanTransactionForOperation: cleanTransactionForOperation,
        shouldCleanTransactionID: shouldCleanTransactionID,
        isSuccessResponse: isSuccessResponse,
        operationTypes: operationTypes
    },
    /**
    * Propiedad que almacena los transactionID que se están usando actualemnte
    * en las operaciones. Esto nos permite hacer reintentos de llamados a operaciones
    * si se presentan errores de conexión.
    * @property currentTransactions
    * @type Object
    */
    currentTransactions = {
        'TSS': null,
        'TSN': null,
        'CSO': null,
        'PAV': null,
        'PAE': null
    };

    /**
     * Método para validar si el estado de la transacción fue exitoso
     * de acuerdo con los códigos de error.
     * @method isSuccessResponse
     * @param {Object} objeto con la descripción de la respuesta
     * @private
    */
    function isSuccessResponse(response) {
        return response.responseJSON.error.errorId === configProvider.errors.transactionID.trnIdSuccess;
    }

    /**
     * Método para validar si se debe eliminar el transactionID generado para una operación
     * de acuerdo con los códigos de error.
     * @method shouldCleanTransactionID
     * @param {Object} objeto con la descripción del error
     * @private
    */
    function shouldCleanTransactionID (error) {
        return (error.responseJSON.error.errorId !== configProvider.errors.con001.code &&
            error.responseJSON.error.errorId !== configProvider.errors.con002.code &&
            error.responseJSON.error.errorId !== configProvider.errors.con003.code &&
            error.responseJSON.error.errorId !== configProvider.errors.transactionID.trnIdInProcess);
    }

    /**
     * Método para generar un transactionID de una operación
     * @method getTransactionIDForOperation
     * @param {String} nombre de la operación para generar el transactionID
     * @private
    */
    function getTransactionIDForOperation (operation) {

        var defered = $q.defer(),
        invocationData,
        params = [],
        error;

        if (utilsProvider.validateNull(currentTransactions[operation])) {
            defered.resolve(currentTransactions[operation]);
        } else {

            params.push(operation);

            invocationData = invocationManager.getInvocationData(
                configProvider.middlewareAdapter,
                configProvider.getTransactionIDProcedure,
                params
            );

            invocationManager.invokeAdaptherMethod(invocationData, function(response){
                /*
                 * Callback exitoso de petición de transactioID
                 */
                if (response.responseJSON.success && utilsProvider.validateNull(response.responseJSON.data.trnId)) {
                    currentTransactions[operation] = response.responseJSON.data.trnId;
                    defered.resolve(response.responseJSON.data.trnId);
                } else {
                    error = errorManager.createErrorInstance(configProvider.errors.transactionID.errorGeneratingTrnID);
                    logManager.error(error);
                    defered.reject(error);
                }
            },
            function(error){
                /*
                 * Callback de error de petición de transactioID
                 */
                logManager.error(error);
                defered.reject(error);
            });
        }
        return defered.promise;
    }

    /**
     * Método para generar un transactionID de una operación
     * @method getTransactionIDForOperation
     * @param {String} nombre de la operación para generar el transactionID
     * @private
    */
    function getEnrolledTransactionIDForOperation (operation, phoneNumber) {

        var defered = $q.defer(),
        invocationData,
        params = [],
        error;

        if (utilsProvider.validateNull(currentTransactions[operation])) {
            defered.resolve(currentTransactions[operation]);
        } else {

            params.push(operation);
            params.push(phoneNumber);

            invocationData = invocationManager.getInvocationData(
                configProvider.middlewareAdapter,
                configProvider.getEnrolledTransactionIDProcedure,
                params
            );

            invocationManager.invokeAdaptherMethod(invocationData, function(response){
                /*
                 * Callback exitoso de petición de transactioID
                 */
                if (response.responseJSON.success && utilsProvider.validateNull(response.responseJSON.data.trnId)) {
                    currentTransactions[operation] = response.responseJSON.data.trnId;
                    defered.resolve(response.responseJSON.data.trnId);
                } else {
                    error = errorManager.createErrorInstance(configProvider.errors.transactionID.errorGeneratingTrnID);
                    logManager.error(error);
                    defered.reject(error);
                }
            },
            function(error){
                /*
                 * Callback de error de petición de transactioID
                 */
                logManager.error(error);
                defered.reject(error);
            });
        }
        return defered.promise;
    }

    /**
     * Método para eliminar el transactionID de una operación
     * @method cleanTransactionForOperation
     * @param {String} nombre de la operación para borrar el transactionID
     * @private
    */
    function cleanTransactionForOperation (operation) {
        currentTransactions[operation] = null;
    }

    return self;
}]);