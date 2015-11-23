/**
 * Manager para centralizar la consulta de información del dispositivo
 * @class deviceManager
 * @constructor
 * @module sherpa
 */
'use strict';
angular.module('App')
        .service('deviceManager', ['$q', function ($q) {

                /**
                 * Propiedad que almacena el identificador único del dispositivo
                 * @property deviceUniqueId
                 * @type String
                 */
                var self = this,
                        deviceUniqueId;

                /**
                 * Método para obtener el identificador único del dispositivo.
                 * @method getDeviceUniqueId
                 * @public
                 */
                self.getDeviceUniqueId = function () {
                    var deferer = $q.defer();

                    if (typeof deviceUniqueId !== 'undefined') {
                        deferer.resolve(deviceUniqueId);
                    } else {
                        deferer.reject('No-device-id');
                    }
                    return deferer.promise;
                };


            }]);
