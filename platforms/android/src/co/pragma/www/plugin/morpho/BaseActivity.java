package co.pragma.www.plugin.morpho;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import morpho.etis.android.sdk.mid_android_sdk.ui.activities.AbstractRequestAuthenticationActivity;
import morpho.etis.android.sdk.ui.common.IDATA_PARAMETERS;

/**
 * This class gathers common callbacks used during the registration and the authentication.
 */
public abstract class BaseActivity extends AbstractRequestAuthenticationActivity {

    private static final String TAG = BaseActivity.class.getSimpleName();

    // Invoked when there is a network error
    @Override
    protected void onNetworkError(Bundle aData) {
        Log.e(TAG, "NetworkError");
        Intent intentResponse = bundleErrorParser(aData);
        setResult(RESULT_CANCELED, intentResponse);
        finish();
    }

    // Users cancels the operation
    @Override
    protected void onOperationCanceled(Bundle aData) {
        Log.e(TAG, "OperationCanceled");
        Intent intentResponse = bundleErrorParser(aData);
        setResult(RESULT_CANCELED, intentResponse);
        finish();
    }

    // Helper method which be invoked at each unsuccessful attempt
    protected Intent bundleErrorParser(Bundle aData) {
        Intent intentResponse = new Intent();
        if (aData.containsKey(IDATA_PARAMETERS.PARAM_ERROR)) {
            intentResponse.putExtra(IDATA_PARAMETERS.PARAM_ERROR, aData.getParcelable(IDATA_PARAMETERS.PARAM_ERROR));
        }
        return intentResponse;
    }

}
