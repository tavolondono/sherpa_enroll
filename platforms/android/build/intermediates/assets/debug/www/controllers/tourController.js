angular.module('App')
    .controller('tourController',
     ['$state','$ionicSlideBoxDelegate', '$timeout',
      function($state, $ionicSlideBoxDelegate, $timeout) {

    var self = this;

    /**
     * Parametro de ultimo slider visto.
     * @type {Boolean}
     */
    self.lastSlider = false;

    /**
    * Metodo para ir a la siguiente pantalla del tour
    * @method next
    * @public
    */
    self.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    /**
    * Metodo para ir a la anterior pantalla del tour
    * @method previous
    * @public
    */
    self.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };
    /**
    * Metodo para ir a una pantalla determinada del tour.
    * @method pagerClick
    * @public
    */
    self.pagerClick = function(index) {
        $ionicSlideBoxDelegate.slide(index);
    };
    /**
     * Metodo verificar cuando se realice un swipeLeft a la pantalla.
     * @method swipeLeft
     * @public
    */
    self.swipeLeft = function() {
        if(self.lastSlider) {
            $state.go('registry.nickname');
        }
    };
    /**
     * Metodo para verificar cuando se ha cambiado de slide
     * @method slideHasChanged
     * @public
     * @param {int} index muestra si el slide ha cambiado
    */
    self.slideHasChanged = function(index) {
        if(index === 3) {
            $timeout(function() {
                self.lastSlider = true;
            }, 0);
        }else{
            self.lastSlider = false;
        }
    };

    self.goEnroll = function() {
        $state.go('registry.nickname');
    };

}]);
