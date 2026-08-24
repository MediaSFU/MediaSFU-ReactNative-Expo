import { disconnectSendTransportAudio as sharedDisconnectSendTransportAudio } from 'mediasfu-shared';
import type { Socket } from 'socket.io-client';
import { PrepopulateUserMediaType, PrepopulateUserMediaParameters } from '../@types/types';
import type { Producer } from 'mediasoup-client/types';

export interface DisconnectSendTransportAudioParameters extends PrepopulateUserMediaParameters {
  audioProducer: Producer | null;
  localAudioProducer?: Producer | null;
  socket: Socket;
  localSocket?: Socket;
  videoAlreadyOn: boolean;
  islevel: string;
  lock_screen: boolean;
  shared: boolean;
  updateMainWindow: boolean;
  hostLabel: string;
  roomName: string;
  updateAudioProducer: (audioProducer: Producer | null) => void;
  updateLocalAudioProducer?: (localAudioProducer: Producer | null) => void;
  updateUpdateMainWindow: (updateMainWindow: boolean) => void;

  // mediasfu functions
  prepopulateUserMedia: PrepopulateUserMediaType;
  [key: string]: any;
}

export interface DisconnectSendTransportAudioOptions {
  parameters: DisconnectSendTransportAudioParameters;
}

export type DisconnectSendTransportAudioType = (options: DisconnectSendTransportAudioOptions) => Promise<void>;

export const disconnectSendTransportAudio: DisconnectSendTransportAudioType = async (options): Promise<void> => {
  await (sharedDisconnectSendTransportAudio as unknown as DisconnectSendTransportAudioType)(options);
};
