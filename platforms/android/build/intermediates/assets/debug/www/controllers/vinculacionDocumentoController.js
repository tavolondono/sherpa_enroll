/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
    .controller('vinculacionDocumentoController',['$scope', '$state', function ($scope, $state){
        var self = this;




        self.siguiente = function () {
            $state.go("vinculacion-contrato");
        };
        
        self.atras = function () {
            $state.go("home");
        };
    }]);
