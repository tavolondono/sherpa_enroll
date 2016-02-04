/**
* Controlador para slider del coachmark
* @class coachmarksController
* @constructor
* @module sherpa
*/
angular.module('App')
    .controller('coachmarksController',
        ['$scope', '$ionicSlideBoxDelegate', '$timeout',
         function($scope, $ionicSlideBoxDelegate, $timeout) {

        var self = this;

        /**
        * Propiedad para decirle a la vista que se muestre o no el welcome
        * @property welcomeShow
        * @type Boolean
        */
        self.welcomeShow = true;

        /**
        * Propiedad para decirle a la vista que se muestre o no el slider
        * @property slideShow
        * @type Boolean
        */
        self.slideShow = false;

        /**
        * Propiedad para conocer si se encuentra en el ultimo slide
        * @property lastSlider
        * @type Boolean
        */
        self.lastSlider = false;

        /**
        * Metodo para verificar cuando se ha cambiado de slide
        * @method slideHasChanged
        * @public
        */
        self.slideHasChanged = function(index) {
            if(index === 2) {
                $timeout(function() {
                    self.lastSlider = true;
                }, 500);
            }else{
                self.lastSlider = false;
            }
        };

        /**
        * Metodo para cerrar el welcome e ir al coachmark
        * @method goToSlideCoachmark
        * @public
        */
        self.goToSlideCoachmark = function() {
            self.welcomeShow = false;
            self.slideShow = true;
        };

        /**
        * Metodo verificar cuando se realice un swipeLeft a la pantalla.
        * @method swipeLeft
        * @public
        */
        self.swipeLeft = function() {
            if(self.lastSlider) {
                $scope.closeCoachMarksModal();
                $ionicSlideBoxDelegate.slide(0);
                self.welcomeShow = true;
                self.slideShow = false;
            }
        };
}]);
