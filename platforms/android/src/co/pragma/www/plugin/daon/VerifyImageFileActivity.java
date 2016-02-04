package co.pragma.www.plugin.daon;

import java.io.IOException;


import com.daon.sdk.face.FaceEngine;
import com.daon.sdk.face.FaceEngineListener;
import com.daon.sdk.face.Files;

import com.daon.sdk.face.Verifier;
import com.daon.sdk.face.ImageInfo;


import android.graphics.Rect;
import android.os.Bundle;
import android.util.Log;

import android.app.Activity;


public class VerifyImageFileActivity extends Activity
{
	private final String TAG = "VERIFY";
	
	private static final int IMAGE_WIDTH = 640;
	private static final int IMAGE_HEIGHT = 480;

	public static final float THRESHOLD_VERIFICATION = 0.85f;
	
	// Face SDK
	private FaceEngine engine = null;


	// Verification data
	private boolean enrolled = false;

	private float score = 0.0f;
	private Rect rect = null;
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

				
		// Initialize and start the Face SDK
		initializeSDK();
		
		// NOTE 
		// Input images are assumed to be in portrait orientation
		
		try 
		{
			String filename = Files.getExternalStoragePath() + "/Enrollment.jpg";
			
			engine.enrollImageFile(filename, 90, false);
		}
		catch (Exception e)
		{
			Log.e(TAG, "Error: " + e.getMessage());
		}

	}
	
	
	
	@Override
	public void onDestroy()
	{
		if (engine != null)
			engine.stop(); 
		
		super.onDestroy();
	}
		
	private void initializeSDK()
	{
		// Initialize the Face SDK. Make sure this is only done once.
		
				
		engine = Verifier.getInstance(this, IMAGE_WIDTH, IMAGE_HEIGHT, Verifier.OPTION_VERIFICATION);
		
		engine.setVerifyThreshold(THRESHOLD_VERIFICATION);
		engine.setListener(new FaceEngineListener()
		{
			
			@Override
			public void onImageVerify(ImageInfo info)
			{ 
				score = info.getVerifyScore();
                rect = info.getFacePosition();
				
                Log.d(TAG, "Verify: " + score + ", " + rect);
			}
			
			@Override
			public void onImageEnroll(boolean success)
			{
				enrolled = success;
				
				Log.d(TAG, "Enrolled: " + enrolled);
				
				if (enrolled) {
					
					try
					{
						String filename = Files.getExternalStoragePath() + "/VerifiedWithScore-0.88-.jpg";
						
						engine.verifyImageFile(filename, 90, false);
					}
					catch (IOException e)
					{
						Log.e(TAG, e.getLocalizedMessage());
					}
				}
				
			}
		});
	}

	
}
