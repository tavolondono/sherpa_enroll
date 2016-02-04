/**
 * Provider para centralizar el manejo de los spin para indicar procesamiento
 * @class busyIndicator
 * @constructor
 * @module sherpa
 */
'use strict';
angular.module('App')
        .factory('busyIndicator', function ($ionicLoading) {

            /**
             * Objeto para exponer interface publica del provider
             * @property self
             * @type object
             */
            var self = {
                busyIndicator: $ionicLoading,
                show: showBusy,
                hide: hideBusy,
                setText: setBusyText
            };
            /*Implementación privada*/

            /**
             * Método privado para mostrar el indicador de procesamiento
             * @method showBusy
             * @private
             */
            function showBusy() {
                if (typeof self.busyIndicator !== 'undefined') {
                    self.busyIndicator.show({
                        template: 'Loading...'
                    });
                }
            }

            /**
             * Método privado para ocultar el indicador de procesamiento
             * @method hideBusy
             * @private
             */
            function hideBusy() {
                if (typeof self.busyIndicator !== 'undefined') {
                    self.busyIndicator.hide();
                }
            }

            /**
             * Método privado para asignar una texto al indicador de procesamiento
             * @method setBusyText
             * @param {String} text texto a mostrar
             * @private
             */
            function setBusyText(text) {
                if (typeof self.busyIndicator !== 'undefined' && !self.busyIndicator.isVisible()) {
                    $ionicLoading.show({
                        content: text
                    });
                }
            }

            return self;

        });