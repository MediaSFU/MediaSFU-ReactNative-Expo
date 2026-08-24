import { loadNativeWebRTC } from './nativeWebRTC';

const nativeWebRTC = loadNativeWebRTC();
const {
    RTCView: RNRTCView, registerGlobals, MediaStream, MediaStreamTrack,
} = nativeWebRTC;

interface MediaDevicesContract {
  ondevicechange: unknown;
  enumerateDevices(): Promise<unknown>;
  getDisplayMedia(constraints: unknown): Promise<InstanceType<typeof MediaStream>>;
  getUserMedia(constraints: unknown): Promise<InstanceType<typeof MediaStream>>;
}

const mediaDevices = nativeWebRTC.mediaDevices as unknown as MediaDevicesContract;

const RTCView: any = RNRTCView;

/**
 * mediasoup-client declares tracks with DOM types even when the active runtime
 * is react-native-webrtc. The underlying track is supplied by that runtime,
 * so this conversion is kept at the WebRTC adapter boundary.
 */
const createMediaStream = (tracks: globalThis.MediaStreamTrack[]): InstanceType<typeof MediaStream> =>
  new MediaStream(tracks as unknown as InstanceType<typeof MediaStreamTrack>[]);

export {
    mediaDevices, RTCView, registerGlobals, MediaStream, MediaStreamTrack, createMediaStream,
};
