const {
  AndroidConfig,
  createRunOncePlugin,
  withInfoPlist,
} = require('expo/config-plugins');

const DEFAULT_CAMERA_PERMISSION =
  'Allow $(PRODUCT_NAME) to access your camera';
const DEFAULT_MICROPHONE_PERMISSION =
  'Allow $(PRODUCT_NAME) to access your microphone';

function withMediaSFUWebRTC(config, props = {}) {
  config = withInfoPlist(config, (modConfig) => {
    modConfig.modResults.NSCameraUsageDescription =
      props.cameraPermission ||
      modConfig.modResults.NSCameraUsageDescription ||
      DEFAULT_CAMERA_PERMISSION;
    modConfig.modResults.NSMicrophoneUsageDescription =
      props.microphonePermission ||
      modConfig.modResults.NSMicrophoneUsageDescription ||
      DEFAULT_MICROPHONE_PERMISSION;
    return modConfig;
  });

  config.ios = {
    ...config.ios,
    bitcode: false,
  };

  return AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.ACCESS_NETWORK_STATE',
    'android.permission.CAMERA',
    'android.permission.INTERNET',
    'android.permission.MODIFY_AUDIO_SETTINGS',
    'android.permission.RECORD_AUDIO',
    'android.permission.SYSTEM_ALERT_WINDOW',
    'android.permission.WAKE_LOCK',
    'android.permission.BLUETOOTH',
  ]);
}

module.exports = createRunOncePlugin(
  withMediaSFUWebRTC,
  'mediasfu-reactnative-expo-webrtc',
  '1.0.0',
);
