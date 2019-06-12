package com.react_native_gj_fcm;

import android.provider.Settings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;


public class GJFCM extends ReactContextBaseJavaModule {

    public GJFCM(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "GJM";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("notificationToken",new GJFirebaseMessagingService().notificationToken);
        return constants;
    }
}