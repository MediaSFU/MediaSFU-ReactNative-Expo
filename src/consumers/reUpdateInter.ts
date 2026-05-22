import { reUpdateInter as sharedReUpdateInter } from 'mediasfu-shared';
import {
  Participant, Stream, OnScreenChangesType, ReorderStreamsType, ChangeVidsType, OnScreenChangesParameters, ReorderStreamsParameters, ChangeVidsParameters, EventType,
} from '../@types/types';

export interface ReUpdateInterParameters extends OnScreenChangesParameters, ReorderStreamsParameters, ChangeVidsParameters {
  screenPageLimit: number;
  itemPageLimit: number;
  reorderInterval: number;
  fastReorderInterval: number;
  eventType: EventType;
  participants: Participant[];
  allVideoStreams: (Participant | Stream)[];
  shared: boolean;
  shareScreenStarted: boolean;
  adminNameStream?: string;
  screenShareNameStream?: string;
  updateMainWindow: boolean;
  sortAudioLoudness: boolean;
  lastReorderTime: number;
  newLimitedStreams: (Participant | Stream)[];
  newLimitedStreamsIDs: string[];
  oldSoundIds: string[];
  updateUpdateMainWindow: (value: boolean) => void;
  updateSortAudioLoudness: (value: boolean) => void;
  updateLastReorderTime: (value: number) => void;
  updateNewLimitedStreams: (streams: (Participant | Stream)[]) => void;
  updateNewLimitedStreamsIDs: (ids: string[]) => void;
  updateOldSoundIds: (ids: string[]) => void;

  // mediasfu functions
  onScreenChanges: OnScreenChangesType;
  reorderStreams: ReorderStreamsType;
  changeVids: ChangeVidsType;

  getUpdatedAllParams: () => ReUpdateInterParameters;
  [key: string]: any;
}

export interface ReUpdateInterOptions {
  name: string;
  add?: boolean;
  force?: boolean;
  average?: number;
  parameters: ReUpdateInterParameters;
}

export type ReUpdateInterType = (options: ReUpdateInterOptions) => Promise<void>;

export async function reUpdateInter(options: ReUpdateInterOptions): Promise<void> {
  await sharedReUpdateInter<ReUpdateInterParameters>(options);
}
