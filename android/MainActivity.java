package com.crypty.vpn;

import android.content.Intent;
import android.net.VpnService;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private static final int VPN_PREPARE = 1001;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.setWebViewClient(new WebViewClient());
        
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }
    
    public class WebAppInterface {
        MainActivity activity;
        
        WebAppInterface(MainActivity a) { activity = a; }
        
        @android.webkit.JavascriptInterface
        public boolean connectWireGuard(final String serverId) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    prepareAndConnect(serverId);
                }
            });
            return true;
        }
        
        @android.webkit.JavascriptInterface
        public boolean disconnectWireGuard() {
            return true;
        }
    }
    
    private void prepareAndConnect(String serverId) {
        Intent intent = VpnService.prepare(this);
        if (intent != null) {
            startActivityForResult(intent, VPN_PREPARE);
        } else {
            onActivityResult(VPN_PREPARE, RESULT_OK, null);
        }
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == VPN_PREPARE && resultCode == RESULT_OK) {
            Toast.makeText(this, "🔐 VPN Permission Granted", Toast.LENGTH_SHORT).show();
            Log.i("CryptyVPN", "VPN ready — connect to server: " + serverId);
        } else {
            Toast.makeText(this, "❌ VPN Permission Denied", Toast.LENGTH_SHORT).show();
        }
    }
}
