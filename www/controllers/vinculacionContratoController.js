/* 
 * Copyright (c) Pragma S.A. 2015. All rights reserved. 
 * Builded for Serfinansa.
 */
angular.module('App')
    .controller('vinculacionContratoController',['$scope', '$state', function ($scope, $state){
        var self = this;




        self.siguiente = function () {
            $state.go("vinculacion-correo");
        };
        
        self.atras = function () {
            $state.go("vinculacion-documento");
        };
    }]);
