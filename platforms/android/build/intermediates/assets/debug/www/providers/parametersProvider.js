/**
 * Provider para centralizar la consulta de parámetros de la aplicación.
 * @class parametersProvider
 * @constructor
 * @module sherpa
 */
angular.module('App')
        .service('parametersProvider',
                ['messagesProvider', 'invocationManager', 'logManager', 'configProvider',
                    function (messagesProvider, invocationManager, logManager, configProvider) {

                        /**
                         * Propiedad para almacenar el caché de los parámetros
                         * @property paramsCache
                         * @type Object
                         */
                        var paramsCache = {};

                        /**
                         * Método privado para procesar las respuestas exitosas del llamado al procedimiento.
                         * @method getParameterSuccess
                         * @param {Object} response Objeto con la respuesta del servicio de parámetros.
                         * @param {Function} controllerCallback Función callback.
                         * @param {String} parameter Nombre del parámetro a buscar.
                         * @async
                         * @private
                         */
                        function getParameterSuccess(response, controllerCallback, parameter) {
                            paramsCache[parameter] = response.responseJSON.data;
                            if (typeof (controllerCallback) === 'function') {
                                controllerCallback(paramsCache[parameter]);
                            }
                            else {
                                logManager.log('SUCCESS');
                            }
                        }

                        /**
                         * Método privado para procesar las respuestas fallidas del llamado al procedimiento.
                         * @method getParametersFail
                         * @param {Object} error Objeto con la respuesta de error.
                         * @param {Function} controllerCallback Función callback.
                         * @async
                         * @private
                         */
                        function getParametersFail(error, controllerCallback) {
                            if (typeof (controllerCallback) === 'function') {
                                controllerCallback(null);
                            }
                            else {
                                logManager.log('ERROR');
                            }
                        }

                        /**
                         * Método para obtener los parámetros
                         * @method getParameters
                         * @public
                         */
                        this.getParameters = function (parameterType) {
                            var parametersReturn = {};
                            switch (parameterType) {
                                case messagesProvider.getDocumentTypes:
                                    parametersReturn = [
                                        {
                                            value: 'Cédula ciudadanía',
                                            code: 'CC'
                                        },
                                        {
                                            value: 'TI',
                                            code: 'TI'
                                        },
                                        {
                                            value: 'Cédula extranjería',
                                            code: 'CE'
                                        }


                                    ];
                                    break;
                                case messagesProvider.getAgeMinimum:
                                    parametersReturn = [{
                                            code: 'Edad minima',
                                            value: '18'
                                        }
                                    ];
                                    break;
                                case messagesProvider.getBiometryUsers:
                                    parametersReturn = [
                                        {
                                            code: 'Pedro102030',
                                            value: 'Pedro'
                                        },
                                        {
                                            code: 'Pablo102030',
                                            value: 'Pablo'
                                        },
                                        {
                                            code: 'Jacinto102030',
                                            value: 'Jacinto'
                                        },
                                        {
                                            code: 'Jose102030',
                                            value: 'José'
                                        }
                                    ];                                
                                    break;
                                default:
                                    parametersReturn = {
                                        
                                    };
                                break;
                                    

                            }
                            
                            return parametersReturn;

                        };

                        /**
                         * Método para llamar el servicio de los parámetros.
                         * @method getServiceParameter
                         * @param {String} parameter Nombre del parámetro a buscar.
                         * @param {Function} controllerCallback Función callback.
                         * @private
                         */
                        function getServiceParameter(parameter, controllerCallback) {
                            var invocationData,
                                    params = [];

                            params.push(parameter);

                            invocationData = invocationManager.getInvocationData(
                                    configProvider.middlewareAdapter,
                                    configProvider.getParameter,
                                    params
                                    );

                            invocationManager.invokeAdaptherMethod(
                                    invocationData,
                                    function (response) {
                                        getParameterSuccess(response, controllerCallback, parameter);
                                    }, function (error) {
                                getParametersFail(error, controllerCallback);
                            }
                            );
                        }

                    }]);