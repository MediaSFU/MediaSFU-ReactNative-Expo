# MediaSFU React Native Expo SDK

Build Expo 57 meeting, webinar, broadcast, and chat experiences with
`mediasfu-reactnative-expo` 2.5.0. The package supports iOS, Android, and Expo
web and includes prebuilt rooms, UI overrides, and lower-level media operations.

`mediasfu-reactnative-expo` is an Expo and React Native WebRTC SDK for video
conferencing, video calls, webinars, interactive live streaming, screen
sharing, recording, whiteboards, polls, breakout rooms, chat,
translation-aware rooms, AI-assisted experiences, prebuilt UI, targeted
customization, and fully headless custom UI.

<p align="center">
  <a href="https://mediasfu.com/storybook/?path=/story/mediasfu-components-modern-mediasfu-generic--default">
    <img src="https://mediasfu.com/images/demos/showcase_all.webp" width="960" alt="MediaSFU product showcase: calls, classrooms, broadcasts, live commerce, and AI experiences" />
  </a>
</p>

<p align="center"><a href="https://mediasfu.com/storybook/?path=/story/mediasfu-components-modern-mediasfu-generic--default">Open the live ModernMediasfuGeneric preview →</a></p>

## Install

```bash
npm install mediasfu-reactnative-expo@2.5.0
```

This release targets Expo 57, React Native 0.86, React 19.2, and Node.js
22.11 or newer. Use an Expo development build for native WebRTC features;
Expo Go does not contain every native module required by a real-time media app.

## Configure camera and microphone access

Add the included config plugin to your Expo configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "mediasfu-reactnative-expo/plugins/withMediaSFUWebRTC",
        {
          "cameraPermission": "Allow this app to use your camera",
          "microphonePermission": "Allow this app to use your microphone"
        }
      ]
    ]
  }
}
```

Create a development build after changing native permissions:

```bash
npx expo run:android
```

On macOS, use `npx expo run:ios`. Test microphone, camera, audio routing,
backgrounding, and screen capture on physical devices before release.

## Choose an integration path

### Self-hosted MediaSFU

For a MediaSFU Open deployment, give the prebuilt room its reachable server
URL. A physical device cannot reach your computer through the device's own
`localhost`; use a TLS URL or an address reachable from that device.

```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ModernMediasfuGeneric } from 'mediasfu-reactnative-expo';

export default function RoomScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ModernMediasfuGeneric
        localLink="https://media.example.test"
        connectMediaSFU={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
```

The URL is illustrative. Replace it with your approved MediaSFU server.

**MediaSFU Open is your own running media server.** You deploy and operate it,
then point `localLink` at its device-reachable HTTPS/LAN URL. The prop does not
start a server, and a physical phone's `localhost` is the phone itself.

### MediaSFU Cloud or an application-owned room service

Keep reusable MediaSFU authority in your authenticated backend. Never put a
long-lived MediaSFU API key in source code, Expo public environment variables,
an over-the-air update, AsyncStorage, or a shipped application bundle.

The package exports create and join callback types. Their legacy shape includes
credential fields, but a safe adapter accepts only the room payload and never
forwards those fields:

```ts
import type {
  CreateRoomOnMediaSFUType,
  JoinRoomOnMediaSFUType,
} from 'mediasfu-reactnative-expo';

type RoomResult = Awaited<ReturnType<CreateRoomOnMediaSFUType>>;

class RoomRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly retryable: boolean,
  ) {
    super(`Room request failed with HTTP ${status}`);
  }
}

async function postRoomPayload(
  endpoint: string,
  payload: unknown,
): Promise<RoomResult> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new RoomRequestError(
      response.status,
      response.status === 429 || response.status >= 500,
    );
  }

  return (await response.json()) as RoomResult;
}

export const createMediaSFURoom: CreateRoomOnMediaSFUType = async ({
  payload,
}) => postRoomPayload('https://api.example.test/rooms/create', payload);

export const joinMediaSFURoom: JoinRoomOnMediaSFUType = async ({
  payload,
}) => postRoomPayload('https://api.example.test/rooms/join', payload);
```

Mount the modern room with valid client placeholders and both callbacks:

```tsx
<ModernMediasfuGeneric
  credentials={{ apiUserName: 'client00', apiKey: '0'.repeat(64) }}
  createMediaSFURoom={createMediaSFURoom}
  joinMediaSFURoom={joinMediaSFURoom}
/>
```

Replace `https://api.example.test` with your own HTTPS backend. It must
authenticate the user, enforce room and role policy, call MediaSFU with
protected authority, and return only the room data the user may receive.

The 2.5.0 prebuilt Cloud prejoin validates the credential shape before calling
the injected callbacks. For that screen, pass a syntactically valid placeholder
(`apiUserName: 'client00'`, `apiKey: '0'.repeat(64)`) and inject **both**
callbacks. The callbacks must ignore those values and send only `payload` to
your backend. The placeholder is not authentication or MediaSFU authority;
your backend must authenticate the app user, enforce room and role policy, and
substitute the real server-only credentials.

### Embed the room in an Expo layout

Give the parent `View` the intended width and height. The generic measures that
boundary with `onLayout`, then uses the same dimensions for orientation,
controls, sidebars, `MainContainer`, `MainAspect`, `MainScreen`, and UI
overrides. If your layout already knows the size, pass
`containerDimensions={{ width, height }}`. This works in native development
builds and Expo Web without treating `Dimensions.get('window')` as the embedded
room size.

## Reuse SDK panels in your own layout

Headless mode can combine your application layout with exported SDK controls.
Keep the room engine mounted with `returnUI={false}`, receive its parameter
publications, and pass the latest room parameters to the panel you import.

Keep modal visibility connected to the room:

1. Open the panel through the room's matching updater, such as
   `updateIsRecordingModalVisible(true)`.
2. Bind the component's `isRecordingModalVisible` prop to the current room
   value, and make its `onClose` callback call
   `updateIsRecordingModalVisible(false)`.
3. Pass the current room parameters and the component's required callbacks,
   including recording confirmation and start actions.
4. Customize supported styles, wrappers, or overrides without replacing the
   underlying room callbacks.

Visibility props differ between components; use the exported component's
contract, not a generic `isVisible` prop for every panel. Do not maintain a
second independent visibility flag. With headless mode, built-in sidebar
navigation is not your application's navigation.

Opening a panel does not start recording or grant media permission. Keep
confirmation, permission checks, and teardown under the room engine's control.

## Render the standard UI from one headless engine

`ModernMediasfuGenericHead` can place the complete standard Expo/React Native
UI elsewhere in your component tree without starting another room. The
original Generic still owns sockets, transports, media, state, modal
visibility, and sidebar navigation.

```tsx
import { View } from 'react-native';
import {
  ModernMediasfuGeneric,
  ModernMediasfuGenericHead,
  useMediasfuHeadless,
} from 'mediasfu-reactnative-expo';

export function RelocatedStandardRoom() {
  const room = useMediasfuHeadless();

  return (
    <View style={{ flex: 1 }}>
      <ModernMediasfuGeneric
        returnUI={false}
        renderUIExternally
        sourceParameters={room.sourceParameters}
        updateSourceParameters={room.updateSourceParameters}
        onMediaChanged={room.onMediaChanged}
      />
      <ModernMediasfuGenericHead parameters={room.parameters} />
    </View>
  );
}
```

Do not mount a second Generic for the visible surface. Keep the source seed
stable; the Head reads through the engine's pure `getCurrentParams()` function
and never calls `getUpdatedAllParams()` while rendering.

## Headless quick start

Headless mode keeps MediaSFU's room and media runtime mounted while your Expo
screen owns everything the user sees. Use an Expo development build; Expo Go
does not contain every native WebRTC module required by this path.

```tsx
import React from 'react';
import { Button, Text, View } from 'react-native';
import {
  ModernMediasfuGeneric,
  useMediasfuHeadless,
} from 'mediasfu-reactnative-expo';

export function HeadlessRoom() {
  const room = useMediasfuHeadless();

  return (
    <View style={{ flex: 1 }}>
      <ModernMediasfuGeneric
        localLink="https://media.example.test"
        connectMediaSFU={true}
        returnUI={false}
        sourceParameters={room.sourceParameters}
        updateSourceParameters={room.updateSourceParameters}
        onMediaChanged={room.onMediaChanged}
      />

      <Text>{room.ready ? 'Room ready' : 'Connecting…'}</Text>
      <Text>{room.participants.length} participants</Text>
      <Button title="Microphone" onPress={() => void room.controls.toggleMic()} />
      <Button title="Camera" onPress={() => void room.controls.toggleCamera()} />
      <Button
        title="Leave room"
        onPress={() => void room.controls.leave(false, false)}
      />
      <Button
        title="End for everyone"
        onPress={() => void room.controls.leave(false, true)}
      />

      {/* Keep these mounted so remote participants remain audible. */}
      {room.audioComponents}
    </View>
  );
}
```

The hook owns one stable `sourceParameters` seed and always replaces its latest
parameter snapshot when `updateSourceParameters` fires. Bind `onMediaChanged`
as shown so stream changes update your screen without a polling loop. Use
`room.controls`, `room.moderation`, `room.session`, and `room.produce` for
actions, and never retain an old `room.parameters` value.

Do not call `getUpdatedAllParams()` to read state during render or polling—it
publishes. Pure reads use `getCurrentParams()`. Replace the example URL with a
server reachable from the physical device, and keep reusable cloud authority
behind your authenticated backend before release.

## Prebuilt room experiences

The main package entry exports:

```ts
import {
  MediasfuGeneric,
  MediasfuConference,
  MediasfuWebinar,
  MediasfuBroadcast,
  MediasfuChat,
  ModernMediasfuGeneric,
} from 'mediasfu-reactnative-expo';
```

`ModernMediasfuGeneric` is the preferred broad default. Conference, webinar,
broadcast, and chat variants start with different layouts and participation
expectations. `MediasfuGeneric` remains available for the classic interface.

## Custom UI and media operations

The package also exports rendered components and lower-level operations:

```ts
import {
  ParticipantsModal,
  AudioGrid,
  FlexibleGrid,
  clickAudio,
  clickVideo,
  clickScreenShare,
  processConsumerTransports,
  launchConfirmExit,
} from 'mediasfu-reactnative-expo';
```

- `ParticipantsModal` renders the participant workspace.
- `AudioGrid` and `FlexibleGrid` render audio-only and flexible video layouts.
- `clickAudio` and `clickVideo` change local microphone or camera state.
- `processConsumerTransports` establishes remote-media consumers.
- `clickScreenShare` starts or stops the package screen-sharing flow.
- `launchConfirmExit` opens participant exit confirmation.

These operations require the complete live parameter object created by the
active room. Do not fabricate a partial object: it must contain the current
socket, transports, producers, consumers, permissions, streams, and callbacks.

Participant membership and remote media are separate signals. Seeing a name in
the participant list does not prove that audio or video is being consumed.
Confirm playback on another device. When paginating video, preserve producer
and consumer state across pages; leaving the visible page is not the same as
pausing or closing a participant's media.

## Screen sharing and collaborative surfaces

`clickScreenShare` handles the package screen-share path. Operating-system
capture support and prompts vary, so test start, denial, stop, backgrounding,
and return-to-room behavior on every supported OS.

The package also exports `Screenboard`, `ScreenboardModal`, `Whiteboard`, and
`captureCanvasStream`. Those are supplied collaboration surfaces; they do not
make every arbitrary native view or canvas shareable automatically. Screen
annotation and screen capture are distinct workflows.

## Exit and cleanup

Host exits remain backward compatible: `room.controls.leave()` ends a
host-owned room because `endRoomOnHostExit` defaults to `true`. To disconnect
the host while keeping the room, duration timer, and other participants active
for later rejoin, call `room.controls.leave(false, false)`. The first argument
is the existing `ban` option; the second is `endRoomOnHostExit`.

The built-in classic and modern confirmation surfaces present **Leave room**
and **End for everyone** to a host. Participants keep the ordinary leave path.

After any participant or host exit:

1. Handle the room's exit result.
2. Stop tracks owned by your application.
3. Remove app-owned subscriptions and timers.
4. Close the room screen.
5. Clear cached participant and media state before another room opens.

Use the returned action result and room events to update your navigation. Do not
infer a room-wide end from an ordinary participant exit or from a host choosing
the keep-room option.

## Recording

Use `RecordingModal`, `startRecording`, and `stopRecording` for in-room
recording controls. The room also handles `recordingNotice` and
`roomRecordParams`, so participants can see the current recording state and
the in-progress notice supplied by MediaSFU.

Listing, playing, or downloading completed recordings is an account and
backend workflow, not a requirement for the in-room Expo SDK. Connect that
workflow to the MediaSFU recording service your product uses when you want a
recording library in your app.

## Release checklist

1. Confirm that create and join authority remains in your backend.
2. Test `401`, `403`, `404`, `429`, and `5xx` responses with safe messages.
3. Test microphone, camera, remote audio/video, screen sharing, and exit with at
   least two physical devices.
4. Test permission denial, backgrounding, interrupted connections, and cleanup.
5. Verify that no long-lived credential is present in the JavaScript bundle,
   source maps, logs, screenshots, or over-the-air update.

## Package boundaries

- Import public APIs from `mediasfu-reactnative-expo`; do not depend on internal
  `dist` or `src` paths.
- Native mediasoup/WebRTC transport packages are implementation dependencies,
  not separate MediaSFU SDK choices.

## Support

- SDK guides and generated API references: <https://mediasfu.com/docs/>
- Expo room operations guide: <https://mediasfu.com/docs/usage/expo-room-operations>
- Complete headless guide: <https://mediasfu.com/docs/usage/headless>
- REST API Sandbox — run GET/POST requests and copy code: <https://mediasfu.com/sandbox>
- Create and manage MediaSFU API keys: <https://mediasfu.com/api-keys>
- Developer Console and room API guide: <https://mediasfu.com/documentation>
- MediaSFU Open — deploy your own media server: <https://github.com/MediaSFU/MediaSFUOpen>
- Issues: <https://github.com/MediaSFU/MediaSFU-ReactNative-Expo/issues>
- License: MIT

## Working examples

## Virtual backgrounds and breakout rooms in a custom Expo UI

Keep `ModernBackgroundModal` mounted with the room and drive it from the newest
parameter publication. Render self-view from
`useMediasfuHeadless().localVideo`, which prefers the active virtual stream over
the raw camera. This keeps the device preview consistent with the media sent to
other participants.

For breakout rooms, reuse `ModernBreakoutRoomsModal` with the current room bag,
save assignments before Start, and render validation failures in your screen.
Do not model a breakout by hiding cards: the SDK room transition updates
membership and pauses/resumes consumers for the participant's active room.

- [MediaSFU QuickStart Apps](https://github.com/MediaSFU/MediaSFU-QuickStart-Apps) — runnable Cloud, MediaSFU Open, custom-prejoin, backend-proxy, and custom-UI examples across SDKs.
- [SpacesTek Initial](https://github.com/MediaSFU/SpacesTekInitial) → [Final](https://github.com/MediaSFU/SpacesTekFinal) → [Advanced](https://github.com/MediaSFU/SpacesTekAdvanced) — a staged path from a starter room to a product-owned Spaces-style experience.
- [MediaSFU Agents](https://github.com/MediaSFU/Agents) — multimodal voice/vision agent starters across supported frameworks.
- [MediaSFU VOIP](https://github.com/MediaSFU/VOIP) — telephony, dialer, room-lifecycle, and agent/human handoff reference clients.
