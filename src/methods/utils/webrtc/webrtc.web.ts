import {
  RTCView as RNRTCView, MediaStream, mediaDevices, registerGlobals, MediaStreamTrack,
} from 'react-native-webrtc-web-shim';

const RTCView: any = RNRTCView;

const createMediaStream = (tracks: globalThis.MediaStreamTrack[]): MediaStream => {
  const stream = new MediaStream();
  tracks.forEach((track) => stream.addTrack(track));
  return stream;
};

export {
  RTCView, mediaDevices, registerGlobals, MediaStream, MediaStreamTrack, createMediaStream,
};
