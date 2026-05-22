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
import { buildMainHostCardPlan, buildMainScreenState, buildPrepopulateUserMediaPlan, buildScreenShareHostCardPlan } from 'mediasfu-shared';

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

  translationTranscripts?: Array<{
    speakerId?: string;
    speakerName?: string;
    translatedText?: string;
    originalText?: string;
    timestamp?: number;
  }>;
  showSubtitlesOnCards?: boolean;

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
 * Populates the main screen grid with participant video/audio cards based on current streams and settings.
 * 
 * This function is responsible for rendering the main user media grid, supporting both custom render functions
 * and component overrides for comprehensive UI customization. It implements a two-tier override system:
 * 1. Custom render functions (customVideoCard, customAudioCard, customMiniCard) - Full rendering control
 * 2. Component overrides (videoCardComponent, audioCardComponent, miniCardComponent) - Component replacement
 *
 * The function intelligently determines which type of card to display (video, audio, or mini) based on
 * participant media state and event configuration, then uses helper functions to properly invoke custom
 * render functions or render component overrides.
 *
 * @function
 * @async
 * @param {PrepopulateUserMediaOptions} options - The options for populating user media.
 * @param {string} options.name - The name identifier for the operation.
 * @param {PrepopulateUserMediaParameters} options.parameters - Configuration and state parameters.
 * @param {Array<Participant>} options.parameters.participants - List of all participants in the session.
 * @param {Array<Stream|Participant>} options.parameters.allVideoStreams - All available video streams.
 * @param {string} options.parameters.islevel - The user's participation level ('0', '1', '2').
 * @param {string} options.parameters.member - The current user's name/identifier.
 * @param {boolean} options.parameters.shared - Whether screen sharing is active.
 * @param {boolean} options.parameters.shareScreenStarted - Whether screen share has been initiated.
 * @param {EventType} options.parameters.eventType - Type of event ('chat', 'broadcast', 'conference', 'webinar').
 * @param {string} [options.parameters.screenId] - ID of the screen sharing participant.
 * @param {boolean} options.parameters.forceFullDisplay - Force full screen display mode.
 * @param {boolean} options.parameters.updateMainWindow - Whether to update the main window.
 * @param {boolean} options.parameters.mainScreenFilled - Whether main screen is occupied.
 * @param {boolean} options.parameters.adminOnMainScreen - Whether admin is on main screen.
 * @param {string} options.parameters.mainScreenPerson - Name of person on main screen.
 * @param {boolean} options.parameters.videoAlreadyOn - Whether user's video is active.
 * @param {boolean} options.parameters.audioAlreadyOn - Whether user's audio is active.
 * @param {Array<Stream|Participant>} options.parameters.oldAllStreams - Previous stream state for comparison.
 * @param {Function} options.parameters.checkOrientation - Function to check device orientation.
 * @param {boolean} options.parameters.screenForceFullDisplay - Force full display for screen share.
 * @param {MediaStream|null} options.parameters.localStreamScreen - Local screen share stream.
 * @param {Array<Stream>} options.parameters.remoteScreenStream - Remote screen share streams.
 * @param {MediaStream|null} options.parameters.localStreamVideo - Local video stream.
 * @param {number} options.parameters.mainHeightWidth - Main screen height/width value.
 * @param {boolean} options.parameters.isWideScreen - Whether display is wide screen.
 * @param {boolean} options.parameters.localUIMode - Whether in local UI development mode.
 * @param {boolean} options.parameters.whiteboardStarted - Whether whiteboard is active.
 * @param {boolean} options.parameters.whiteboardEnded - Whether whiteboard has ended.
 * @param {MediaStream|null} options.parameters.virtualStream - Virtual background stream.
 * @param {boolean} options.parameters.keepBackground - Whether to keep virtual background.
 * @param {boolean} options.parameters.annotateScreenStream - Whether screen annotation is active.
 * 
 * **Custom UI & Component Overrides:**
 * @param {CustomVideoCardType} [options.parameters.customVideoCard] - Custom render function for video cards.
 *   This function receives all video card props and should return a React element. Use React.createElement
 *   internally to invoke this function with proper props.
 *   @example
 *   const customVideoCard = ({ participant, videoStream, showControls }) => (
 *     <View><Text>{participant.name}</Text></View>
 *   );
 * 
 * @param {CustomAudioCardType} [options.parameters.customAudioCard] - Custom render function for audio cards.
 *   Receives audio card props and returns a React element for audio-only participants.
 *   @example
 *   const customAudioCard = ({ participant, showWaveform }) => (
 *     <View><Text>🎤 {participant.name}</Text></View>
 *   );
 * 
 * @param {CustomMiniCardType} [options.parameters.customMiniCard] - Custom render function for mini cards.
 *   Receives mini card props and returns a React element for minimized participant views.
 *   @example
 *   const customMiniCard = ({ participant }) => (
 *     <View style={{ width: 50, height: 50 }}><Text>{participant.name[0]}</Text></View>
 *   );
 * 
 * @param {React.ComponentType} [options.parameters.videoCardComponent] - Component override for VideoCard.
 *   Replaces the default VideoCard component entirely. The component receives the same props as VideoCard.
 *   @example
 *   import { MyCustomVideoCard } from './components/MyCustomVideoCard';
 *   // Pass: videoCardComponent: MyCustomVideoCard
 * 
 * @param {React.ComponentType} [options.parameters.audioCardComponent] - Component override for AudioCard.
 *   Replaces the default AudioCard component entirely.
 * 
 * @param {React.ComponentType} [options.parameters.miniCardComponent] - Component override for MiniCard.
 *   Replaces the default MiniCard component entirely.
 *
 * @param {Function} options.parameters.updateMainScreenPerson - Callback to update main screen person.
 * @param {Function} options.parameters.updateMainScreenFilled - Callback to update main screen filled state.
 * @param {Function} options.parameters.updateAdminOnMainScreen - Callback to update admin on main screen state.
 * @param {Function} options.parameters.updateMainHeightWidth - Callback to update main screen dimensions.
 * @param {Function} options.parameters.updateScreenForceFullDisplay - Callback to update screen force full display.
 * @param {Function} options.parameters.updateUpdateMainWindow - Callback to update main window state.
 * @param {Function} options.parameters.updateMainGridStream - Callback to update main grid with new components.
 * @param {Function} options.parameters.getUpdatedAllParams - Function to retrieve updated parameters.
 *
 * @returns {Promise<JSX.Element[]|void>} Array of React elements representing participant cards, or void.
 *
 * @throws {Error} Throws error if there's an issue processing streams or rendering components.
 *
 * @example
 * // Basic usage without customization
 * import { prepopulateUserMedia } from 'mediasfu-reactnative-expo';
 *
 * const components = await prepopulateUserMedia({
 *   name: 'mainGrid',
 *   parameters: {
 *     participants: allParticipants,
 *     allVideoStreams: videoStreams,
 *     eventType: 'conference',
 *     islevel: '2',
 *     member: 'John Doe',
 *     // ... other required parameters
 *   },
 * });
 *
 * @example
 * // Using custom render functions for full control
 * import { prepopulateUserMedia } from 'mediasfu-reactnative-expo';
 * 
 * const CustomVideo = ({ participant, videoStream }) => (
 *   <View style={{ borderWidth: 3, borderColor: 'gold' }}>
 *     <Text style={{ fontSize: 20 }}>{participant.name}</Text>
 *     {/* Custom video rendering *\/}
 *   </View>
 * );
 *
 * const components = await prepopulateUserMedia({
 *   name: 'mainGrid',
 *   parameters: {
 *     participants: allParticipants,
 *     customVideoCard: CustomVideo,
 *     customAudioCard: CustomAudio,
 *     customMiniCard: CustomMini,
 *     eventType: 'conference',
 *     // ... other parameters
 *   },
 * });
 *
 * @example
 * // Using component overrides to replace defaults
 * import { prepopulateUserMedia } from 'mediasfu-reactnative-expo';
 * import { MyVideoCard, MyAudioCard, MyMiniCard } from './custom-components';
 *
 * const components = await prepopulateUserMedia({
 *   name: 'mainGrid',
 *   parameters: {
 *     participants: allParticipants,
 *     videoCardComponent: MyVideoCard,
 *     audioCardComponent: MyAudioCard,
 *     miniCardComponent: MyMiniCard,
 *     eventType: 'webinar',
 *     // ... other parameters
 *   },
 * });
 *
 * @example
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
      translationTranscripts = [],
      showSubtitlesOnCards = true,
    } = parameters;

    const getSubtitleForSpeaker = (
      speakerId: string,
      speakerName?: string,
    ): string | null => {
      if (!showSubtitlesOnCards || !Array.isArray(translationTranscripts)) {
        return null;
      }

      const now = Date.now();
      const ttlMs = 8000;
      for (let i = translationTranscripts.length - 1; i >= 0; i -= 1) {
        const entry = translationTranscripts[i];

        if (!entry) continue;
        const matches =
          (speakerId && entry.speakerId === speakerId)
          || (speakerName && entry.speakerName === speakerName);
        if (!matches) continue;

        if (!entry.timestamp || now - entry.timestamp > ttlMs) {
          continue;
        }

        return entry.translatedText || entry.originalText || null;
      }

      return null;
    };

    const VideoCardComponentOverride =
      (videoCardComponent ?? VideoCard) as React.ComponentType<React.ComponentProps<typeof VideoCard>>;
    const AudioCardComponentOverride =
      (audioCardComponent ?? AudioCard) as React.ComponentType<React.ComponentProps<typeof AudioCard>>;
    const MiniCardComponentOverride =
      (miniCardComponent ?? MiniCard) as React.ComponentType<React.ComponentProps<typeof MiniCard>>;
    const isDarkMode = typeof parameters?.isDarkModeValue === 'boolean'
      ? parameters.isDarkModeValue
      : true;
    const participantCardTextColor = isDarkMode ? '#f8fafc' : '#0f172a';

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
      const subtitle = getSubtitleForSpeaker(
        cardParticipant.id || '',
        cardParticipant.name,
      );

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
          liveSubtitleText: subtitle,
          showSubtitles: showSubtitlesOnCards,
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
          liveSubtitleText={subtitle}
          showSubtitles={showSubtitlesOnCards}
          {...({ parameters } as any)}
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
      const subtitle = getSubtitleForSpeaker(
        cardParticipant.id || '',
        cardParticipant.name,
      );

      if (customAudioCard) {
        return React.createElement(customAudioCard as any, {
          key,
          name,
          barColor,
          textColor,
          imageSource: "",
          roundedImage,
          imageStyle: {},
          liveSubtitleText: subtitle,
          showSubtitles: showSubtitlesOnCards,
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
          liveSubtitleText={subtitle}
          showSubtitles={showSubtitlesOnCards}
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
          fontSize,
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
          parameters={parameters}
        />
      );
    };

    const applyMainScreenState = ({
      filled,
      adminOnMainScreen: nextAdminOnMainScreen,
      mainScreenPerson: nextMainScreenPerson,
    }: {
      filled: boolean;
      adminOnMainScreen: boolean;
      mainScreenPerson: string;
    }) => {
      mainScreenFilled = filled;
      adminOnMainScreen = nextAdminOnMainScreen;
      mainScreenPerson = nextMainScreenPerson;

      updateMainScreenFilled(mainScreenFilled);
      updateAdminOnMainScreen(adminOnMainScreen);
      updateMainScreenPerson(mainScreenPerson);
    };

    const renderMainHostCard = ({
      plan,
      host,
    }: {
      plan: ReturnType<typeof buildMainHostCardPlan<Stream>>;
      host: Participant;
    }) => {
      if (plan.kind === 'audio') {
        try {
          newComponent.push(
            buildAudioCard({
              key: plan.key,
              name: plan.name,
              barColor: "red",
              textColor: participantCardTextColor,
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

        applyMainScreenState(plan.state);
        return;
      }

      if (plan.kind === 'mini') {
        try {
          newComponent.push(
            buildMiniCard({
              key: plan.key,
              initials: plan.initials || name,
              fontSize: 20,
              borderColor: eventType !== 'broadcast' ? 'black' : undefined,
            }),
          );

          updateMainGridStream(newComponent);
        } catch {
          // Handle mini card creation error
        }

        applyMainScreenState(plan.state);
        return;
      }

      try {
        newComponent.push(
          buildVideoCard({
            key: plan.key,
            videoStream: plan.videoStream || null,
            remoteProducerId: plan.remoteProducerId || '',
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
            name: plan.name,
            doMirror: plan.doMirror || false,
          }),
        );

        updateMainGridStream(newComponent);
        applyMainScreenState(plan.state);
      } catch {
        // Handle video card creation error
      }
    };

    const renderNoHostCard = () => {
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

        applyMainScreenState(buildMainScreenState({
          filled: false,
          adminOnMainScreen: false,
          mainScreenPerson: '',
        }));
      } catch {
        // Handle mini card creation error
      }
    };

    // If the event type is 'chat', return early
    if (eventType == 'chat') {
      return;
    }

    // Initialize variables
    let host: Participant | null = null;
    let hostStream: any;
    const newComponent: JSX.Element[] = [];

    const prepopulatePlan = buildPrepopulateUserMediaPlan<Participant, Stream>({
      participants,
      allVideoStreams: allVideoStreams as Stream[],
      member,
      islevel,
      shared,
      shareScreenStarted,
      eventType,
      screenId,
      whiteboardStarted,
      whiteboardEnded,
      remoteScreenStream,
      localStreamScreen,
      checkOrientation,
      isWideScreen,
      forceFullDisplay,
      includeWhiteboardAsScreenFlow: true,
    });

    if (prepopulatePlan.screenFlowActive) {
      if (eventType == 'conference') {
        if (mainHeightWidth == 0) {
          updateMainHeightWidth(84);
        }
      } else if (mainHeightWidth != 84) {
        updateMainHeightWidth(84);
      }
    }

    screenForceFullDisplay = prepopulatePlan.screenForceFullDisplay;
    updateScreenForceFullDisplay(screenForceFullDisplay);

    host = prepopulatePlan.host as Participant | null;
    hostStream = prepopulatePlan.hostStream;

    if (prepopulatePlan.shouldUpdateAdminOnMainScreen) {
      adminOnMainScreen = prepopulatePlan.adminOnMainScreen;
      updateAdminOnMainScreen(adminOnMainScreen);
    }

    mainScreenPerson = prepopulatePlan.mainScreenPerson;
    updateMainScreenPerson(mainScreenPerson);

    if (prepopulatePlan.shouldReturnEarly) {
      return;
    }

    // If host is not null, check if host videoIsOn
    if (host) {
      // Populate the main screen with the host video
      if (shareScreenStarted || shared) {
        forceFullDisplay = screenForceFullDisplay;
        const screenShareHostCardPlan = buildScreenShareHostCardPlan({
          hostName: host.name || '',
          hostScreenID: host.ScreenID,
          hostIsAdmin: host.islevel === '2',
          shared,
          hostStream,
          screenForceFullDisplay,
          annotateScreenStream,
        });

        if (whiteboardStarted && !whiteboardEnded) {
          // Whiteboard is active
        } else {
          newComponent.push(
            buildVideoCard({
              key: screenShareHostCardPlan.key,
              videoStream: screenShareHostCardPlan.videoStream,
              remoteProducerId: screenShareHostCardPlan.remoteProducerId,
              eventType: eventType,
              forceFullDisplay: screenShareHostCardPlan.forceFullDisplay,
              customStyle: {
                borderWidth: eventType !== 'broadcast' ? 2 : 0,
                borderColor: 'black',
              },
              participant: host,
              backgroundColor: "rgba(217, 227, 234, 0.99)",
              showControls: false,
              showInfo: true,
              name: screenShareHostCardPlan.name,
              doMirror: screenShareHostCardPlan.doMirror,
            }),
          );
        }

        updateMainGridStream(newComponent);

        applyMainScreenState(screenShareHostCardPlan.state);

        return newComponent;
      }

      const mainHostCardPlan = buildMainHostCardPlan<Stream>({
        islevel,
        localUIMode,
        videoAlreadyOn,
        audioAlreadyOn,
        hostVideoOn: !!host.videoOn,
        hostMuted: host.muted,
        hostIsAdmin: host.islevel === '2',
        hostName: host.name || '',
        hostVideoID: host.videoID,
        fallbackName: name,
        member,
        keepBackground,
        virtualStream,
        localStreamVideo,
        oldAllStreams: oldAllStreams as Stream[],
      });

      renderMainHostCard({ plan: mainHostCardPlan, host });
    } else {
      renderNoHostCard();
    }

    updateMainWindow = false;
    updateUpdateMainWindow(updateMainWindow);

    return newComponent;
  } catch {
    // Handle errors during the process of preparing and populating the main screen
    // throw error;
  }
}
