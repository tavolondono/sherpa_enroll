cordova.define("co.pragma.www.plugin.morpho.Morpho", function(require, exports, module) { var morpho = {
    getRegard: function(successCallback, errorCallback, title) {
        cordova.exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'Morpho', // mapped to our native Java class called "Morpho"
            'getRegard', // with this action name
            [{                  // and this array of custom arguments to create our entry
                "title": title
            }]
        ); 
    },
	launchAuthentication: function(successCallback, errorCallback, title) {
        cordova.exec(
            successCallback, // success callback function
            errorCallback, // error callback function
            'Morpho', // mapped to our native Java class called "Morpho"
            'launchAuthentication', // with this action name
            [{                  // and this array of custom arguments to create our entry
                "title": title
            }]
        ); 
    },
	launchRegistry: function(successCallback, errorCallback, title) {
	  cordova.exec(
		  successCallback, // success callback function
		  errorCallback, // error callback function
		  'Morpho', // mapped to our native Java class called "Morpho"
		  'launchRegistry', // with this action name
		  [{                  // and this array of custom arguments to create our entry

		  }]
	  );
	}
};
module.exports = morpho;
});
