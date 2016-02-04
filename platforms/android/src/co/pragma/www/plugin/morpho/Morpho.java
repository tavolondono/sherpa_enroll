package co.pragma.www.plugin.morpho;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;

/**
 * Mediator class between Morpho's SDK and Cordova, has actions for authentication and registration
 * with morpho implemented on de execute method
 * @author glondono
 * @since 01/12/2015
 * @see org.apache.cordova.CordovaPlugin
 */
public class Morpho extends CordovaPlugin {

    // Arbitrary value to store the user account name
    public static final String ACCOUNT_NAME_KEY = "ACCOUNT_NAME";

    private static int AUTHENTICATION_CODE = 1;
    private static int REGISTRY_CODE = 2;
    public static final String TAG = "MORPHO";

    // Methods linked in the Morpho.js file
    public static final String launchAuthentication = "launchAuthentication";
    public static final String launchRegistry = "launchRegistry";

    // Account user provided by Morpho
    public static final String userAccountName = "user03@bancolombia.com.co";

    private CallbackContext callbackContestMorpho;

    private boolean isInProgress = false;


	public Morpho() {
        // TODO Auto-generated constructor stub
    }


    /**
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return
     * @throws JSONException
     */
    @Override
    public boolean execute(String action, JSONArray args,
            CallbackContext callbackContext) throws JSONException {

        try {
            Context appCtx = cordova.getActivity().getApplicationContext();
            // When it's called by the cordova plugin the autentication action
            if (isInProgress) {
                callbackContext.error("A scan is already in progress!");
            } else {
                isInProgress = true;
                callbackContestMorpho = callbackContext;
                if (launchAuthentication.equals(action)) {
                    Intent authenticationActivity = new Intent(appCtx, AuthenticationActivity.class);
                    // It's mandatory add the user account name
                    authenticationActivity.putExtra(ACCOUNT_NAME_KEY, userAccountName);
                    cordova.startActivityForResult(this, authenticationActivity, AUTHENTICATION_CODE);
                }
                // When it's called by the cordova plugin the Registration action
                if (launchRegistry.equals(action)) {
                    Intent registryIntent = new Intent(appCtx, RegistrationActivity.class);
                    cordova.startActivityForResult(this, registryIntent, REGISTRY_CODE);
                }
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
            callbackContext.error(e.getMessage());
            return false;
        }

    }

    /**
     *
     * @param requestCode   The request code originally supplied to startActivityForResult(),
     *                      allowing you to identify who this result came from.
     * @param resultCode    The integer result code returned by the child activity through its setResult().
     * @param data
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // Check which request we're responding to
        if (requestCode == REGISTRY_CODE || requestCode == AUTHENTICATION_CODE) {
            // Make sure the request was successful
            if (resultCode == -1) {
                callbackContestMorpho.success();
            } else {
                callbackContestMorpho.error("Not registred");
            }
        }
        isInProgress = false;
        callbackContestMorpho = null;
    }
}