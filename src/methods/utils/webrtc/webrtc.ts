import { loadNativeWebRTC } from './nativeWebRTC';

const {
    mediaDevices, RTCView: RNRTCView, registerGlobals, MediaStream, MediaStreamTrack,
} = loadNativeWebRTC();

const RTCView: any = RNRTCView;

const createMediaStream = (tracks: globalThis.MediaStreamTrack[]): InstanceType<typeof MediaStream> =>
  new MediaStream(tracks as unknown as InstanceType<typeof MediaStreamTrack>[]);

export {
    mediaDevices, RTCView, registerGlobals, MediaStream, MediaStreamTrack, createMediaStream,
};
