/**
* Provider para el manejo de cifrado de password.
* @author: ricardo.caicedo
* @date: 28.07.2015
*/
angular.module('App')
	.factory('cypherProvider',
    ['$q','messagesProvider', 'configProvider', 'logManager', 'invocationManager',
    function($q, messagesProvider, configProvider, logManager, invocationManager) {

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
    	encrypt: encrypt,
    	encryptPassword: encryptPassword,
    	getSeed: getSeed
    };

    /**
    * Método para obtener la semilla para el cifrado.
    * @method getSeed
    * @return {Object} response la promesa con un objeto con datos de la semilla (data) y si el
    * proceso fue exitoso (success).
    * @private
    */
    function getSeed() {
		var invocationData,
		responseData = {},
		responseGetSeed =  $q.defer();

		invocationData = invocationManager.getInvocationData(configProvider.middlewareAdapter, configProvider.getSeed);
		invocationManager.invokeAdaptherMethod(
		invocationData,
			function(response){
				responseData.success = response.responseJSON.success;
				responseData.data = response.responseJSON.data;
				responseData.error = response.responseJSON.error;
				responseGetSeed.resolve(responseData);
			},function(error){
				responseGetSeed.reject(error);
				logManager.error('ERROR  get seed');
			});
		return responseGetSeed.promise;
    }

   /**
    * Método para cifrar el password del usuario.
    * @method encrypt
    * @param {String} plainText password que se va a encriptar.
    * @param {Object} encryptedDataValue valores que se usaran para encriptar.
    * @private
    */
    function encrypt(plainText, encryptedDataValue) {
        var iv = encryptedDataValue.iv,
        salt = encryptedDataValue.salt,
        keySize = encryptedDataValue.size,
        iterationCount = encryptedDataValue.count,
        passPhrase = encryptedDataValue.passphrase,
        aesUtil = new AesUtil(keySize, iterationCount),
        encryptValue = aesUtil.encrypt(salt, iv, passPhrase, plainText);

        return encryptValue;
    }

   /**
    * Método para consultar la semilla y encriptar la contraseña.
    * @method encryptPassword
    * @param {String} plainText password que se va a encriptar.
    * @private
    */
    function encryptPassword(plainText) {
		var responseDataEncryptPassword = {},
		responseEncryptPassword = $q.defer();

		getSeed().then(function(responseGetSeed) {
			responseDataEncryptPassword.success = responseGetSeed.success;
			if(responseGetSeed.success) {
				responseDataEncryptPassword.password = encrypt(plainText, responseGetSeed.data);
				responseEncryptPassword.resolve(responseDataEncryptPassword);
			} else {
				responseDataEncryptPassword.errorMessage = messagesProvider.generalActions.errorOnFailure;
				responseEncryptPassword.reject(responseDataEncryptPassword);
			}
			}, function(error){
				responseDataEncryptPassword = error;
				responseDataEncryptPassword.success = false;
				responseEncryptPassword.reject(responseDataEncryptPassword);
				logManager.error('ERROR  encrypt password');
		});

		return responseEncryptPassword.promise;
    }
    return self;
}]);
