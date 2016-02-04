angular.module('App')
        .factory('userManager', ['$localStorage', '$rootScope',
            function ($localStorage, $rootScope) {
                var userHelper = {};

                userHelper.sq = 0;

                if (typeof window.localStorage.getItem('userSq') === undefined) {
                    window.localStorage.setItem('userSq', 0);
                } else {
                    userHelper.sq = window.localStorage.getItem('userSq');
                }

                /**
                 * 
                 * @param {type} userObj
                 * @returns {undefined}
                 */
                userHelper.addUser = function (userObj) {
                    
                    window.localStorage.setItem(userHelper.sq, JSON.stringify(userObj));
                    userHelper.sq++;
                    window.localStorage.setItem('userSq', userHelper.sq);
                };

                /**
                 * 
                 * @param {type} userKey
                 * @return {Array/Object}
                 */
                userHelper.getUser = function (userKey) {
                    return JSON.parse(window.localStorage.getItem(userKey));
                };
                
                /**
                 * 
                 * @param {type} userkey
                 * @returns {undefined}
                 */
                userHelper.removeUser = function(userkey) {
                    window.localStorage.removeItem(userkey);
                };
                
                /**
                 * 
                 * @param {type} userKey
                 * @param {type} userObj
                 * @returns {undefined}
                 */
                userHelper.saveUser = function (userObj) {
                    window.localStorage.setItem(userObj.sq, JSON.stringify(userObj));
                };
                
                /**
                 * Borra todos los datos
                 * @returns {undefined}
                 */
                userHelper.clearAll = function() {
                    $rootScope.actualUser = {
                        'sq': 0,
                        'biometry': {
                            'facial': {
                                'hasFacial': false,
                                'enabled': false
                            },
                            'principal': 'none',
                            'voice': {
                                'hasFacial': false,
                                'enabled': false
                            }
                        },
                        'hasBiometry' : false
                    };
                    window.localStorage.clear();
                }








                return userHelper;



            }]);