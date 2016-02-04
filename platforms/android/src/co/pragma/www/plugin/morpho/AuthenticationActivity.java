package co.pragma.www.plugin.morpho;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.ionicframework.sherpaenroll532309.R;

import morpho.etis.android.sdk.account.IAccount_Data;
//import morpho.etis.android.sdk.example.R;
//import co.pragma.www.plugin.morpho.R;
import morpho.etis.android.sdk.ui.common.IDATA_PARAMETERS;

/**
 * The Authentication activity
 */
public class AuthenticationActivity extends BaseActivity {
    public static final String ACCOUNT_NAME_KEY = "ACCOUNT_NAME";
    private static final String TAG = AuthenticationActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // This layout has single fragment tasked with the account management
        setContentView(R.layout.layout_init_client_activity);

        // This is the user account name saved during registration
        String accountName = getIntent().getStringExtra(ACCOUNT_NAME_KEY);

        Bundle bundle = new Bundle();
        bundle.putString(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID, accountName);
        bundle.putString(IDATA_PARAMETERS.PARAM_AUTHENTICATION_TOKEN_TYPE, IAccount_Data.AuthenticationTokenType.FULL_ACCESS.name());

        launchAuthentication(bundle);

        // Remark: EtisAccountManager can be used to retrieve the list of registered accounts and invoke
        // launchAuthentication(android.accounts.Account, morpho.etis.android.sdk.account.IAccount_Data.AuthenticationTokenType)

         /*
          * There will be 4 possible responses that will be captured by:
          *      protected void onAuthenticationSuccess(Bundle aData)
          *      protected void onAuthenticationFailure(Bundle aData)
          *      protected void onNetworkError(Bundle aData)
          *      protected void onOperationCanceled(Bundle aData)
          */
    }

    // Invoked when the Authentication succeeds
    @Override
    protected void onAuthenticationSuccess(Bundle aData) {
        Log.i(TAG, "Successful authentication");
        Intent intentRequest = new Intent();
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID, aData.getString(IDATA_PARAMETERS.PARAM_PERSON_EXTERNAL_ID));
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_TOKEN, aData.getString(IDATA_PARAMETERS.PARAM_TOKEN));
        intentRequest.putExtra(IDATA_PARAMETERS.PARAM_MEAN_OF_AUTHENTICATION_ENUM, aData.getSerializable(IDATA_PARAMETERS.PARAM_MEAN_OF_AUTHENTICATION_ENUM));
        setResult(RESULT_OK, intentRequest);
        finish();
    }

    // Invoked when the Authentication fails
    @Override
    protected void onAuthenticationFailure(Bundle aData) {
        Log.i(TAG, "Authentication Failure");
        Intent intentResponse = bundleErrorParser(aData);
        setResult(RESULT_CANCELED, intentResponse);
        finish();
    }

    // Not used here
    @Override
    protected void onAccountCreationSuccess(Bundle aData) {
    }

    // Not used here
    @Override
    protected void onAccountCreationFailure(Bundle aData) {
    }


}
