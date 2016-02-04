package co.pragma.www.plugin.daon;

import java.io.IOException;

import android.content.Context;
import android.graphics.ImageFormat;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.hardware.Camera.PreviewCallback;
import android.hardware.Camera.Size;
import android.os.Build;
import android.view.SurfaceHolder;
import android.view.SurfaceView;


public class CameraPreview  extends SurfaceView implements SurfaceHolder.Callback 
{
	public final String TAG = "CameraPreview";
	
	private SurfaceHolder holder; 
	private Camera camera = null; 
	private int cameraid = -1;
	private int orientation = 0;
    
	private int width;
	private int height;
	
	public CameraPreview(Context context)
	{
		this(context, 640, 480);
	}
	
	@SuppressWarnings("deprecation")
	public CameraPreview(Context context, int width, int height) 
	{
		super(context);
		
		this.width = width;
		this.height = height;
		
		holder = getHolder();
		holder.addCallback(this);
		holder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		
		initializeAndSelectCamera();
	}
	
	public Size getPreviewSize()
    {
    	if (camera != null)
    		return camera.getParameters().getPreviewSize();
    	
    	return null;
    }
    
    
	public void setPreviewFrameCallback(PreviewCallback callback)
	{
		if (camera != null)
			camera.setPreviewCallback(callback);
	}
		
	
	public void start()
	{			
		start(-1);
	}
	
	public void start(int orientation)
	{			
		camera = Camera.open(cameraid);
		if (orientation >= 0)
			camera.setDisplayOrientation(orientation);
	}
	
	public CameraInfo getCameraInfo()
	{
		CameraInfo info = new CameraInfo();
    	Camera.getCameraInfo(cameraid, info);
    	
    	return info;
	}
	
	
	public boolean isMirrored()
	{
		Camera.CameraInfo info = getCameraInfo();
		if (info != null)
			return info.facing == CameraInfo.CAMERA_FACING_FRONT;
		
		return false;
	}
	
	private void initializeAndSelectCamera()
	{
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD)
		{	
			// Find the total number of cameras available
	        int numberOfCameras = Camera.getNumberOfCameras();
	
	        Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
	         
	        // Find the first front facing camera or any camera
	        // available
	        
	        for (int i = 0; i < numberOfCameras; i++) 
	        {
	        	Camera.getCameraInfo(i, cameraInfo);
	        		    
	        	orientation = cameraInfo.orientation;
	        	
	        	cameraid = i;
	        	
	            if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) 
	            	break;
			}
	        
	        if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_BACK)
	        	orientation = 360 - orientation;
		}
	}
	
	
	
	public void stop()
	{
		if (camera != null)
		{
			camera.cancelAutoFocus();
			camera.setPreviewCallback(null);
			camera.stopPreview();
			camera.release();
			
			camera = null;
		}
	}
	
	public int getOrientation()
	{
		return orientation;

	}
	
	// Called once the holder is ready
	public void surfaceCreated(SurfaceHolder holder) 
	{ 
		if (camera == null)
			return;
		
		try 
		{
			camera.setPreviewDisplay(holder);
		} 
		catch (IOException e) 
		{
			stop();
		}
	}
	
	

	// Called when the holder is destroyed
	public void surfaceDestroyed(SurfaceHolder holder) 
	{
		if (camera != null)
			stop();
	}

	// Called when holder has changed
	public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) 
	{ 
		if (holder.getSurface() == null)
	          return;

		if (camera == null)
			return;

		Camera.Parameters p = camera.getParameters();

		p.setPreviewSize(width, height);
		p.setPreviewFormat(ImageFormat.NV21);
		requestLayout();		
		
//		List<String> focusmodes = p.getSupportedFocusModes();
//		if (focusmodes.contains(Camera.Parameters.FOCUS_MODE_AUTO))
//			p.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);

		camera.setParameters(p);
		
		camera.startPreview();
	}

}
