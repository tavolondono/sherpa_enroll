/**
 * Provider para centralizar el manejo de las respuestas a servicios
 * @class busyIndicator
 * @constructor
 * @module sherpa
 */
'use strict';
angular.module('App')
        .factory('responseService', ['configProvider', function (configProvider) {

                /**
                 * Objeto para exponer interface publica del provider
                 * @property self
                 * @type object
                 */
                var self = {};
                /*Implementación privada*/
                self.getResponse = function (serviceName) {
                    var ret = {};
                    switch (serviceName) {
                        case configProvider.requestDocumentValidation :
                            ret.responseJSON = {
                                "success": true,
                                "data": {
                                    "name1": "JUANITA",
                                    "name2": "MARÍA",
                                    "lastName1": "QUINTERO",
                                    "lastName2": "JARAMILLO"
                                }
                            }
                            break;
                        case configProvider.getMovementsHistoryProcedure :
                            ret.responseJSON = {
                                "success": "true",
                                "data": {
                                    'records': [{
                                            'description': 'Envio',
                                            'name': 'Juan David',
                                            'mount': '150000',
                                            'dateTime': '2015-08-13 13:00:00',
                                            'code': 't01',
                                            'status': 'complete',
                                            'trnId': 'M69',
                                            'phoneNumber': '123123',
                                            'accountNumber': '654657546',
                                            'channel': 'D',
                                            'detail': 'jfaksljdf'
                                        }, {
                                            'description': 'Envio',
                                            'name': 'Juan David',
                                            'mount': '150000',
                                            'dateTime': '2015-08-13 13:00:00',                                             
                                            'code': 't01',
                                            'status': 'complete',
                                            'trnId': 'M69',
                                            'phoneNumber': '123123',
                                            'accountNumber': '654657546',
                                            'channel': 'C',
                                            'detail': 'jfaksljdf'
                                        }],
                                    'endRecords': true
                                }
                            }
                            break;
                        default :
                            ret = {};
                            break;
                    }
                    return ret;
                };
                return self;
            }]);