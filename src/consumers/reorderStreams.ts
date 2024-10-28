import {
  Participant, Stream, ChangeVidsParameters, ChangeVidsType,
} from '../@types/types';

export interface ReorderStreamsParameters extends ChangeVidsParameters {
  allVideoStreams: (Stream | Participant)[];
  participants: Participant[];
  oldAllStreams: (Stream | Participant)[];
  screenId?: string;
  adminVidID?: string;
  newLimitedStreams: (Stream | Participant)[];
  newLimitedStreamsIDs: string[];
  activeSounds: string[];
  screenShareIDStream?: string;
  screenShareNameStream?: string;
  adminIDStream?: string;
  adminNameStream?: string;
  updateNewLimitedStreams: (streams: (Stream | Participant)[]) => void;
  updateNewLimitedStreamsIDs: (ids: string[]) => void;
  updateActiveSounds: (sounds: string[]) => void;
  updateScreenShareIDStream: (id: string) => void;
  updateScreenShareNameStream: (name: string) => void;
  updateAdminIDStream: (id: string) => void;
  updateAdminNameStream: (name: string) => void;
  updateYouYouStream: (streams: (Stream | Participant)[]) => void;

  // mediasfu functions
  changeVids: ChangeVidsType;
  getUpdatedAllParams: () => ReorderStreamsParameters;
  [key: string]: any;
}

export interface ReorderStreamsOptions {
  add?: boolean;
  screenChanged?: boolean;
  parameters: ReorderStreamsParameters;
}

export type ReorderStreamsType = (options: ReorderStreamsOptions) => Promise<void>;

/**
 * Reorders the video streams based on the provided options and updates the UI accordingly.
 *
 * @param {Object} options - The options for reordering streams.
 * @param {boolean} [options.add=false] - Whether to add new streams or not.
 * @param {boolean} [options.screenChanged=false] - Whether the screen has changed or not.
 * @param {ReorderStreamsOptions} options.parameters - The parameters required for reordering streams.
 *
 * @returns {Promise<void>} A promise that resolves when the reordering is complete.
 *
 * @typedef {Object} ReorderStreamsOptions
 * @property {Function} getUpdatedAllParams - Function to get updated parameters.
 * @property {Array} allVideoStreams - Array of all video streams.
 * @property {Array} participants - Array of participants.
 * @property {Array} oldAllStreams - Array of old streams.
 * @property {string} screenId - ID of the screen.
 * @property {string} adminVidID - ID of the admin video.
 * @property {Array} newLimitedStreams - Array of new limited streams.
 * @property {Array} newLimitedStreamsIDs - Array of new limited stream IDs.
 * @property {Array} activeSounds - Array of active sounds.
 * @property {string} screenShareIDStream - ID of the screen share stream.
 * @property {string} screenShareNameStream - Name of the screen share stream.
 * @property {string} adminIDStream - ID of the admin stream.
 * @property {string} adminNameStream - Name of the admin stream.
 * @property {Function} updateNewLimitedStreams - Function to update new limited streams.
 * @property {Function} updateNewLimitedStreamsIDs - Function to update new limited stream IDs.
 * @property {Function} updateActiveSounds - Function to update active sounds.
 * @property {Function} updateScreenShareIDStream - Function to update screen share ID stream.
 * @property {Function} updateScreenShareNameStream - Function to update screen share name stream.
 * @property {Function} updateAdminIDStream - Function to update admin ID stream.
 * @property {Function} updateAdminNameStream - Function to update admin name stream.
 * @property {Function} updateYouYouStream - Function to update YouYou stream.
 * @property {Function} changeVids - Function to reflect changes on the UI.
 */
export const reorderStreams = async ({
  add = false,
  screenChanged = false,
  parameters,
}: ReorderStreamsOptions): Promise<void> => {
  const { getUpdatedAllParams } = parameters;
  parameters = getUpdatedAllParams();

  let {
    allVideoStreams,
    participants,
    oldAllStreams,
    screenId,
    adminVidID,
    newLimitedStreams,
    newLimitedStreamsIDs,
    activeSounds,
    screenShareIDStream,
    screenShareNameStream,
    adminIDStream,
    adminNameStream,
    updateNewLimitedStreams,
    updateNewLimitedStreamsIDs,
    updateActiveSounds,
    updateScreenShareIDStream,
    updateScreenShareNameStream,
    updateAdminIDStream,
    updateAdminNameStream,
    updateYouYouStream,

    // mediasfu functions
    changeVids,
  } = parameters;

  // function to reorder streams on the ui
  if (!add) {
    newLimitedStreams = [];
    newLimitedStreamsIDs = [];
    activeSounds = [];
  }

  const youyou = allVideoStreams.filter((stream) => stream.producerId === 'youyou');
  const admin = participants.filter((participant) => participant.islevel === '2');

  if (admin.length > 0) {
    adminVidID = admin[0].videoID;
  } else {
    adminVidID = '';
  }

  if (adminVidID) {
    const adminStream = allVideoStreams.find((stream) => stream.producerId === adminVidID);

    if (!add) {
      newLimitedStreams = [...newLimitedStreams, ...youyou];
      newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...youyou.map((stream) => stream.producerId)];
    } else {
      const youyouStream = newLimitedStreams.find((stream) => stream.producerId === 'youyou');

      if (!youyouStream) {
        newLimitedStreams = [...newLimitedStreams, ...youyou];
        newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...youyou.map((stream) => stream.producerId)];
      }
    }

    if (adminStream) {
      adminIDStream = adminVidID;

      if (!add) {
        newLimitedStreams = [...newLimitedStreams, adminStream];
        newLimitedStreamsIDs = [...newLimitedStreamsIDs, adminStream.producerId];
      } else {
        const adminStreamer = newLimitedStreams.find((stream) => stream.producerId === adminVidID);

        if (!adminStreamer) {
          newLimitedStreams = [...newLimitedStreams, adminStream];
          newLimitedStreamsIDs = [...newLimitedStreamsIDs, adminStream.producerId];
        }
      }
    } else {
      const oldAdminStream = oldAllStreams.find((stream) => stream.producerId === adminVidID);

      if (oldAdminStream) {
        // add it to the allVideoStream

        adminIDStream = adminVidID;
        adminNameStream = admin[0].name;

        if (!add) {
          newLimitedStreams = [...newLimitedStreams, oldAdminStream];
          newLimitedStreamsIDs = [...newLimitedStreamsIDs, oldAdminStream.producerId];
        } else {
          const adminStreamer = newLimitedStreams.find((stream) => stream.producerId === adminVidID);

          if (!adminStreamer) {
            newLimitedStreams = [...newLimitedStreams, oldAdminStream];
            newLimitedStreamsIDs = [...newLimitedStreamsIDs, oldAdminStream.producerId];
          }
        }
      }
    }

    const screenParticipant = participants.filter((participant) => participant.ScreenID === screenId);

    if (screenParticipant.length > 0) {
      const screenParticipantVidID = screenParticipant[0].videoID;
      const screenParticipantVidID_ = newLimitedStreams.filter((stream) => stream.producerId === screenParticipantVidID);

      if (screenParticipantVidID_?.length < 1 && screenParticipantVidID) {
        screenShareIDStream = screenParticipantVidID;
        screenShareNameStream = screenParticipant[0].name;
        const screenParticipantVidID__ = allVideoStreams.filter((stream) => stream.producerId === screenParticipantVidID);
        newLimitedStreams = [...newLimitedStreams, ...screenParticipantVidID__];
        newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...screenParticipantVidID__.map((stream) => stream.producerId)];
      }
    }
  } else {
    if (!add) {
      newLimitedStreams = [...newLimitedStreams, ...youyou];
      newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...youyou.map((stream) => stream.producerId)];
    } else {
      const youyouStream = newLimitedStreams.find((stream) => stream.producerId === 'youyou');

      if (!youyouStream) {
        newLimitedStreams = [...newLimitedStreams, ...youyou];
        newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...youyou.map((stream) => stream.producerId)];
      }
    }

    const screenParticipant = participants.filter((participant) => participant.ScreenID === screenId);

    if (screenParticipant.length > 0) {
      const screenParticipantVidID = screenParticipant[0].videoID;
      const screenParticipantVidID_ = newLimitedStreams.filter((stream) => stream.producerId === screenParticipantVidID);

      if (screenParticipantVidID_?.length < 1 && screenParticipantVidID) {
        screenShareIDStream = screenParticipantVidID;
        screenShareNameStream = screenParticipant[0].name;
        const screenParticipantVidID__ = allVideoStreams.filter((stream) => stream.producerId === screenParticipantVidID);
        newLimitedStreams = [...newLimitedStreams, ...screenParticipantVidID__];
        newLimitedStreamsIDs = [...newLimitedStreamsIDs, ...screenParticipantVidID__.map((stream) => stream.producerId)];
      }
    }
  }

  updateNewLimitedStreams(newLimitedStreams);
  updateNewLimitedStreamsIDs(newLimitedStreamsIDs);
  updateActiveSounds(activeSounds);
  updateScreenShareIDStream(screenShareIDStream!);
  updateScreenShareNameStream(screenShareNameStream!);
  updateAdminIDStream(adminIDStream!);
  updateAdminNameStream(adminNameStream!);
  updateYouYouStream(youyou);

  // reflect the changes on the ui
  await changeVids({ screenChanged, parameters });
};
