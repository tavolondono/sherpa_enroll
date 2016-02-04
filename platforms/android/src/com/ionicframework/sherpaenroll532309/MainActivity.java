/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ionicframework.sherpaenroll532309;

import android.os.Bundle;
import org.apache.cordova.*;

import morpho.etis.android.sdk.mid_android_sdk.application.EtisCoreSingleton;
import morpho.etis.android.sdk.network.IMeanOfAuthentication;

public class MainActivity extends CordovaActivity
{
    private EtisCoreSingleton mEtisCoreSingleton;

    @Override
    public void onDestroy() {
        mEtisCoreSingleton.onTerminate();
        super.onDestroy();
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        mEtisCoreSingleton = EtisCoreSingleton.getInstance(getApplicationContext());
        mEtisCoreSingleton.onCreate();

        mEtisCoreSingleton.getDeviceFeaturesManager().addDisabledFeature(IMeanOfAuthentication.MOA.VOICE_DEVICE);
        mEtisCoreSingleton.getDeviceFeaturesManager().addDisabledFeature(IMeanOfAuthentication.MOA.SMARTCARD_DEVICE);
        mEtisCoreSingleton.getDeviceFeaturesManager().addDisabledFeature(IMeanOfAuthentication.MOA.FINGERPRINT_DEVICE);
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }
}
