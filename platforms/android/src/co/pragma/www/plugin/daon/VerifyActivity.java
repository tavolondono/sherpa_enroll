package co.pragma.www.plugin.daon;


import com.daon.sdk.face.FaceEngine;
import com.daon.sdk.face.FaceEngineListener;
import com.ionicframework.sherpaenroll532309.R;
import com.daon.sdk.face.Verifier;
import com.daon.sdk.face.ImageInfo;


import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
import android.hardware.Camera;
import android.hardware.Camera.PreviewCallback;
import android.os.Bundle;

import android.util.Log;
import android.util.TypedValue;

import android.view.Display;
import android.view.Window;
import android.view.WindowManager;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.TextView;

import android.app.Activity;


public class VerifyActivity extends Activity
{
	private final String TAG = "VERIFY";
	
	private static final int IMAGE_WIDTH = 640;
	private static final int IMAGE_HEIGHT = 480;
	
	// Face SDK and camera
	private FaceEngine engine = null;
	protected CameraPreview preview;
	
	// UI
	private TextView status;

	// Verification data
	private boolean enrolled = false;
	private boolean verified = false;
	private float score = 0.0f;
	private Rect rect = null;
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
		// The View Finder should take up the whole screen.
		// Note. These methods has to be called before setting the
		// content.
		
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

		// The camera is always in landscape orientation. Setting landscape orientation
		// in the manifest will make sure that our image has the right orientation.
			
		
		// Create the View Finder/Preview and make it the content. The preview could be added to a View
		// instead of using full screen.
		
		preview = new CameraPreview(this, IMAGE_WIDTH, IMAGE_HEIGHT);
		
		setContentView(preview);

		setupUI();
		
		// Initialize and start the Face SDK
		initializeSDK();
	}
	
	@Override
	public void onDestroy()
	{
		if (engine != null)
			engine.stop(); 
		
		super.onDestroy();
	}
	
	@Override
	protected void onResume()
	{
		super.onResume();

		// This is called the first time the Activity is started and 
		// when the screen is rotated. So watch out, since onCreate 
		// may be called more than once if the display is rotated.
		
		startCameraPreview();		
	}

	@Override
	protected void onPause()
	{
		preview.stop();
		
		super.onPause();
	}	
	
	private void initializeSDK()
	{
		// Initialize the Face SDK. Make sure this is only done once.
		
		engine = Verifier.getInstance(this, IMAGE_WIDTH, IMAGE_HEIGHT, Verifier.OPTION_VERIFICATION);
		
		engine.setListener(new FaceEngineListener()
		{
			
			@Override
			public void onImageVerify(ImageInfo info)
			{
				verified = info.isVerified(); 
				score = info.getVerifyScore();
                rect = info.getFacePosition();


				
               // Log.d(TAG, "Verify: " + score + ", " + rect);
			}
			
			@Override
			public void onImageEnroll(boolean success)
			{
				enrolled = success;
				
				Log.d(TAG, "Enrolled: " + enrolled);
				
			}
		});
	
	}
	
	private void startCameraPreview()
	{
		// Start camera preview
		preview.start();
		
		// Set preview frame callback and start collecting frames.
		// Frames are in the NV21 format YUV encoding.
		
		preview.setPreviewFrameCallback(new PreviewCallback()
		{			
			@Override
			public void onPreviewFrame(byte[] data, Camera camera)
			{
				// Pass the image to the Face SDK. You may want to add
				// a queue or some additional threading if there are 
				// performance issues.
				
				// In this demo we just enroll the image/face we get from
				// the camera.
                Log.d("Preview", "data value: " + data);
				if (engine != null) 
				{
					if (!enrolled)
	            		engine.enrollImage(data, false);
	            	else
	            		engine.verifyImage(data);	
				}
			}
		});		
	}
	
	private void setupUI()
	{
		Display display = getWindowManager().getDefaultDisplay();
		Point size = new Point();
		display.getSize(size);
		
		ImageView img = new ImageView(this);
		img.setBackgroundResource(R.drawable.background);

		addContentView(img, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
		
		status = new TextView(this);

		status.setTextColor(Color.WHITE);
		status.setBackgroundColor(Color.TRANSPARENT);
		status.setWidth(size.x);
		status.setTextSize(TypedValue.COMPLEX_UNIT_PT, 12.0f);
		status.setX(60 - (size.x / 2));
		status.setY((size.y - 50) - (size.x / 2));
		status.setRotation(-90);
		
		addContentView(status, new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
		
		status.postDelayed(new Runnable()
		{
			@Override
			public void run()
			{
				if (rect == null || rect.isEmpty())
					status.setText("No face detected");
				else if (enrolled)
					status.setText("Verified: " + verified + " (" + score + ")");
				else
					status.setText("Not enrolled");
				
				status.postDelayed(this, 200);
			}
		}, 200);
	}
	
	
	
}
