package co.pragma.www.webservice;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

/**
 * Created by glondono on 16/12/2015.
 */
public class PostServices extends AsyncTask<String, String, Boolean> {


    /**
     * En este string se alamacenara la respuesta del servidor;
     */
    private String stringRes = null;

    /**
     * Mensaje cuando ocurra un erro en el formato de la url
     */
    private final String URL_ERROR_FORMAT = "La url a la  que esta intentando acceder es incorrecta";

    /**
     * Mensaje cuando ocuraa un error en la conexion
     */
    private final String CONNECTION_ERROR = "Error al intentar contactar el Servidor";

    /**
     * Mensaje cuando ocurra un error desconocido
     */
    private final String UNKNOW_ERROR = "Error desconocido Intente mas Tarde";

    /**
     * Variabe para almacenar el error que ocurra
     */
    private String ERROR_MESSAGE;


    /**
     * Lista de parametros a enviar en la peticion
     */
    private List<CouplePostParam> paramsList;

    /**
     * Dao que invoca esta clase
     */
    private PostServiceInterface postServiceInterface;

    public PostServices(PostServiceInterface postServiceInterface, List<CouplePostParam> paramsList) {
        this.postServiceInterface = postServiceInterface;
        this.paramsList = paramsList;
    }

    @Override
    protected Boolean doInBackground(String... strings) {
        //Cojemos la url a la que se realizara la peticion
        String urlString = strings[0];


        try {

            /**
             * Damos formato a los parametros para enviarlos por
             * la url al backend
             */
           // String data = organizePostServicesParametres(paramsList);

            /**
             * Si hay datos que enviar los  anadimso a la url
             */
           // if (data != null)
             //   urlString += "?" + data;

            /**
             * Creamos un nuevo objeto de tipo url
             */
            URL url = new URL(urlString);

            /**
             * Creamos un nuevo objeto de tipo http con la url de destino
             */
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();

            /**
             * Anadimos un tiempo de conexion maximo
             */
           // httpURLConnection.setConnectTimeout(20000);

            /**
             * Indicamos que es post ??
             */
            httpURLConnection.setDoOutput(true);
            httpURLConnection.setDoInput(true);
            httpURLConnection.setUseCaches(false);

            /**
             * Le decimos que no hay iteraccion con el usuario
             */
          //  httpURLConnection.setAllowUserInteraction(false);

            /**
             * Anadimos tiempo maximo de lectura
             */
          //  httpURLConnection.setReadTimeout(25000);

            /**
             * LE decimos que el tipo de conexion es POST
             */
            httpURLConnection.setRequestMethod("POST");

            /**
             * Le indicamos que el contenido es de tipo json
             */



            /**
             * nos conectamos
             */
            httpURLConnection.connect();

            OutputStream os = httpURLConnection.getOutputStream();
            BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(os, "UTF-8"));



            JSONObject jsonParam = new JSONObject();
            jsonParam.put(paramsList.get(0).getKey(), paramsList.get(0).getParam());
            writer.write(URLEncoder.encode(jsonParam.toString(), "UTF-8"));
            writer.flush();
            writer.close();




            /**
             * Obtenemos el status de la conexion
             */
            int status = httpURLConnection.getResponseCode();

            switch (status) {

                /**
                 * Si el status es 200 o 201 que indican que everything salio bien procesamos la respuesta
                 */
                case 200:
                case 201: {
                    BufferedReader br = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\n");
                    }
                    br.close();
                    stringRes = sb.toString();
                    if (httpURLConnection != null)
                        httpURLConnection.disconnect();
                    break;
                }
                default: {
                    /**
                     * De lo contrario mostramos mensaje de error
                     */
                    ERROR_MESSAGE = CONNECTION_ERROR;
                    return false;
                }
            }


        } catch (Exception ex) {
            Log.i("Debug", "error: " + ex.getMessage(), ex);
            ERROR_MESSAGE = UNKNOW_ERROR + "; " + ex;
            return false;
        }


        return true;
    }

    @Override
    protected void onPostExecute(Boolean aBoolean) {
        super.onPostExecute(aBoolean);
        if (aBoolean) {
            postServiceInterface.firstMethod(stringRes);
        }

        else {
            postServiceInterface.errorHandler(ERROR_MESSAGE);

        }


    }

    public String organizePostServicesParametres(List<CouplePostParam> couplePostParams) {

        if (couplePostParams == null)
            return null;

        String data = "";
        try {
            for (int i = 0; i < couplePostParams.size(); i++) {
                CouplePostParam couplePostParam = couplePostParams.get(i);
                if (i > 0)
                    data += "&";

                data += URLEncoder.encode(couplePostParam.getKey(), "UTF-8")
                        + "=" + URLEncoder.encode(couplePostParam.getParam(), "UTF-8");

            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return data = null;
        }

        if (data.equals(""))
            return data = null;

        return data;


    }


}
