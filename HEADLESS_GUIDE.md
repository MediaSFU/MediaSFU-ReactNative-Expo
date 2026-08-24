# Headless MediaSFU React Native Expo Guide

Use this guide when an Expo app owns the visible call experience while `mediasfu-reactnative-expo` owns room signaling, transports, producers, consumers, and runtime state. The current contract is `returnUI={false}` plus `sourceParameters` and `updateSourceParameters`; it is not a separate controller export.

## Architecture

```text
Expo Router/navigation and your call screen
        | user intents
        v
ModernMediasfuGeneric with returnUI=false
        | publishes current room state and helpers
        v
updateSourceParameters -> latest React state
        | render selected video plus every remote audio stream
        v
Your native/web call UI
```

## 1. Use a development build

Real WebRTC media depends on native modules and platform permissions. Configure the package, create an Expo development build, and validate there. Expo Go or a seeded UI preview can prove layout, but not the native produce/consume path.

## 2. Store the latest publication

```tsx
const [sourceParameters, setSourceParameters] =
  useState<Record<string, any>>({});

const updateSourceParameters = useCallback(
  (next: Record<string, any>) => setSourceParameters(next),
  [],
);
```

Replace the reference on every callback. Do not capture the first publication in a long-lived timer or event listener.

## 3. Mount the hidden runtime

```tsx
<ModernMediasfuGeneric
  returnUI={false}
  noUIPreJoinOptions={headlessJoin}
  sourceParameters={sourceParameters}
  updateSourceParameters={updateSourceParameters}
  createMediaSFURoom={createMediaSFURoom}
  joinMediaSFURoom={joinMediaSFURoom}
/>
```

Use an `action: 'create'` payload with `duration`, `capacity`, and `userName`, or an `action: 'join'` payload with `meetingID` and `userName`.

## 4. Keep credentials on the app backend

Your Expo client should submit only room intent to an authenticated HTTPS endpoint. The backend validates it, adds MediaSFU credentials from environment variables, and forwards it to MediaSFU Cloud or the configured MediaSFU Open rooms endpoint. Return the normalized `{ data, success }` shape.

Short-lived keys are acceptable only in ignored local configuration for fast development. Remove them before creating public builds, over-the-air updates, or screenshots. Follow the [secure proxy guide](https://mediasfu.com/docs/usage/secure-backend-proxy/).

## 5. Produce local media

```ts
async function toggleMicrophone() {
  const p = sourceParameters;
  await p.clickAudio?.({ parameters: p });
}

async function toggleCamera() {
  const p = sourceParameters;
  await p.clickVideo?.({ parameters: p });
}

async function toggleScreenShare() {
  const p = sourceParameters;
  await p.clickScreenShare?.({ parameters: p });
}
```

Use the SDK helpers rather than creating a parallel producer path. Handle permission denial and platform-specific screen-share requirements explicitly.

## 6. Resolve and render participant video

```ts
async function resolveParticipantVideo(participant: any) {
  const p = sourceParameters;
  return p.getParticipantMedia?.(
    participant.videoID ?? '',
    participant.name,
    'video',
  );
}
```

Prefer active screen share, then selected remote camera, then local preview, then an avatar/audio-only fallback. Key RTC views by stable producer or stream ID and remove them when tracks end or producers close.

## 7. Play all remote audio

Drive a dedicated audio-render layer from the newest `allAudioStreams` collection.

- Render every live stream with the RTC view appropriate to the current native or web target.
- Keep audio rendering separate from paginated video cards.
- Do not stop an audio consumer when its video tile becomes hidden.
- Remove the RTC view when the producer closes.
- Validate web autoplay recovery plus native Bluetooth, speaker, earpiece, interruption, and background/foreground behavior.

`MiniAudioPlayer` and `ModernMiniAudioPlayer` are exported when the app also needs SDK waveform/decibel behavior and has the required consumer object.

## 8. Custom component or fully headless?

Use `uiOverrides`, custom cards, or `customComponent` when the MediaSFU workflow still fits. Use `returnUI={false}` when Expo Router/navigation, accessibility, and every visible room surface must be app-owned.

## 9. Cleanup

When leaving the route:

- call the latest MediaSFU leave/disconnect helper
- detach app-owned RTC views and listeners
- stop only tracks created directly by your app
- clear audio queues, timers, and retry callbacks
- restore any app-level audio-session state you changed
- discard the parameter bag

## 10. Real-room acceptance

- Install the published SDK version from npm and confirm a clean dependency resolution before performing release acceptance.
- Create and join through the backend proxy without exposing credentials.
- Join two participants and verify audio/video in both directions.
- Toggle microphone, camera, and screen share.
- Confirm participants remain audible when their video card is off-page.
- Exercise platform permissions, Bluetooth/speaker routing, web autoplay, interruptions, background/foreground, reconnect, participant leave, and room leave.
- Test emulator/simulator for automation and supported physical targets before release.
- Inspect release bundles, binaries, update payloads, and source maps for secrets.

## References

- [Package quick start](README.md)
- [Detailed Expo manual](README_DETAILED.md)
- [Expo SDK guide](https://mediasfu.com/docs/sdks/react-native-expo/)
- [Generated API references](https://mediasfu.com/docs/api-reference/)
- [MediaSFU Open](https://github.com/MediaSFU/MediaSFUOpen)
- [MediaSFU Sandbox](https://mediasfu.com/sandbox)
