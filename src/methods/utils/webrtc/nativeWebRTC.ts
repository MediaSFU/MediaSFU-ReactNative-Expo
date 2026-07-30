import { NativeModules, Platform } from 'react-native';
import {
  createNativeCapabilityError,
  isNativeModuleLoadError,
} from '../nativeCapability';

type NativeWebRTCExports = typeof import('react-native-webrtc');

/**
 * Check native registration before evaluating WebRTC, which creates a
 * NativeEventEmitter as soon as its module is loaded.
 */
export function loadNativeWebRTC(): NativeWebRTCExports {
  const nativeModules = NativeModules as typeof NativeModules & {
    WebRTCModule?: unknown;
  };

  if (!nativeModules?.WebRTCModule) {
    throw createNativeCapabilityError({
      moduleName: 'WebRTCModule',
      packageName: 'react-native-webrtc',
      platform: Platform.OS,
    });
  }

  try {
    return require('react-native-webrtc') as NativeWebRTCExports;
  } catch (error) {
    if (isNativeModuleLoadError(error)) {
      throw createNativeCapabilityError({
        moduleName: 'WebRTCModule',
        packageName: 'react-native-webrtc',
        platform: Platform.OS,
      });
    }
    throw error;
  }
}
