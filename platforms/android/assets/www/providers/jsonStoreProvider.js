/**
* Provider para administrar el jsonStore de mobileFirst
* @class jsonStore
* @constructor
* @module sherpa
*/
angular.module('App')
    .factory('jsonStore',
    ['$q', 'logManager', 'configProvider', '$localStorage',
    function($q, logManager, configProvider, $localStorage) {

    /**
     * Objeto para exponer interface publica del provider
     * @property self
     * @type object
     */
    var self = {
        jsonStore : init,
        add: add,
        replace: replace,
        find: find,
        findById: findById,
        findAll: findAll,
        destroy: destroy
    };

    /**
     * El nombre de la coleccion que se esta usando en la app
     * @property collectionName
     * @type String
     */
    self.collectionName = configProvider.jsonStore.collection;

    /**
     * Metodo para buscar mediante una llave en la app.
     * @method find
     * @private
     * @param {Object} [keyValue] llave a buscar.
     * @return {Object} arrayResults que tiene el resultado de la busqueda.
     * @async
     */
    function find(keyValue) {
        var query = {app: keyValue},
            options = {exact: true},
            initDef = $q.defer();

        WL.JSONStore.get(self.collectionName).find(query, options)
        .then(function (arrayResults) {
            logManager.debug('JsonStore: Find Success');
            initDef.resolve(arrayResults);
        })
        .fail(function (errorObject) {
            logManager.debug(errorObject.msg);
            initDef.reject(false);
        });
        return initDef.promise;
    }
    

    /**
     * Metodo para obtener el objetos guardados en el jsonStore.
     * @method findById
     * @param {Number} Id del objeto a obtener, por defecto 1.
     * @private
     * @return {Array} Array con el objeto donde esta guardada la información.
     * @async
     */
    function findById (idValue){
        var id = parseInt(idValue, 10) || 1,
        obj = {},
        findDef = $q.defer();

        try {
            WL.JSONStore.get(self.collectionName).findById(id)
            .then(function (res) {
                obj = res;
                findDef.resolve(obj);
                logManager.debug(obj);
            })
            .fail(function (errorObject) {
                logManager.debug(errorObject.msg);
            });

        } catch (e) {
            logManager.debug(e);
        }

        return findDef.promise;
    }

    /**
     * Metodo para obtener todos los objetos guardados en el jsonStore.
     * @method findAll
     * @private
     * @return {Array} Array de objetos con toda la información guardada.
     * @async
     */
    function findAll() {
        var options = {
            limit: '',
            offset: ''
        },
        obj={},
        findDef = $q.defer();
        try {
            WL.JSONStore.get(self.collectionName).findAll(options)
            .then(function (res) {
                obj = res;
                findDef.resolve(obj);
            })
            .fail(function (errorObject) {
                logManager.debug(errorObject.msg);
            });
        } catch (e) {
            logManager.debug(e);
        }
        return findDef.promise;
    }

    /**
     * Metodo para remover la colección de objetos en el jsonStore, este metodo cierra el jsonStore.
     * @method removeCollection
     * @private
     * @return {Boolean} ´true´ cuando se remueve correctamente el jsonStore.
     * @async
     */
    function removeCollection() {
        var removeDef = $q.defer();
        try {

            WL.JSONStore.get(self.collectionName).removeCollection()
            .then(function () {
                removeDef.resolve(true);
                logManager.debug('JsonStore: Remove Collection');
                /*Llamar a inicializar jsonSotorage*/
            })
            .fail(function (errorObject) {
                logManager.debug(errorObject.msg);
            });

        } catch (e) {
            logManager.debug(e);
        }
        return removeDef.promise;
    }

    /**
     * Metodo para remplazar el valor del número de celular agregado a la app.
     * @method replace
     * @param {Number} [id] key del objeto a modificar.
     * @param {String} [phoneNumber] Nuevo número celular.
     * @private
     * @async
     */
    function replace(doc){
        var initDef = $q.defer();
        try {
            WL.JSONStore.get(self.collectionName).replace(doc)
            .then(function () {
                logManager.debug('JsonStore: Replace Data');
                initDef.resolve(true);
            })
            .fail(function (errorObject) {
                initDef.reject(false);
                logManager.debug(errorObject.msg);
            });
        } catch (e) {
            logManager.debug(e);
        }
        return initDef.promise;
    }

    /**
     * Metodo para agregar el número del celular al jsonStore, en
     * este metodo se remueve la información y se inicializa de nuevo el jsonStora,
     * se debe eliminar para garantizar que solo hay una cuenta aprovicionada.
     * @method add
     * @param {String} [phoneNumber] Número celular para aprovicionar.
     * @private
     * @async
     */
    function add(dataValue) {
        var data = dataValue,
            initDef = $q.defer();
        try {
            /*Call add on the JSONStore collection*/
            WL.JSONStore.get(self.collectionName).add(data)
            .then(function () {
                logManager.debug('JsonStore: Add');
                initDef.resolve(true);
            })
            .fail(function (errorObject) {
                logManager.debug(errorObject.msg);
            });
        } catch (e) {
            logManager.debug(e);
        }

        return initDef.promise;
    }

    /**
     * Metodo que elimina el jsonStore y borra toda la información almacenada, este metodo es asincrono.
     * @method destroy
     * @private
     * @async
     */
    function destroy() {
        WL.JSONStore.destroy()
        .then(function () {
           logManager.debug('JsonStore: Destroy');
        })
        .fail(function (errorObject) {
            logManager.debug(errorObject.msg);
        });
    }

    /**
     * Metodo que inicia el jsonStore, este metodo es asincrono.
     * @method init
     * @private
     * @return {Boolean} ´true´ cuando el jsonStore se inicializo correctamente.
     * @async
     */
    function init () {
        /*JSONStore collections metadata*/
        var collections = {},
            options = {},
            initDef = $q.defer();
        options.username = configProvider.storage.username;
        options.password = configProvider.storage.password;

        /*Define the 'App' collection and list the search fields*/
        collections[self.collectionName] = {
            searchFields : {app: 'string'}
        };

        /*Define the 'keyvalue' collection and use additional search fields*/
        collections['keyvalue'] = {
            searchFields : {},
            additionalSearchFields : { key: 'string' }
        };
        /*Initialize the collection*/
        WL.JSONStore.init(collections, options)
        .then(function () {
            logManager.debug('JsonStore: Init');
            initDef.resolve(true);
        })
        .fail(function (errorObject) {
            logManager.debug(errorObject.msg);
            initDef.reject(false);
        });
        return initDef.promise;
    }

    return self;

}]);