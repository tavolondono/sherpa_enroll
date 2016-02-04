/**
 * Controlador para manejar la vista nicknameLiteRegistry.
 * @class nicknameController
 * @constructor
 * @module sherpa
 */
angular.module('App')
    .controller('nicknameController',
     ['$scope', '$filter', '$interval', 'userManager', '$rootScope',
      function ($scope, $filter, $interval, userManager, $rootScope) {

    var self = this;

    /**
     * Función para iterar la animación de inicio de vinculación.
     */
    self.interval = $interval(function() {
        $scope.registryController.registryModel.countView++;
        if ($scope.registryController.registryModel.countView===3) {
            $scope.registryController.showNickName();
        }
    }, 5000, 3);

    /**
     * Función para actualizar la vista del usuario y quitarle los espacios
     */
    $scope.$watch(function(scope) {
        return scope.registryController.registryModel.nickname;
    }, function(newValue) {
        $scope.registryController.registryModel.nickname = $filter('trimTex')(newValue);
    });
    
    $scope.registryController.current.state = 'registry.nickname';

    /**
     * Metodo para pasar a la siguiente pantalla.
     * @method nextScreen
     * @public
     */
    self.nextScreen = function() {        
        $rootScope.actualUser.nickname = $scope.registryController.registryModel.nickname;
        $rootScope.actualUser.email = $scope.registryController.registryModel.email;
        userManager.saveUser($rootScope.actualUser);
        $scope.registryController.goToNextPage();
    };

    $scope.$on('$ionicView.beforeLeave', function(){
        $scope.registryController.registryModel.countView = 0;
        $scope.registryController.registryModel.isShowAdvantage = false;
        $scope.registryController.registryModel.isShowNickName = true;
    });
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.registryController.registryModel.countView = 0;
        $scope.registryController.registryModel.isShowAdvantage = true;
        $scope.registryController.current.state = 'registry.nickname';
    });

}]);
