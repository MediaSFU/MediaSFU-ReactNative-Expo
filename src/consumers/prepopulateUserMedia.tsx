import React from 'react';
import MiniCard from '../components/displayComponents/MiniCard';
import VideoCard from '../components/displayComponents/VideoCard';
import AudioCard from '../components/displayComponents/AudioCard';
// import { RTCView } from "../methods/utils/webrtc/webrtc";
import {
  Participant, Stream, AudioCardParameters, EventType,
  CustomVideoCardType, CustomAudioCardType, CustomMiniCardType,
} from '../@types/types';
import type { MediaStream } from '../@types/types';

export interface PrepopulateUserMediaParameters extends AudioCardParameters {

  participants: Participant[];
  allVideoStreams: (Stream | Participant)[];
  islevel: string;
  member: string;
  shared: boolean;
  shareScreenStarted: boolean;
  eventType: EventType;
  screenId?: string;
  forceFullDisplay: boolean;
  updateMainWindow: boolean;
  mainScreenFilled: boolean;
  adminOnMainScreen: boolean;
  mainScreenPerson: string;
  videoAlreadyOn: boolean;
  audioAlreadyOn: boolean;
  oldAllStreams: (Stream | Participant)[];
  checkOrientation: () => string;
  screenForceFullDisplay: boolean;
  localStreamScreen: MediaStream | null;
  remoteScreenStream: Stream[];
  localStreamVideo: MediaStream | null;
  mainHeightWidth: number;
  isWideScreen: boolean;
  localUIMode: boolean;
  whiteboardStarted: boolean;
  whiteboardEnded: boolean;
  virtualStream: MediaStream | null;
  keepBackground: boolean;
  annotateScreenStream: boolean;
  updateMainScreenPerson: (person: string) => void;
  updateMainScreenFilled: (filled: boolean) => void;
  updateAdminOnMainScreen: (admin: boolean) => void;
  updateMainHeightWidth: (heightWidth: number) => void;
  updateScreenForceFullDisplay: (force: boolean) => void;
  updateUpdateMainWindow: (update: boolean) => void;
  updateMainGridStream: (components: JSX.Element[]) => void;

  // custom components
  customVideoCard?: CustomVideoCardType;
  customAudioCard?: CustomAudioCardType;
  customMiniCard?: CustomMiniCardType;

  // Override-provided component references
  videoCardComponent?: React.ComponentType<React.ComponentProps<typeof VideoCard>>;
  audioCardComponent?: React.ComponentType<React.ComponentProps<typeof AudioCard>>;
  miniCardComponent?: React.ComponentType<React.ComponentProps<typeof MiniCard>>;

  // mediasfu functions
  getUpdatedAllParams: () => PrepopulateUserMediaParameters;
  [key: string]: any;
}

export interface PrepopulateUserMediaOptions {
  name: string;
  parameters: PrepopulateUserMediaParameters;
}

// Export the type definition for the function
export type PrepopulateUserMediaType = (options: PrepopulateUserMediaOptions) => Promise<JSX.Element[] | void>;

/**
 * Processes consumer transports by pausing and resuming them based on certain conditions.
 *
 * @param {Object} options - The options for processing consumer transports.
 * @param {Array} options.consumerTransports - The list of consumer transports to process.
 * @param {Array} options.lStreams_ - The list of local streams.
 * @param {Object} options.parameters - The parameters object containing various stream arrays and utility functions.
 *
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 *
 * @throws {Error} - Throws an error if there is an issue processing consumer transports.
 *
 * The function performs the following steps:
 * 1. Destructures and updates the parameters.
 * 2. Defines a helper function to check if a producerId is valid in given stream arrays.
 * 3. Filters consumer transports to resume based on certain conditions.
 * 4. Filters consumer transports to pause based on certain conditions.
 * 5. Pauses consumer transports after a short delay.
 * 6. Emits `consumer-pause` event for each filtered transport (not audio).
 * 7. Emits `consumer-resume` event for each filtered transport (not audio).
 *
 * @example
 * ```typescript
 * await processConsumerTransports({
 *   consumerTransports: [transport1, transport2],
 *   lStreams_: [stream1, stream2],
 *   parameters: {
 *     remoteScreenStream: [],
 *     oldAllStreams: [],
 *     newLimitedStreams: [],
 *     sleep: sleepFunction,
 *     getUpdatedAllParams: () => parameters,
 *   },
 * });
 * ```
 */

export async function prepopulateUserMedia({
  name,
  parameters,
}: PrepopulateUserMediaOptions): Promise<JSX.Element[] | void> {
  try {
    // Destructure parameters

    const { getUpdatedAllParams } = parameters;
    parameters = getUpdatedAllParams();

    let {
      participants,
      allVideoStreams,
      islevel,
      member,
      shared,
      shareScreenStarted,
      eventType,
      screenId,
      forceFullDisplay,
      updateMainWindow,
      mainScreenFilled,
      adminOnMainScreen,
      mainScreenPerson,
      videoAlreadyOn,
      audioAlreadyOn,
      oldAllStreams,
      checkOrientation,
      screenForceFullDisplay,

      localStreamScreen,
      remoteScreenStream,
      localStreamVideo,
      mainHeightWidth,
      isWideScreen,
      localUIMode,
      whiteboardStarted,
      whiteboardEnded,

      virtualStream,
      keepBackground,
      annotateScreenStream,

      updateMainScreenPerson,
      updateMainScreenFilled,
      updateAdminOnMainScreen,
      updateMainHeightWidth,
      updateScreenForceFullDisplay,
      updateUpdateMainWindow,
      updateMainGridStream,

      customVideoCard,
      customAudioCard,
      customMiniCard,
      videoCardComponent,
      audioCardComponent,
      miniCardComponent,
    } = parameters;

    const VideoCardComponentOverride =
      (videoCardComponent ?? VideoCard) as React.ComponentType<React.ComponentProps<typeof VideoCard>>;
    const AudioCardComponentOverride =
      (audioCardComponent ?? AudioCard) as React.ComponentType<React.ComponentProps<typeof AudioCard>>;
    const MiniCardComponentOverride =
      (miniCardComponent ?? MiniCard) as React.ComponentType<React.ComponentProps<typeof MiniCard>>;

    const buildVideoCard = ({
      key,
      videoStream,
      remoteProducerId = "",
      eventType: cardEventType,
      forceFullDisplay: cardForceFullDisplay = false,
      customStyle,
      participant: cardParticipant,
      backgroundColor,
      showControls = false,
      showInfo = true,
      name = "",
      doMirror = false,
    }: {
      key: string;
      videoStream: MediaStream | null;
      remoteProducerId?: string;
      eventType: EventType;
      forceFullDisplay?: boolean;
      customStyle?: React.CSSProperties;
      participant: Participant;
      backgroundColor?: string;
      showControls?: boolean;
      showInfo?: boolean;
      name?: string;
      doMirror?: boolean;
    }) => {
      if (customVideoCard) {
        return React.createElement(customVideoCard as any, {
          key,
          videoStream: videoStream || new MediaStream(),
          remoteProducerId,
          eventType: cardEventType,
          forceFullDisplay: cardForceFullDisplay,
          customStyle,
          participant: cardParticipant,
          backgroundColor,
          showControls,
          showInfo,
          name,
          doMirror,
          parameters,
        });
      }

      return (
        <VideoCardComponentOverride
          key={key}
          videoStream={videoStream}
          remoteProducerId={remoteProducerId}
          eventType={cardEventType}
          forceFullDisplay={cardForceFullDisplay}
          customStyle={customStyle as any}
          participant={cardParticipant}
          backgroundColor={backgroundColor}
          showControls={showControls}
          showInfo={showInfo}
          name={name}
          doMirror={doMirror}
          parameters={parameters}
        />
      );
    };

    const buildAudioCard = ({
      key,
      name,
      barColor = "red",
      textColor = "white",
      customStyle,
      roundedImage = true,
      backgroundColor = "transparent",
      participant: cardParticipant,
    }: {
      key: string;
      name: string;
      barColor?: string;
      textColor?: string;
      customStyle?: React.CSSProperties;
      roundedImage?: boolean;
      backgroundColor?: string;
      participant: Participant;
    }) => {
      if (customAudioCard) {
        return React.createElement(customAudioCard as any, {
          key,
          name,
          barColor,
          textColor,
          imageSource: "",
          roundedImage,
          imageStyle: {},
          parameters,
        });
      }

      return (
        <AudioCardComponentOverride
          key={key}
          name={name}
          barColor={barColor}
          textColor={textColor}
          customStyle={customStyle as any}
          controlsPosition="topLeft"
          infoPosition="topRight"
          roundedImage={roundedImage}
          parameters={parameters}
          showControls={false}
          backgroundColor={backgroundColor}
          participant={cardParticipant}
        />
      );
    };

    const buildMiniCard = ({
      key,
      initials,
      fontSize = 20,
      borderColor,
    }: {
      key: string;
      initials: string;
      fontSize?: number;
      borderColor?: string;
    }) => {
      if (customMiniCard) {
        return React.createElement(customMiniCard as any, {
          key,
          initials,
          fontSize: `${fontSize}px`,
          name: initials,
          showVideoIcon: false,
          showAudioIcon: false,
          imageSource: "",
          roundedImage: true,
          imageStyle: {},
          parameters,
        });
      }

      return (
        <MiniCardComponentOverride
          key={key}
          initials={initials}
          fontSize={fontSize}
          customStyle={{
            backgroundColor: "transparent",
            borderColor: borderColor,
          } as any}
        />
      );
    };

    // If the event type is 'chat', return early
    if (eventType == 'chat') {
      return;
    }

    // Initialize variables
    let host: Participant | null = null;
    let hostStream: any;
    const newComponent: JSX.Element[] = [];

    // Check if screen sharing is started or shared
    if (shareScreenStarted || shared) {
      // Handle main grid visibility based on the event type
      if (eventType == 'conference') {
        if (shared || shareScreenStarted) {
          if (mainHeightWidth == 0) {
            // Add the main grid if not present
            updateMainHeightWidth(84);
          }
        } else {
          // Remove the main grid if not shared or started
          updateMainHeightWidth(0);
        }
      }

      // Switch display to optimize for screen share
      screenForceFullDisplay = forceFullDisplay;

      updateScreenForceFullDisplay(screenForceFullDisplay);

      // Get the orientation and adjust forceFullDisplay
      const orientation = checkOrientation();
      if (orientation == 'portrait' || !isWideScreen) {
        if (shareScreenStarted || shared) {
          screenForceFullDisplay = false;
          updateScreenForceFullDisplay(screenForceFullDisplay);
        }
      }

      // Check if the user is sharing the screen
      if (shared) {
        // User is sharing
        host = { name: member, audioID: '', videoID: '' };
        hostStream = localStreamScreen;

        // Update admin on the main screen
        adminOnMainScreen = islevel == '2';
        updateAdminOnMainScreen(adminOnMainScreen);

        // Update main screen person
        mainScreenPerson = host!.name || '';
        updateMainScreenPerson(mainScreenPerson);
      } else {
        // someone else is sharing
        host = participants.find(
          (participant: Participant) => participant.ScreenID == screenId && participant.ScreenOn == true,
        ) ?? null;

        if (whiteboardStarted && !whiteboardEnded) {
          host = {
            name: 'WhiteboardActive', islevel: '2', audioID: '', videoID: '',
          };
          hostStream = { producerId: 'WhiteboardActive' };
        }

        if (host == null) {
          // remoteScreenStream
          host = participants.find(
            (participant: Participant) => participant.ScreenOn == true,
          ) ?? null;
        }

        // check remoteScreenStream
        if (host != null && !host?.name!.includes('WhiteboardActive')) {
          if (remoteScreenStream.length == 0) {
            hostStream = allVideoStreams.find(
              (stream: (Stream | Participant)) => stream.producerId == host?.ScreenID,
            ) ?? null;
          } else {
            hostStream = remoteScreenStream[0];
          }
        }

        // Update admin on the main screen
        adminOnMainScreen = (host && host.islevel == '2') ?? false;
        updateAdminOnMainScreen(adminOnMainScreen);

        // Update main screen person
        mainScreenPerson = host?.name ?? '';
        updateMainScreenPerson(mainScreenPerson);
      }
    } else {
      // Screen share not started
      if (eventType == 'conference') {
        // No main grid for conferences
        return;
      }

      // Find the host with level '2'
      host = participants.find((participant: Participant) => participant.islevel == '2') ?? null;

      // Update main screen person
      mainScreenPerson = host?.name ?? '';
      updateMainScreenPerson(mainScreenPerson);
    }

    // If host is not null, check if host videoIsOn
    if (host) {
      // Populate the main screen with the host video
      if (shareScreenStarted || shared) {
        forceFullDisplay = screenForceFullDisplay;
        if (whiteboardStarted && !whiteboardEnded) {
          // Whiteboard is active
        } else {
          newComponent.push(
            buildVideoCard({
              key: host.ScreenID!,
              videoStream: shared ? hostStream : hostStream!.stream ?? null,
              remoteProducerId: host.ScreenID!,
              eventType: eventType,
              forceFullDisplay: annotateScreenStream && shared ? false : forceFullDisplay,
              customStyle: {
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              },
              participant: host,
              backgroundColor: "rgba(217, 227, 234, 0.99)",
              showControls: false,
              showInfo: true,
              name: host.name || '',
              doMirror: false,
            }),
          );
        }

        updateMainGridStream(newComponent);

        mainScreenFilled = true;
        updateMainScreenFilled(mainScreenFilled);
        adminOnMainScreen = host.islevel == '2';
        updateAdminOnMainScreen(adminOnMainScreen);
        mainScreenPerson = host.name ?? '';
        updateMainScreenPerson(mainScreenPerson);

        return newComponent;
      }

      // Check if video is already on or not
      if (
        (islevel != '2' && !host.videoOn)
        || (islevel == '2' && (!host.videoOn || !videoAlreadyOn))
        || localUIMode == true
      ) {
        // Video is off
        if (islevel == '2' && videoAlreadyOn) {
          // Admin's video is on
          newComponent.push(
            buildVideoCard({
              key: host.videoID!,
              videoStream: keepBackground && virtualStream
                ? virtualStream
                : localStreamVideo!,
              remoteProducerId: host.videoID || '',
              eventType: eventType,
              forceFullDisplay: forceFullDisplay,
              customStyle: {
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              },
              participant: host,
              backgroundColor: "rgba(217, 227, 234, 0.99)",
              showControls: false,
              showInfo: true,
              name: host.name || '',
              doMirror: true,
            }),
          );

          updateMainGridStream(newComponent);

          mainScreenFilled = true;
          updateMainScreenFilled(mainScreenFilled);
          adminOnMainScreen = true;
          updateAdminOnMainScreen(adminOnMainScreen);
          mainScreenPerson = host.name ?? '';
          updateMainScreenPerson(mainScreenPerson);
        } else {
          // Video is off and not admin
          let audOn;

          if (islevel == '2' && audioAlreadyOn) {
            audOn = true;
          } else if (host != null && islevel != '2') {
            audOn = host.muted == false;
          }

          if (audOn) {
            // Audio is on
            try {
              newComponent.push(
                buildAudioCard({
                  key: host.name!,
                  name: host.name || '',
                  barColor: "red",
                  textColor: "white",
                  customStyle: {
                    backgroundColor: 'transparent',
                    borderWidth: eventType !== 'broadcast' ? 2 : 0,
                    borderColor: 'black',
                  },
                  roundedImage: true,
                  backgroundColor: "transparent",
                  participant: host,
                }),
              );

              updateMainGridStream(newComponent);
            } catch {
              // Handle audio card creation error
            }

            mainScreenFilled = true;
            updateMainScreenFilled(mainScreenFilled);
            adminOnMainScreen = islevel == '2';
            updateAdminOnMainScreen(adminOnMainScreen);
            mainScreenPerson = host.name ?? '';
            updateMainScreenPerson(mainScreenPerson);
          } else {
            // Audio is off
            try {
              newComponent.push(
                buildMiniCard({
                  key: name,
                  initials: name,
                  fontSize: 20,
                  borderColor: eventType !== 'broadcast' ? 'black' : undefined,
                }),
              );

              updateMainGridStream(newComponent);
            } catch {
              // Handle mini card creation error
            }

            mainScreenFilled = false;
            updateMainScreenFilled(mainScreenFilled);
            adminOnMainScreen = islevel == '2';
            updateAdminOnMainScreen(adminOnMainScreen);
            mainScreenPerson = host.name ?? '';
            updateMainScreenPerson(mainScreenPerson);
          }
        }
      } else {
        // Video is on
        if (shareScreenStarted || shared) {
          // Screen share is on
          if (whiteboardStarted && !whiteboardEnded) {
            // Whiteboard is active
          } else {
            try {
              newComponent.push(
                buildVideoCard({
                  key: host.ScreenID!,
                  videoStream: shared ? hostStream : hostStream!.stream ?? null,
                  remoteProducerId: host.ScreenID!,
                  eventType: eventType,
                  forceFullDisplay: forceFullDisplay,
                  customStyle: {
                    borderWidth: eventType !== 'broadcast' ? 2 : 0,
                    borderColor: 'black',
                  },
                  participant: host,
                  backgroundColor: "rgba(217, 227, 234, 0.99)",
                  showControls: false,
                  showInfo: true,
                  name: host.name || '',
                  doMirror: false,
                }),
              );

              updateMainGridStream(newComponent);

              mainScreenFilled = true;
              updateMainScreenFilled(mainScreenFilled);
              adminOnMainScreen = host.islevel == '2';
              updateAdminOnMainScreen(adminOnMainScreen);
              mainScreenPerson = host.name ?? '';
              updateMainScreenPerson(mainScreenPerson);
            } catch {
              // Handle video card creation error
            }
          }
        } else {
          // Screen share is off
          let streame;
          if (islevel == '2') {
            host.stream = keepBackground && virtualStream
              ? virtualStream
              : localStreamVideo;
          } else {
            streame = oldAllStreams.find(
              (streame: (Stream|Participant)) => streame.producerId == host.videoID,
            );
            host.stream = streame && streame.stream;
          }

          try {
            if (host.stream) {
              newComponent.push(
                buildVideoCard({
                  key: host.videoID!,
                  videoStream: host.stream || null,
                  remoteProducerId: host.videoID || '',
                  eventType: eventType,
                  forceFullDisplay: forceFullDisplay,
                  customStyle: {
                    borderWidth: eventType !== 'broadcast' ? 2 : 0,
                    borderColor: 'black',
                  },
                  participant: host,
                  backgroundColor: "rgba(217, 227, 234, 0.99)",
                  showControls: false,
                  showInfo: true,
                  name: host.name || '',
                  doMirror: member == host.name,
                }),
              );

              updateMainGridStream(newComponent);
              mainScreenFilled = true;
              adminOnMainScreen = host.islevel == '2';
              mainScreenPerson = host.name ?? '';
            } else {
              newComponent.push(
                buildMiniCard({
                  key: name,
                  initials: name,
                  fontSize: 20,
                  borderColor: eventType !== 'broadcast' ? 'black' : undefined,
                }),
              );

              updateMainGridStream(newComponent);
              mainScreenFilled = false;
              adminOnMainScreen = islevel == '2';
              mainScreenPerson = host.name ?? '';
            }

            updateMainScreenFilled(mainScreenFilled);

            updateAdminOnMainScreen(adminOnMainScreen);

            updateMainScreenPerson(mainScreenPerson);
          } catch {
            // Handle video card creation error
          }
        }
      }
    } else {
      // Host is null, add a mini card
      try {
        newComponent.push(
          buildMiniCard({
            key: name,
            initials: name,
            fontSize: 20,
            borderColor: eventType !== 'broadcast' ? 'black' : undefined,
          }),
        );

        updateMainGridStream(newComponent);

        mainScreenFilled = false;
        adminOnMainScreen = false;
        mainScreenPerson = '';
        updateMainScreenFilled(mainScreenFilled);
        updateAdminOnMainScreen(adminOnMainScreen);
        updateMainScreenPerson(mainScreenPerson);
      } catch {
        // Handle mini card creation error
      }
    }

    updateMainWindow = false;
    updateUpdateMainWindow(updateMainWindow);

    return newComponent;
  } catch {
    // Handle errors during the process of preparing and populating the main screen
    // throw error;
  }
}
