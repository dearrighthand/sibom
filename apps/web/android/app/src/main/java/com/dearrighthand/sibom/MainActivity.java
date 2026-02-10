package com.dearrighthand.sibom;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Force Edge-to-Edge mode
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
