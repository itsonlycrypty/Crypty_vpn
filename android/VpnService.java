package com.crypty.vpn;

import android.content.Intent;
import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.util.Log;

public class VpnService extends android.net.VpnService {
    
    private static final String TAG = "CryptyVPN";
    private ParcelFileDescriptor vpnInterface;
    private boolean
