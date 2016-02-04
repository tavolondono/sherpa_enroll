package co.pragma.www.plugin.morpho;


import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;


import com.ionicframework.sherpaenroll532309.R;

import morpho.etis.android.sdk.ui.common.IDATA_PARAMETERS;

/**
 * The registration activity
 */
public class RegistrationActivity extends BaseActivity {

    public static final String ACCOUNT_NAME_KEY = "ACCOUNT_NAME";
    private static final String TAG = RegistrationActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // This layout has single fragment tasked with the account management
        setContentView(R.layout.layout_init_client_activity);

        Bundle dataRequest = new Bundle();
        String accountType = getString(R.string.pref_default_account_type);

        dataRequest.putString(IDATA_PARAMETERS.PARAM_ACCOUNT_TYPE, accountType);

        /* This method that will ultimately allow the creation of an account. The callbacks are:
         *      protected void onNetworkError(Bundle aData)
         *      protected void onOperationCanceled(Bundle aData)
         *      protected void onAccountCreationSuccess(Bundle aData)
         *      protected void onAccountCreationFailure(Bundle aData)
         */
        requestAddNewAccount(dataRequest);
    }

    @Override
    protected void onAuthenticationSuccess(Bundle bundle) {
        // Should not be called during a registration
    }

    // Invoked when the Authentication fails
    @Override
    protected void onAuthenticationFailure(Bundle aData) {
        // Should not be called during a registration
    }

    // Account callback creation
    @Override
    protected void onAccountCreationSuccess(Bundle aData) {
        Log.i(TAG, "Registration Success");

        // Save the user account name (extracted from the QR code and named personExternalId in the SDK)
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        Editor edit = prefs.edit();
        edit.putString(ACCOUNT_NAME_KEY, aData.getString(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID));
        edit.commit();

        // Send back the infos to calling activity
        Intent intentRequest = new Intent();
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID, aData.getString(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID));
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_TOKEN, aData.getString(IDATA_PARAMETERS.PARAM_TOKEN));
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_MEAN_OF_AUTHENTICATION_ENUM, aData.getSerializable(IDATA_PARAMETERS.PARAM_MEAN_OF_AUTHENTICATION_ENUM));
        setResult(RESULT_OK, intentRequest);
        finish();
    }

    @Override
    protected void onAccountCreationFailure(Bundle aData) {
        Log.e(TAG, "Registration Failure");
        Intent intentResponse = bundleErrorParser(aData);
        setResult(RESULT_CANCELED, intentResponse);
        finish();
    }

}
