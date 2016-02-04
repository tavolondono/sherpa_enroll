/**
* Controlador de la pantalla del paso 2 del registro liviano
* @class documentsValidationController
* @constructor
* @uses liteRegistryController
* @module sherpa
**/
angular.module('App')
    .controller('documentsValidationController',
    ['$scope', '$filter', 'messagesProvider', 'parametersProvider', 
        'invocationManager', 'logManager', 'busyIndicator', 'errorManager', 
        'configProvider', 'responseService', 'userManager', '$rootScope',
    function ($scope, $filter, messagesProvider, parametersProvider, 
    invocationManager, logManager, busyIndicator, errorManager, 
    configProvider, responseService, userManager, $rootScope) {

    var self = this;

    /**
     * Propiedad donde se almacenan los tipos de documentos de la app, la petición del servicio se ejecuta
     * inmediatemente de llama el controlador
     * @property documentTypes
     * @type Array
     */
     self.documentTypes =  $scope.documentTypes != null ? $scope.documentTypes : null;

     /**
      * Propiedad donde se almacena la edad menor de la app
      * @property ageMinimum
      * @type Int
      */
     self.ageMinimum = $scope.ageMinimum != null ? $scope.ageMinimum : null;

    /**
     * Función para actualizar la vista del usuario y quitarle los espacios
     */
    $scope.$watch(function(scope) {
        return scope.registryController.registryModel.documentNumber;
    }, function(newValue) {
        $scope.registryController.registryModel.documentNumber = $filter('trimTex')(newValue);
    });

    $scope.$watch(function(scope) {
        return scope.registryController.registryModel.birthDate;
    }, function(newValue) {
        if (newValue) {
            $scope.registryController.registryModel.birthDateString = $filter('date')(
                new Date($scope.registryController.registryModel.birthDate),
                'dd/MMM/yyyy'
            );
        }else{
            $scope.registryController.registryModel.birthDateString = 'dd/mm/aaaa';
        }
    });

    $scope.$watch(function(scope) {
        return scope.registryController.registryModel.expeditionDate;
    }, function(newValue) {
        if (newValue) {
            $scope.registryController.registryModel.expeditionDateString = $filter('date')(
                new Date($scope.registryController.registryModel.expeditionDate),
                'dd/MMM/yyyy'
            );
        }else{
            $scope.registryController.registryModel.expeditionDateString = 'dd/mm/aaaa';
        }
    });

    if(self.documentTypes == null){
        
        self.documentTypes = angular.copy(parametersProvider.getParameters(messagesProvider.getDocumentTypes));
        
    }else{
        setSelection();
    }

    if(self.ageMinimum == null){
        var edades = parametersProvider.getParameters(messagesProvider.getAgeMinimum);
        self.ageMinimum = angular.copy(edades[0].value);
    } else {
        logManager.error('Error en la carga de datos "edad mínima"');
    }

    function setSelection(){
        angular.forEach(self.documentTypes, function(value, key) {
            if($scope.registryController.registryModel.documentType !== null &&
                $scope.registryController.registryModel.documentType !== undefined){
                if($scope.registryController.registryModel.documentType.code === self.documentTypes[key].code){
                    $scope.registryController.registryModel.documentType = self.documentTypes[key];

                }
            } else {
                $scope.registryController.registryModel.documentType = self.documentTypes[0];

            }
        });
    }

    /**
     * Metodo para realizar el llamado al servicio para las validaciones de los datos del usuario
     * @method ageCalculator
     * @private
    */
    function ageCalculator(fecha) {
        var fechaActual = new Date(),
        diaActual = parseInt(fechaActual.getDate()),
        mmActual = parseInt(fechaActual.getMonth() + 1),
        yyyyActual = parseInt(fechaActual.getFullYear()),
        FechaNac = fecha.split('/'),
        diaCumple = '',
        mmCumple = '',
        yyyyCumple = '',
        edad = 0;

        diaCumple = parseInt(FechaNac[0]);
        mmCumple = parseInt(FechaNac[1]);
        yyyyCumple = parseInt(FechaNac[2]);

        edad = yyyyActual - yyyyCumple;

        if ((mmActual < mmCumple) || (mmActual === mmCumple && diaActual < diaCumple)) {
            edad--;
        }
        return edad;
    }

    /**
     * CallBack exitoso del metodo `documentValidation`
     * @method documentValidationSuccess
     * @private
     * @async
     * @param {Object} [response] objeto con la estructura de la respuesta
     * @param {Boolean} [response.success] variable `false`
     * @param {Object} [response.error] objeto con la descripción y el id del error
     * @return Object Json con el resultado de la validación
    */
    function documentValidationSuccess(response) {
            busyIndicator.hide();
            $scope.registryController.registryModel.firstName = response.responseJSON.data.name1;
            $scope.registryController.registryModel.firstName2 = response.responseJSON.data.name2;
            $scope.registryController.registryModel.lastName = response.responseJSON.data.lastName1;
            $scope.registryController.registryModel.lastName2 = response.responseJSON.data.lastName2;
            $rootScope.actualUser.birthDate = $scope.registryController.registryModel.birthDate;
            $rootScope.actualUser.documentType = $scope.registryController.registryModel.documentType.code;
            $rootScope.actualUser.documentNumber = $scope.registryController.registryModel.documentNumber;
            $rootScope.actualUser.expeditionDate = $scope.registryController.registryModel.expeditionDate;
            userManager.saveUser($rootScope.actualUser);
            
            $scope.registryController.goToNextPage();
    }

    /**
     * CallBack error del metodo `documentValidation`
     * @method documentValidationFail
     * @private
     * @async
     * @param {Object} [error] objeto con la estructura de la respuesta
     * @param {Boolean} [error.success] variable `true`
     * @param {Object} [error.error] objeto con la descripción y el id del error
     * @return Object Json con datos del error
    */
    function documentValidationFail(error) {
        busyIndicator.hide();
        errorManager.showAsyncMessage(error.responseJSON.error);
    }

    /**
     * Metodo para realizar el llamado al servicio para las validaciones de los datos del usuario
     * @method documentValidation
     * @public
    */
    self.documentValidation = function() {

        var params,
            invocationData,
            edad,
            error,
            formatDateValidation = messagesProvider.liteRegistry.id.formatDateValidation;

        error = {'state':false, 'msg': ''};

        busyIndicator.show();

        /*validar los campos*/

        try {

            if ($scope.registryController.registryModel.documentType.code ==='TI') {

                edad = ageCalculator($filter('date')($scope.registryController.registryModel.birthDate, 'dd/MM/yyyy'));

                if (edad < self.ageMinimum) {
                    error.state = true;
                    error.msg = 'menor de ' + self.ageMinimum;
                }
            }else{
                $scope.registryController.registryModel.birthDate = null;
            }

            params = [
                $scope.registryController.registryModel.phoneNumber,
                $scope.registryController.registryModel.documentType.code,
                $scope.registryController.registryModel.documentNumber,
                $filter('date')($scope.registryController.registryModel.expeditionDate, formatDateValidation),
                $filter('date')($scope.registryController.registryModel.birthDate, formatDateValidation)
            ];
        }catch(err) {
            logManager.log(err);
            error.state = true;
            error.msg = 'No se puede realizar la acción';
        }

        busyIndicator.hide();
        if (error.state) {
            errorManager.showMessage(error.msg);
        } else{
            
            /*Todo: guardar datos */
            busyIndicator.show();
            
            var consultaCifin = responseService.getResponse(configProvider.requestDocumentValidation);
            
            documentValidationSuccess(consultaCifin);
            
        }
    };

    /**
     * Metodo para controlar la salida del wizard
     * @method cancel
     * @public
    */
    self.cancel = function() {
        $scope.registryController.cancelProcess();
    };
}]);
