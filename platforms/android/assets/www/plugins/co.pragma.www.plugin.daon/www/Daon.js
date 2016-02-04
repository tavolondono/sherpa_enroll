cordova.define("co.pragma.www.plugin.daon.Daon", function(require, exports, module) { 

	var daon = {
		launchRegistry: function(successCallback, errorCallback, title) {
			cordova.exec(
				successCallback, // success callback function
				errorCallback, // error callback function
				'Daon', // mapped to our native Java class called "Daon"
				'launchRegistry', // with this action name
				[{                  // and this array of custom arguments to create our entry

				}]
			);
			
		},
		launchAuthentication: function(successCallback, errorCallback, title) {
			cordova.exec(
				successCallback, // success callback function
				errorCallback, // error callback function
				'Daon', // mapped to our native Java class called "Daon"
				'launchAuthentication', // with this action name
				[{                  // and this array of custom arguments to create our entry

				}]
			);
			
		}
	};
module.exports = daon;


});
