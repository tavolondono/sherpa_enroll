package co.pragma.www.plugin.daon;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.util.Base64;
import android.util.Log;

import com.daon.identityx.api.IXTransaction;
import com.daon.identityx.api.script.IXFactor;
import com.daon.sdk.face.Image;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import co.pragma.www.webservice.Asynchtask;
import co.pragma.www.webservice.WebService;

/**
 * Mediator class between daon's SDK and Cordova, has actions for authentication and registration
 * with daon implemented on de execute method
 * @author glondono
 * @since 01/12/2015
 * @see CordovaPlugin
 */
public class Daon extends CordovaPlugin {

    // Arbitrary value to store the user account name
    public static final String ACCOUNT_NAME_KEY = "ACCOUNT_NAME";

    private static int AUTHENTICATION_CODE = 1;
    private static int REGISTRY_CODE = 2;
    public static final String TAG = "daon";

    // Methods linked in the daon.js file
    public static final String launchAuthentication = "launchAuthentication";
    public static final String launchRegistry = "launchRegistry";

    // Account user provided by daon
    public static final String userAccountName = "user03@bancolombia.com.co";

    private CallbackContext callbackContestdaon;

    private boolean isInProgress = false;

    private Context appCtx;


	public Daon() {
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
        callbackContestdaon = callbackContext;
        try {
            appCtx = cordova.getActivity().getApplicationContext();
            if (launchAuthentication.equals(action)) {
                Intent authenticationActivity = new Intent(appCtx, BlinkActivity.class);
                authenticationActivity.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                // It's mandatory add the user account name
                authenticationActivity.putExtra(ACCOUNT_NAME_KEY, userAccountName);
                cordova.startActivityForResult(this, authenticationActivity, AUTHENTICATION_CODE);
                return true;
            }
            // When it's called by the cordova plugin the Registration action
            if (launchRegistry.equals(action)) {
                Intent registryIntent = new Intent(appCtx, MainActivity.class);
                registryIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

                callbackContestdaon = callbackContext;
                cordova.startActivityForResult(this, registryIntent, REGISTRY_CODE);
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
        if (data != null) {
            if (requestCode == AUTHENTICATION_CODE) {
                // Make sure the request was successful
                //String response = data.getStringExtra("img");
                Log.i(TAG, "Respuesta Autenticacion");
                //Log.i(TAG, response);
                Bitmap picture = Image.yuvToJpg(data.getByteArrayExtra("img"), 640, 480, 90); // data variable here is byte[]
                //picture = Image.resizeAndRotate(picture, 320, 240, 270, false);

                callbackContestdaon.success(BitMapToString(picture));

            }

            if (requestCode == REGISTRY_CODE) {
                // Make sure the request was successful
                //String response = data.getStringExtra("img");
                Log.i(TAG, "Respuesta de registro");
                //Log.i(TAG, response);

                Bitmap picture = Image.yuvToJpg(data.getByteArrayExtra("img"), 640, 480, 90); // data variable here is byte[]
                picture = Image.resizeAndRotate(picture, 320, 240, 270, false);

                callbackContestdaon.success(BitMapToString(picture));
            }

        } else {
            callbackContestdaon.error("error en SDK");
        }


    }

    public String BitMapToString(Bitmap bitmap){
        ByteArrayOutputStream baos=new  ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG,100, baos);
        byte [] b=baos.toByteArray();
        String temp= Base64.encodeToString(b, Base64.DEFAULT);
        return temp;
    }

    public void userEnrollment() {
        // Create a key pair named "my-device-keys"
        IXFactor factor;
        //factor.

    }
}