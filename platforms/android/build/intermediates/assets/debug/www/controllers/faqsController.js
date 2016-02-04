/**
* Controlador para las FAQs
* @class faqsController
* @constructor
* @module sherpa
*/

angular.module('App')
    .controller('faqsController',
    ['$scope', 'messagesProvider', '$ionicModal', '$timeout', function($scope, messagesProvider, $ionicModal, $timeout) {

    var self = this;

    /**
    * Propiedad donde se almacenan la categoría actual seleccionada. Sirve como caché para no realizar consultas innecesarias al servicio.
    * @property currentCategory
    * @type String
    */
    self.currentCategory = '';

    /**
    * Propiedad que almacena la instancia del modal a ser presentado.
    * @property faqsModal
    * @type Object
    */
    self.faqsModal = {};

    /**
    * Propiedad para almacenar los datos de la categoria actual
    * @property currentCategoryData
    * @type Object
    */
    self.currentCategoryData = {};


    $ionicModal.fromTemplateUrl('views/faqs.html', {
       scope: $scope,
       animation: 'fade-in-scale'
    }).then(function(modal){
       self.faqsModal = modal;
    });

    /**
    * Función que se encarga de presentar el modal de las FAQs con las preguntas asociadas al contexto pasado por parámetro
    * @method showModal
    * @param category {String}
    * @public
    */
    self.showModal = function (category) {
        self.currentCategory = category;
        self.currentCategoryData = messagesProvider.faqs[category];

        $timeout(function(){
            self.faqsModal.show();
        }, 100);
    };

}]);