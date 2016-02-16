package co.pragma.www.plugin.daon;

import java.util.Hashtable;

import com.daon.sdk.face.FaceEngine;
import com.daon.sdk.face.FaceEngineListener;
import com.daon.sdk.face.FaceQuality;
import com.daon.sdk.face.ImageInfo;
import com.daon.sdk.face.Verifier;
import com.google.android.gms.internal.im;
import com.ionicframework.sherpaenroll532309.R;

import android.content.Intent;
import android.graphics.Color;
import android.hardware.Camera;
import android.hardware.Camera.PreviewCallback;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.ViewGroup.LayoutParams;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import co.pragma.www.webservice.HttpRequest;


public class MainActivity extends Activity
{

	private final String TAG = "VERIFY";

	private static final int IMAGE_WIDTH = 640;
	private static final int IMAGE_HEIGHT = 480;
	
	// Face SDK and camera
	private FaceEngine engine = null;
	protected CameraPreview preview;
		
	// Data
	private boolean enrolled = false;
	private boolean blink = false;
	private int count = 0;
	private TextView status;
	private byte[] photoByteData = null;
	
	private Hashtable<String, TextView> qualityMeasures = new Hashtable<String, TextView>();
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.activity_main_daon);
		
		preview = new CameraPreview(this, IMAGE_WIDTH, IMAGE_HEIGHT);
		
		FrameLayout layout = (FrameLayout) findViewById(R.id.preview);
		layout.addView(preview);
	
		status = (TextView) findViewById(R.id.status);

		// Create overlay to display quality measures
		LinearLayout measures = new LinearLayout(this);
		LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
				LayoutParams.MATCH_PARENT, 
				LayoutParams.WRAP_CONTENT,
				0);
		
		layoutParams.setMargins(5, 5, 5, 5);
		measures.setOrientation(LinearLayout.VERTICAL);
		measures.setLayoutParams(layoutParams);
	
		layout.addView(measures);
		
		// Add quality measure to overlay
		/*
		addQualityMeasureToLayout(measures, FaceQuality.FACE_FOUND_CONFIDENCE);
		addQualityMeasureToLayout(measures, FaceQuality.FACE_FRONTAL_CONFIDENCE);
		addQualityMeasureToLayout(measures, FaceQuality.EYES_FOUND_CONFIDENCE);
		addQualityMeasureToLayout(measures, FaceQuality.EYES_OPEN_CONFIDENCE);
		addQualityMeasureToLayout(measures, FaceQuality.EYES_DISTANCE);
		addQualityMeasureToLayout(measures, FaceQuality.UNIFORM_LIGHTING_CONFIDENCE);

*/
        addQualityMeasureToLayout(measures, "face.confidence");
		addQualityMeasureToLayout(measures, "face.frontal.confidence");
		addQualityMeasureToLayout(measures, "face.eye.confidence");
		addQualityMeasureToLayout(measures, "face.eye.open.confidence");
		addQualityMeasureToLayout(measures, "face.eye.distance");
		addQualityMeasureToLayout(measures, "face.lighting.confidence");

		// Initialize and start the Face SDK
		initializeSDK();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		// Inflate the menu; this adds items to the action bar if it is present.
		//getMenuInflater().inflate(R.menu.main, menu);
		return true;
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
		
		if (engine != null)
			engine.stop();
		
		super.onPause();
	}	

	private void addQualityMeasureToLayout(LinearLayout layout, String measure)
	{
		TextView view = new TextView(this);
		FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
					LayoutParams.MATCH_PARENT, 
					LayoutParams.WRAP_CONTENT,
					Gravity.START);
		//view.setBackgroundColor(Color.argb(50, 256, 256, 256));
		view.setLayoutParams(layoutParams);
		
		qualityMeasures.put(measure, view);
		layout.addView(view);
	}
	
//	private void updateQualityMeasures2(ImageInfo info)
//	{
//		Bundle measures = info.getAll();
//		for (String key : measures.keySet()) {
//
//			TextView view = qualityMeasures.get(key);
//			if (view != null) {
//				Object number = measures.get(key);
//				if (number instanceof Float) {
//					float value = (Float)number;
//					if (value > 0) {
//						view.setText(String.format("%s: %.2f", key, value));
//					
//						float threshold = engine.getThresholds().get(key).floatValue();
//						view.setTextColor(value >= threshold ? Color.GREEN : Color.RED);
//					}
//				} else {
//					int value = (Integer)number;
//					if (value > 0) {
//						
//						view.setText(String.format("%s: %d", key, value));
//					
//						float threshold = engine.getThresholds().get(key).intValue();
//						view.setTextColor(value >= threshold ? Color.GREEN : Color.RED);
//					}
//				}
//			}
//		}
//	}

	private void updateQualityMeasures(ImageInfo info)
	{
		Bundle measures = info.getAll();
		for (String key : measures.keySet()) {
			TextView view = qualityMeasures.get(key);
			if (view != null) {
				Number number = (Number)measures.get(key);
				
				// Treat all values as float
				float value = number.floatValue();
				if (value > 0) {
					float threshold = engine.getThresholds().get(key).floatValue();
					view.setText(String.format("%s: %.2f", key, value));
					view.setTextColor(value >= threshold ? Color.GREEN : Color.RED);
				}	
			}
		}
	}

	
	private void vibrate()
	{
		Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
		if (vibrator != null && vibrator.hasVibrator())
			vibrator.vibrate(200);
	}
	
	private void initializeSDK()
	{
		// Initialize the Face SDK. Make sure this is only done once.		
			
		engine = Verifier.getInstance(this,
			IMAGE_WIDTH,
			IMAGE_HEIGHT,
			Verifier.OPTION_VERIFICATION|Verifier.OPTION_LIVENESS|Verifier.OPTION_QUALITY);

		engine.setThreshold(FaceEngine.LIVENESS_SCORE, FaceEngine.THRESHOLD_LIVENESS);
		engine.setThreshold(FaceEngine.VERIFY_SCORE, FaceEngine.THRESHOLD_VERIFY);
		engine.setThreshold(FaceQuality.FACE_FOUND_CONFIDENCE, FaceQuality.THRESHOLD_FACE_FOUND_CONFIDENCE + .20f);
		ImageView img = new ImageView(this);
		img.setBackgroundResource(R.drawable.background);

		addContentView(img, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));

		engine.setListener(new FaceEngineListener() {

			@Override
			public void onImageVerify(ImageInfo info) {
				boolean last = blink;

				blink = info.isBlinkDetected();

				if (info.getFacePosition().isEmpty()) {
					count = 0;

				} else {
					// Only count the frame with the first blink
					if (!last && blink && info.isVerified())
						count++;
				}

				update(info);
			}

			@Override
			public void onImageEnroll(boolean success) {
				enrolled = success;
				Log.d(TAG, "Enrolled: " + enrolled);
			}
		});

	}
	
	
	private void startCameraPreview()
	{
		// Start camera preview and rotate it 90 degrees
		preview.start(90);	
		
		// Set preview frame callback and start collecting frames.
		// Frames are in the NV21 format YUV encoding.
		
		preview.setPreviewFrameCallback(new PreviewCallback() {
			@Override
			public void onPreviewFrame(byte[] data, Camera camera) {
				if (data != null)
					processFrame(data);
			}
		});
	}
	private void processFrame(byte[] data)
	{
		// Pass the image to the Face SDK. 
		
		// In this demo we just enroll the image/face we get from
		// the camera.
		
		if (engine != null) {
			
			// Wait for blink then verify
			//
			// 1. Wait for blink
			// 2. Enroll if blink
			// 3. If user is enrolled then just look for blinks
			
			if (blink && !enrolled) {

				photoByteData = data;
				// Keep enrolling images until done
                Intent Data = new Intent();

                engine.enrollImage(data, true);
                Log.d(TAG, "Enrolled: " + enrolled);
                Data.putExtra("img", photoByteData);
                setResult(RESULT_OK, Data);
				Log.d("Verificacion", "Guardé el resultado");
                finish();

			} else {
				if (blink) {
					photoByteData = data;
					// Keep enrolling images until done
					Intent Data = new Intent();
					Data.putExtra("img", photoByteData);
					setResult(RESULT_OK, Data);
					Log.d("Verificacion", "Guardé el resultado");
					finish();
				}

				 engine.verifyImage(data);
				// finish();
			}
		}
	}
	
	private void update(final ImageInfo info)
	{
		Handler handler = new Handler(Looper.getMainLooper());
		
		handler.post(new Runnable() {
            @Override
            public void run() {
                if (info == null)
                    return;

                if (info.getFacePosition().isEmpty()) {
                    status.setText("No face detected");
                } else {
                    if (!enrolled) {

                        status.setText("Blink to enroll");

                    } else {

                        String score = String.format("%.2f", info.getVerifyScore());
                        String quality = info.getQuality().isWithinThresholds() ? "Yes" : "No";

                        if (info.getQuality().isWithinThresholds())
                            vibrate();

                        if (info.isVerified())
                            status.setText("Verified (" + score + ")  Blink: " + count + " (" + info.getLivenessScore() + ")  Quality: " + quality);
                        else
                            status.setText("Not verified (" + score + ")");

                        updateQualityMeasures(info);
                    }
                }

            }
        });
	}
}