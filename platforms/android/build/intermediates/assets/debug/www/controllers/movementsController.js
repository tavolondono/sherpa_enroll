/**
 * Controlador para el historial de movimientos.
 * @class movementsController
 * @constructor
 * @module sherpa
 */
angular.module('App')
        .controller('movementsController',
                ['$ionicModal', '$scope', '$state', 'hardwareBackButtonManager', 'messagesProvider',
                    'configProvider', 'invocationManager', 'busyIndicator', '$timeout',
                    '$ionicScrollDelegate', 'errorManager', '$filter', 'getBalanceProvider',
                    'responseService',
                    function ($ionicModal, $scope, $state, hardwareBackButtonManager, messagesProvider,
                            configProvider, invocationManager, busyIndicator, $timeout, $ionicScrollDelegate,
                            errorManager, $filter, getBalanceProvider, responseService) {

                        var self = this;

                        /**
                         * Propiedad donde se almacena el saldo actual del usuario
                         * @property balance
                         * @type Double
                         */
                        self.balance = null;

                        /**
                         * Propiedad donde se almacena el saldo disponible para el usuario.
                         * @property balanceAvailable
                         * @type Double
                         */
                        self.balanceAvailable = null;

                        /**
                         * Propiedad para almacenar los movimientos del usuario.
                         * @property movements
                         * @type Object
                         */
                        self.movements = {};

                        /**
                         * Propiedad para validar que la petición de nuevos movimientos se realice una sola vez.
                         * @property onProcessReadMoreMovements
                         * @type Object
                         */
                        self.onProcessReadMoreMovements = false;

                        /**
                         * Propiedad conocer la pagina actual de la consulta de movimientos.
                         * @property pageIndex
                         * @type Integer
                         */
                        self.pageIndex = 0;

                        /**
                         * Propiedad para almacenar si existen mas registros del historial del usuario.
                         * @property isEndRecords
                         * @type Boolean
                         */
                        self.isEndRecords = false;

                        /**
                         * Propiedad para validar que la petición de nuevos movimientos se realice una sola vez.
                         * @property onProcessReadMoreMovements
                         * @type Boolean
                         */
                        self.onProcessRefreshMovements = false;

                        /**
                         * Objeto para almacenar los detalles de un movimiento.
                         * @property movementDetail
                         * @type Object
                         */
                        self.movementDetail = {};

                        /**
                         * Propiedad para almacenar el estilo del detalle del movimiento
                         * @property styleBoxResume
                         * @type String
                         */
                        self.styleBoxResume = configProvider.movements.codes.codeDefault;

                        /**
                         * Propiedad verificar si se muestra o no la descripción de una transacción
                         * @property showDescription
                         * @type Boolean
                         */
                        self.showDescription = true;

                        /* Modal para detalles de movimiento */
                        $ionicModal.fromTemplateUrl('views/movements-detail.html', {
                            id: 'movementsDetail',
                            scope: $scope,
                            animation: 'fade-in-scale'
                        }).then(function (modal) {
                            $scope.movementsDetail = modal;
                        });

                        /**
                         * CallBack exitoso del metodo getBalance
                         * @method balanceSuccess
                         * @param {Object} [response] objeto con los valores del saldo del usuario.
                         * @private
                         */
                        function balanceSuccess(response) {
                            busyIndicator.hide();
                            $scope.$apply(function () {
                                self.balanceAvailable = response.spendBoundary;
                                self.balance = response.balance;
                            });
                        }

                        /**
                         * CallBack error del metodo getBalance
                         * @method balanceFail
                         * @param {Object} [error] objeto con la estructura de la respuesta de error.
                         * @param {String} [error.errorId] id del error.
                         * @param {String} [error.errorMessage] descripción del error.
                         * @private
                         */
                        function balanceFail(error) {
                            busyIndicator.hide();
                            errorManager.showAsyncMessage(error);
                        }

                        /**
                         * Método para solicitar el saldo del usuario.
                         * @method getBalance
                         * @public
                         */
                        self.getBalance = function () {
                            busyIndicator.show();
                            getBalanceProvider.balance().then(function (balance) {
                                balanceSuccess(balance);
                                $scope.$broadcast('scroll.refreshComplete');
                            }, function (error) {
                                balanceFail(error);
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                        };

                        /**
                         * CallBack error del metodo {{#crossLink "readMoreMovements/readMoreMovementsFail:method"}}{{/crossLink}}
                         * @method readMoreMovementsFail
                         * @param {Object} [error] objeto con la estructura de la respuesta
                         * @param {Boolean} [error.success] variable `false`
                         * @param {Object} [error.error] objeto con la descripción y el id del error
                         * @private
                         */
                        function readMoreMovementsFail(error) {
                            busyIndicator.hide();
                            self.onProcessReadMoreMovements = false;
                            errorManager.showAsyncMessage(error.responseJSON.error);
                        }

                        /**
                         * Callback de exito del metodo {{#crossLink "refreshMovements/refreshMovementsSuccess:method"}}{{/crossLink}}
                         * @method refreshMovementsSuccess
                         * @param {Object} [response] objeto con la estructura de la respuesta
                         * @param {Boolean} [response.success] variable para conocer si el proceso fue exitoso o no.
                         * @param {Object} [response.data] los datos de la respuesta.
                         * @private
                         **/
                        function readMoreMovementsSuccess(response) {
                            var keysTemp,
                                    moreMovements,
                                    moreMovementsByGroup,
                                    movementsInArray = [];

                            busyIndicator.hide();

                            if (response.responseJSON.success) {

                                keysTemp = Object.keys(self.movements);
                                keysTemp.forEach(function (v, i) {
                                    if (typeof (self.movements[v]) === 'object') {
                                        self.movements[v].forEach(function (value) {
                                            movementsInArray.push(value);
                                        });
                                    } else {
                                        movementsInArray.push(self.movements[v]);
                                    }
                                });

                                self.isEndRecords = response.responseJSON.data.endRecords === 'true';

                                /* Se verifica el tipo de movimiento y separamos la fecha y hora */
                                moreMovements = setDataMovements(response.responseJSON.data.records);

                                /* Se concatenan los arreglos de movimientos nuevos con el historial */
                                movementsInArray = movementsInArray.concat(moreMovements);

                                /* Se ordenan los registros del arreglo por fechas */
                                movementsInArray = orderMovementsByDate(movementsInArray);

                                /* Se agrupan los registros de movimientos por fecha */
                                moreMovementsByGroup = groupMovementsByDate(movementsInArray);

                                self.movements = moreMovementsByGroup;
                            }

                            $timeout(function () {
                                self.onProcessReadMoreMovements = false;
                            }, 900);
                        }

                        /*
                         * Metodo para consultar más movimientos del historial.
                         * @method readMoreMovements
                         * @param {Object} [data] objeto con los datos de los movimientos.
                         * @return {Array} arreglo con los indices del objeto que ingresó.
                         * @private
                         */
                        function readMoreMovements() {
                            var params,
                                    invocationData;

                            if (self.onProcessReadMoreMovements === false && self.isEndRecords === false) {
                                self.onProcessReadMoreMovements = true;

                                var responseDummy;

                                busyIndicator.show();

                                self.pageIndex++;

                                params = [self.pageIndex, configProvider.movements.maxPageSize];

                                invocationData = invocationManager.getInvocationData(
                                        configProvider.middlewareAdapter,
                                        configProvider.getMovementsHistoryProcedure,
                                        params
                                        );
                                invocationManager.invokeAdaptherMethod(invocationData, readMoreMovementsSuccess, readMoreMovementsFail);

                            }
                        }

                        /**
                         * Propiedad para validar que la petición de nuevos movimientos se realice una sola vez.
                         * @property onProcessReadMoreMovements
                         * @type Object
                         */
                        self.seeMovementsHistory = function () {
                            if ($ionicScrollDelegate.$getByHandle('movementsScroll').getScrollPosition().top <= -10) {
                                readMoreMovements();
                            }
                        };

                        /*
                         * Metodo para agrupar los movimientos por fecha
                         * @method groupMovementsByDate
                         * @param {Array} [movements] arreglo con los movimientos para agrupar.
                         * @return {Array} [movements] arreglo con los movimientos agrupados por fecha.
                         */
                        function groupMovementsByDate(movements) {
                            var movementsByGroup = {};

                            movements.forEach(function (v, i) {
                                /* Se verifica si ya existe un grupo para la fecha del registro */
                                if (typeof (movementsByGroup[v.date]) === 'undefined') {
                                    movementsByGroup[v.date] = [v];
                                } else {
                                    movementsByGroup[v.date].push(v);
                                }
                            });

                            return movementsByGroup;
                        }

                        /*
                         * Metodo para organizar por fechas un arreglo
                         * @method orderMovementsByDate
                         * @param {Array} [movements] arreglo con los movimientos a organizar.
                         * @return {Array} [movements] arreglo con los movimientos organizados por fechas de menor a mayor
                         */
                        function orderMovementsByDate(movements) {
                            var dateA,
                                    dateB,
                                    timeTemp;

                            movements.sort(function (a, b) {
                                if (a !== null && b !== null) {

                                    timeTemp = a.dateTime.split(/[- :]/);
                                    timeTemp = new Date(timeTemp[0], timeTemp[1] - 1, timeTemp[2], timeTemp[3], timeTemp[4], timeTemp[5]);
                                    dateA = new Date(timeTemp).getTime();

                                    timeTemp = b.dateTime.split(/[- :]/);
                                    timeTemp = new Date(timeTemp[0], timeTemp[1] - 1, timeTemp[2], timeTemp[3], timeTemp[4], timeTemp[5]);
                                    dateB = new Date(timeTemp).getTime();

                                    /*dateA = new Date(a.dateTime).getTime();
                                     dateB = new Date(b.dateTime).getTime();*/
                                    if (dateA < dateB) {
                                        return -1;
                                    } else if (dateA > dateB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                }
                            });

                            return movements;
                        }

                        /*TODO: Documentar metodo*/
                        function setDataMovements(movements) {
                            var timeTemp;

                            movements.forEach(function (v, i) {

                                /* Establecemos el estilo del globo de acuerdo al codigo de transaccion */
                                if (typeof (configProvider.movements.codes[movements[i].code]) === 'undefined') {
                                    movements[i].style = configProvider.movements.codes.codeDefault;
                                } else {
                                    movements[i].style = configProvider.movements.codes[movements[i].code];
                                }

                                /* Se homologa los codigos de las transferencias para colocar el tipo de transferencia */
                                if (typeof (configProvider.movements.nameByCode[movements[i].code]) !== 'undefined') {
                                    movements[i].typeTransfer = configProvider.movements.nameByCode[movements[i].code];
                                } else {
                                    movements[i].typeTransfer = configProvider.movements.nameByCode.codeDefault;
                                }

                                /* Se separa la fecha y la hora del movimiento */
                                movements[i].date = movements[i].dateTime.split(' ')[0];

                                timeTemp = movements[i].dateTime.split(/[- :]/);
                                timeTemp = new Date(timeTemp[0], timeTemp[1] - 1, timeTemp[2], timeTemp[3], timeTemp[4], timeTemp[5]);
                                movements[i].hour = new Date(timeTemp).getTime();
                            });

                            return movements;
                        }

                        /*
                         * Metodo para conocer las llaves del objeto
                         * @method getObjectKeys
                         * @param {Object} [data] objeto con los datos de los movimientos.
                         * @return {Array} arreglo con los indices del objeto que ingresó.
                         * @public
                         */
                        self.getObjectKeys = function (data) {
                            return Object.keys(data);
                        };

                        /**
                         * CallBack error del metodo {{#crossLink "refreshMovements/refreshMovementsFail:method"}}{{/crossLink}}
                         * @method refreshMovementsFail
                         * @param {Object} [error] objeto con la estructura de la respuesta
                         * @param {Boolean} [error.success] variable `false`
                         * @param {Object} [error.error] objeto con la descripción y el id del error
                         * @private
                         */
                        function refreshMovementsFail(error) {
                            busyIndicator.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            errorManager.showAsyncMessage(error.responseJSON.error);
                            self.onProcessRefreshMovements = false;
                        }

                        /**
                         * Callback de exito del metodo {{#crossLink "refreshMovements/refreshMovementsSuccess:method"}}{{/crossLink}}
                         * @method refreshMovementsSuccess
                         * @param {Object} [response] objeto con la estructura de la respuesta
                         * @param {Boolean} [response.success] variable para conocer si el proceso fue exitoso o no.
                         * @param {Object} [response.data] los datos de la respuesta.
                         * @private
                         **/
                        function refreshMovementsSuccess(response) {
                            var movements;
                            busyIndicator.hide();
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                            if (response.responseJSON.success) {
                                self.isEndRecords = response.responseJSON.data.endRecords === 'true';

                                /* Se ordenan los registros del arreglo por fechas */
                                movements = orderMovementsByDate(response.responseJSON.data.records);

                                /* Se verifica el tipo de movimiento y separamos la fecha y hora */
                                movements = setDataMovements(movements);

                                /* Se agrupan los registros de movimientos por fecha */
                                self.movements = groupMovementsByDate(movements);

                                $timeout(function () {
                                    $ionicScrollDelegate.$getByHandle('movementsScroll').scrollBottom();
                                }, 900);

                            } else {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                errorManager.showAsyncMessage(response.responseJSON.error);
                            }
                            self.onProcessRefreshMovements = false;
                        }

                        /**
                         * Metodo para llamar los movimientos del usuario.
                         * @method refreshMovements
                         * @public
                         **/
                        self.refreshMovements = function () {

                            var responseDummy,
                                    params,
                                    invocationData;

                            if (!self.onProcessRefreshMovements) {
                                self.onProcessRefreshMovements = true;
                                busyIndicator.show();

                                self.pageIndex = 0;
                                params = [self.pageIndex, configProvider.movements.maxPageSize];

                                invocationData = invocationManager.getInvocationData(
                                        configProvider.middlewareAdapter,
                                        configProvider.getMovementsHistoryProcedure,
                                        params
                                        );
                                refreshMovementsSuccess(responseService.getResponse(configProvider.getMovementsHistoryProcedure));


                                //invocationManager.invokeAdaptherMethod(invocationData, refreshMovementsSuccess, refreshMovementsFail);
                            } else {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        };

                        /**
                         * Metodo para cerrar el detalle de un movimiento
                         * @method closeMovementDetail
                         * @public
                         **/
                        self.closeMovementDetail = function () {
                            $scope.movementsDetail.hide();
                            self.movementsDetail = {};
                        };

                        /**
                         * Metodo para obtener el detalle de un movimiento.
                         * @method getMovementsDetail
                         * @public
                         **/
                        self.getMovementsDetail = function (groupValue, indexValue) {
                            var movementsGroup = self.movements,
                                    dateTemp,
                                    keysTemp;

                            self.movementDetail = movementsGroup[groupValue][indexValue];

                            dateTemp = new Date(groupValue + 'T05:00:00');
                            self.movementDetail.phoneNumber = self.movementDetail.phoneNumber;
                            self.movementDetail.titleButton = configProvider.movements.titleButtonDefault;

                            if (typeof (configProvider.movements.codes[self.movementDetail.code]) !== 'undefined') {
                                self.styleBoxResume = configProvider.movements.codes[self.movementDetail.code];
                            } else {
                                self.styleBoxResume = configProvider.movements.codes.codeDefault;
                            }


                            self.movementDetail.dateDetail = configProvider.months[dateTemp.getMonth()] + ' ' + dateTemp.getDate() + ' - ' + dateTemp.getFullYear() + ' | ' + $filter('date')(new Date(groupValue + 'T05:00:00'), 'h:mma');

                            if (self.movementDetail.description !== '') {
                                self.showDescription = true;
                            } else {
                                self.showDescription = false;
                            }

                            if (self.movementDetail.code === configProvider.movements.send ||
                                    self.movementDetail.code === configProvider.movements.sendRequest) {
                                self.movementDetail.titleButton = messagesProvider.movements.detail.labelRepeatMovement + ' ' + configProvider.movements.titleButtonSend.toLowerCase();

                            } else if (self.movementDetail.code === configProvider.movements.request) {
                                self.movementDetail.titleButton = messagesProvider.movements.detail.labelRepeatMovement + ' ' + configProvider.movements.titleButtonRequest.toLowerCase();
                            } else if (self.movementDetail.code === configProvider.movements.pay) {
                                self.movementDetail.titleButton = configProvider.movements.titleButtonPay;
                            } else {
                                self.movementDetail.titleButton = messagesProvider.movements.detail.labelRepeatMovement + ' ' + configProvider.movements.titleButtonDefault;
                            }

                            $scope.movementsDetail.show();

                        };

                        /**
                         * Implementación de funciones de ciclo de vida de la pantalla
                         * para setear las variables de la vista antes de cargar la pantalla.
                         * @method $ionicView.beforeEnter
                         * @async
                         **/
                        $scope.$on('$ionicView.beforeEnter', function () {
                            self.refreshMovements();
                            getBalanceProvider.balanceAvailable().then(function (balanceAvailable) {
                                self.balanceAvailable = balanceAvailable;

                                getBalanceProvider.balanceTotal().then(function (balanceTotal) {
                                    self.balance = balanceTotal;
                                });
                            });


                            /* Deshabilitar el botón goBack nativo */
                            hardwareBackButtonManager.disable();
                        });

                    }]);
