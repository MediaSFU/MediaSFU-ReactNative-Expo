// /* eslint-disable @typescript-eslint/no-unused-vars */
// /**
//  * MediaSFU Component Configuration and Usage Guide
//  *
//  * The following code and comments will guide you through:
//  * 1. Configuring the MediaSFU component with different server and credential setups.
//  * 2. Handling API credentials securely depending on whether you use MediaSFU Cloud or your own MediaSFU CE server.
//  * 3. Rendering custom UIs by disabling the default MediaSFU UI.
//  * 4. Using custom "create room" and "join room" functions for secure, flexible integration.
//  *
//  * Note: All guide instructions are provided as code comments. They will not render to the user directly.
//  */

// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// // MediaSFU view components (if you choose to use them)
// import MediasfuGeneric from './src/components/mediasfuComponents/MediasfuGeneric';
// import MediasfuBroadcast from './src/components/mediasfuComponents/MediasfuBroadcast';
// import MediasfuChat from './src/components/mediasfuComponents/MediasfuChat';
// import MediasfuWebinar from './src/components/mediasfuComponents/MediasfuWebinar';
// import MediasfuConference from './src/components/mediasfuComponents/MediasfuConference';

// // Pre-Join Page component (if you choose to use it)
// import PreJoinPage from './src/components/miscComponents/PreJoinPage';

// // Custom component types
// import {
//   CustomVideoCardType,
//   CustomAudioCardType,
//   CustomMiniCardType,
// } from './src/@types/types';

// // Utilities for seed data (deprecated - do not use in new code)
// import { generateRandomParticipants } from './src/methods/utils/generateRandomParticipants';
// import { generateRandomMessages } from './src/methods/utils/generateRandomMessages';
// import { generateRandomRequestList } from './src/methods/utils/generateRandomRequestList';
// import { generateRandomWaitingRoomList } from './src/methods/utils/generateRandomWaitingRoomList';

// // Import custom "create" and "join" room functions
// import { createRoomOnMediaSFU } from './src/methods/utils/createRoomOnMediaSFU';
// import { joinRoomOnMediaSFU } from './src/methods/utils/joinRoomOnMediaSFU';
// import { CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from './src/@types/types';

// // =========================================================
// //                    CUSTOM COMPONENT EXAMPLES
// // =========================================================
// //
// // These are example custom components that you can use to replace
// // the default VideoCard, AudioCard, and MiniCard components.
// // Feel free to modify these examples or create your own custom components.

// // Example Custom VideoCard for React Native
// const CustomVideoCard: CustomVideoCardType = ({
//   participant,
//   stream,
//   width,
//   height,
//   showControls,
//   showInfo,
//   name,
//   backgroundColor,
//   parameters,
// }) => {
//   return (
//     <View
//       style={[
//         {
//           width: width,
//           height: height,
//           backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.8)',
//           borderRadius: 16,
//           position: 'relative',
//           overflow: 'hidden',
//           borderWidth: 3,
//           borderColor: '#6366f1',
//         },
//       ]}
//     >
//       {/* Custom video display would go here */}
//       {/* Note: Video rendering in React Native requires platform-specific implementation */}
      
//       {/* Custom participant info overlay */}
//       {showInfo && (
//         <View style={{
//           position: 'absolute',
//           bottom: 8,
//           left: 8,
//           backgroundColor: '#6366f1',
//           paddingHorizontal: 12,
//           paddingVertical: 4,
//           borderRadius: 20,
//         }}>
//           <Text style={{
//             color: 'white',
//             fontSize: 14,
//             fontWeight: 'bold',
//           }}>
//             🎥 {name || participant.name}
//           </Text>
//         </View>
//       )}
      
//       {/* Custom controls overlay */}
//       {showControls && (
//         <View style={{
//           position: 'absolute',
//           top: 8,
//           right: 8,
//           flexDirection: 'row',
//           gap: 8,
//         }}>
//           <View style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             borderRadius: 16,
//             width: 32,
//             height: 32,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Text style={{ color: 'white', fontSize: 16 }}>🔇</Text>
//           </View>
//           <View style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             borderRadius: 16,
//             width: 32,
//             height: 32,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Text style={{ color: 'white', fontSize: 16 }}>📹</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// // Example Custom AudioCard for React Native
// const CustomAudioCard: CustomAudioCardType = ({
//   name,
//   barColor,
//   textColor,
//   parameters,
// }) => {
//   const isActive = barColor; // barColor indicates if participant is speaking

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         borderRadius: 16,
//         minHeight: 120,
//         position: 'relative',
//         overflow: 'hidden',
//         backgroundColor: isActive ? '#ef4444' : '#6b7280',
//       }}
//     >
//       {/* Audio wave animation background */}
//       {isActive && (
//         <View style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(255, 255, 255, 0.1)',
//           opacity: 0.5,
//         }} />
//       )}
      
//       {/* Avatar */}
//       <View style={{
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: 'rgba(255, 255, 255, 0.2)',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 12,
//         zIndex: 1,
//       }}>
//         <Text style={{
//           fontSize: 24,
//           fontWeight: 'bold',
//           color: 'white',
//         }}>
//           {name ? name.charAt(0).toUpperCase() : '?'}
//         </Text>
//       </View>
      
//       {/* Name */}
//       <Text style={{
//         fontSize: 16,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         color: textColor || 'white',
//         zIndex: 1,
//       }}>
//         {name}
//       </Text>
      
//       {/* Speaking indicator */}
//       {isActive && (
//         <Text style={{
//           marginTop: 8,
//           fontSize: 12,
//           color: 'rgba(255, 255, 255, 0.8)',
//           zIndex: 1,
//         }}>
//           🎤 Speaking...
//         </Text>
//       )}
//     </View>
//   );
// };

// // Example Custom MiniCard for React Native
// const CustomMiniCard: CustomMiniCardType = ({
//   initials,
//   name,
//   showVideoIcon,
//   showAudioIcon,
//   parameters,
// }) => {
//   return (
//     <View style={{
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 12,
//       backgroundColor: '#1f2937',
//       borderRadius: 12,
//       minHeight: 80,
//       minWidth: 80,
//       borderWidth: 2,
//       borderColor: '#6366f1',
//     }}>
//       {/* Avatar/Initials */}
//       <View style={{
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#6366f1',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 6,
//       }}>
//         <Text style={{
//           fontSize: 16,
//           fontWeight: 'bold',
//           color: 'white',
//         }}>
//           {initials || name?.charAt(0)?.toUpperCase() || '?'}
//         </Text>
//       </View>
      
//       {/* Name */}
//       <Text style={{
//         fontSize: 10,
//         textAlign: 'center',
//         marginBottom: 6,
//         color: 'white',
//         maxWidth: '100%',
//       }} numberOfLines={1} ellipsizeMode="tail">
//         {name}
//       </Text>
      
//       {/* Media status icons */}
//       <View style={{
//         flexDirection: 'row',
//         gap: 4,
//       }}>
//         {showVideoIcon && (
//           <Text style={{ fontSize: 12, opacity: 0.7 }}>📹</Text>
//         )}
//         {showAudioIcon && (
//           <Text style={{ fontSize: 12, opacity: 0.7 }}>🎤</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// /**
//  * App Component
//  *
//  * This component demonstrates how to:
//  * - Configure credentials for MediaSFU Cloud and/or Community Edition (CE).
//  * - Use MediaSFU with or without a custom server.
//  * - Integrate a pre-join page.
//  * - Return no UI and manage state through sourceParameters, allowing a fully custom frontend.
//  *
//  * Basic instructions:
//  * 1. Set `localLink` to your CE server if you have one, or leave it blank to use MediaSFU Cloud.
//  * 2. Set `connectMediaSFU` to determine whether you're connecting to MediaSFU Cloud services.
//  * 3. Provide credentials if using MediaSFU Cloud (dummy credentials are acceptable in certain scenarios).
//  * 4. If you prefer a custom UI, set `returnUI` to false and handle all interactions via `sourceParameters` and `updateSourceParameters`.
//  * 5. For secure production usage, consider using custom `createMediaSFURoom` and `joinMediaSFURoom` functions to forward requests through your backend.
//  */

// const App = () => {
//   // =========================================================
//   //                API CREDENTIALS CONFIGURATION
//   // =========================================================
//   //
//   // Scenario A: Not using MediaSFU Cloud at all.
//   // - No credentials needed. Just set localLink to your CE server.
//   // Example:
//   /*
//   const credentials = {};
//   const localLink = 'http://your-ce-server.com'; //http://localhost:3000
//   const connectMediaSFU = localLink.trim() !== '';
//   */

//   // Scenario B: Using MediaSFU CE + MediaSFU Cloud for Egress only.
//   // - Use dummy credentials (8 chars for userName, 64 chars for apiKey).
//   // - Your CE backend will forward requests with your real credentials.
//   /*
//   const credentials = {
//     apiUserName: 'dummyUsr',
//     apiKey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
//   };
//   const localLink = 'http://your-ce-server.com'; //http://localhost:3000
//   const connectMediaSFU = localLink.trim() !== '';
//   */

//   // Scenario C: Using MediaSFU Cloud without your own server.
//   // - For development, use your actual or dummy credentials.
//   // - In production, securely handle credentials server-side and use custom room functions.
//   const credentials = {
//     apiUserName: 'yourDevUser', // 8 chars recommended for dummy
//     apiKey: 'yourDevApiKey1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // 64 chars
//   };
//   const localLink = ''; // Leave empty if not using your own server
//   const connectMediaSFU = true; // Set to true if using MediaSFU Cloud since localLink is empty

//   // =========================================================
//   //                    UI RENDERING OPTIONS
//   // =========================================================
//   //
//   // If you want a fully custom UI (e.g., a custom layout inspired by WhatsApp):
//   // 1. Set `returnUI = false` to prevent the default MediaSFU UI from rendering.
//   // 2. Provide `noUIPreJoinOptions` to simulate what would have been entered on a pre-join page.
//   // 3. Use `sourceParameters` and `updateSourceParameters` to access and update state/actions.
//   // 4. No need for any of the above if you're using the default MediaSFU UI.
//   //
//   // Example noUIPreJoinOptions:
//   const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
//     action: 'create',
//     capacity: 10,
//     duration: 15,
//     eventType: 'broadcast',
//     userName: 'Prince',
//   };

//   // Example for joining a room:
//   // const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions = {
//   //   action: 'join',
//   //   userName: 'Prince',
//   //   meetingID: 'yourMeetingID'
//   // };

//   const returnUI = true; // Set to false for custom UI, true for default MediaSFU UI

//   const [sourceParameters, setSourceParameters] = useState<{ [key: string]: any }>({});
//   const updateSourceParameters = (data: { [key: string]: any }) => {
//     setSourceParameters(data);
//   };

//   // =========================================================
//   //                CUSTOM ROOM FUNCTIONS (OPTIONAL)
//   // =========================================================
//   //
//   // To securely forward requests to MediaSFU:
//   // - Implement custom `createMediaSFURoom` and `joinMediaSFURoom` functions.
//   // - These functions send requests to your server, which then communicates with MediaSFU Cloud.
//   //
//   // Already imported `createRoomOnMediaSFU` and `joinRoomOnMediaSFU` are examples.
//   //
//   // If using MediaSFU CE backend, ensure your server endpoints:
//   // - Validate dummy credentials.
//   // - Forward requests to mediasfu.com with real credentials.

//   // =========================================================
//   //              CHOOSE A USE CASE / COMPONENT
//   // =========================================================
//   //
//   // Multiple components are available depending on your event type:
//   // MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference
//   //
//   // By default, we'll use MediasfuGeneric with custom settings.



//   // =========================================================
//   //                    RENDER COMPONENT
//   // =========================================================
//   //
//   // The MediasfuGeneric component is used by default.
//   // You can replace it with any other component based on your event type.
//   // Example: <MediasfuBroadcast ... />
//   // Example: <MediasfuChat ... />
//   // Example: <MediasfuWebinar ... />
//   // Example: <MediasfuConference ... />
//   //
//   // The PreJoinPage component is displayed if `returnUI` is true.
//   // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
//   // You can also use `sourceParameters` to interact with MediaSFU functionalities directly.
//   // Avoid using `useLocalUIMode` or `useSeed` in new implementations.
//   // Ensure that real credentials are not exposed in the frontend.
//   // Use HTTPS and secure backend endpoints for production.

//   // Example of MediaSFU CE with no MediaSFU Cloud
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     localLink={localLink}
//   //     />
//   // );

//   // Example of MediaSFU CE + MediaSFU Cloud for Egress only
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     credentials={credentials}
//   //     localLink={localLink}
//   //     connectMediaSFU={connectMediaSFU}
//   //     />
//   // );

//   // Example of MediaSFU Cloud only
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     credentials={credentials}
//   //     connectMediaSFU={connectMediaSFU}
//   //     />
//   // );

//   // Example of MediaSFU CE + MediaSFU Cloud for Egress only with custom UI
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     credentials={credentials}
//   //     localLink={localLink}
//   //     connectMediaSFU={connectMediaSFU}
//   //     returnUI={false}
//   //     noUIPreJoinOptions={noUIPreJoinOptions}
//   //     sourceParameters={sourceParameters}
//   //     updateSourceParameters={updateSourceParameters}
//   //     createMediaSFURoom={createRoomOnMediaSFU}
//   //     joinMediaSFURoom={joinRoomOnMediaSFU}
//   //   />

//   // Example of MediaSFU Cloud only with custom UI
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     credentials={credentials}
//   //     connectMediaSFU={connectMediaSFU}
//   //     returnUI={false}
//   //     noUIPreJoinOptions={noUIPreJoinOptions}
//   //     sourceParameters={sourceParameters}
//   //     updateSourceParameters={updateSourceParameters}
//   //     createMediaSFURoom={createRoomOnMediaSFU}
//   //     joinMediaSFURoom={joinRoomOnMediaSFU}
//   //   />

//   // Example of using MediaSFU CE only with custom UI
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     localLink={localLink}
//   //     connectMediaSFU={false}
//   //     returnUI={false}
//   //     noUIPreJoinOptions={noUIPreJoinOptions}
//   //     sourceParameters={sourceParameters}
//   //     updateSourceParameters={updateSourceParameters}
//   //   />

//   // Example with custom components (uncomment to use custom VideoCard, AudioCard, and MiniCard)
//   // return (
//   //   <MediasfuGeneric
//   //     PrejoinPage={PreJoinPage}
//   //     credentials={credentials}
//   //     localLink={localLink}
//   //     connectMediaSFU={connectMediaSFU}
//   //     returnUI={returnUI}
//   //     noUIPreJoinOptions={!returnUI ? noUIPreJoinOptions : undefined}
//   //     sourceParameters={!returnUI ? sourceParameters : undefined}
//   //     updateSourceParameters={!returnUI ? updateSourceParameters : undefined}
//   //     createMediaSFURoom={createRoomOnMediaSFU}
//   //     joinMediaSFURoom={joinRoomOnMediaSFU}
//   //     customVideoCard={CustomVideoCard}
//   //     customAudioCard={CustomAudioCard}
//   //     customMiniCard={CustomMiniCard}
//   //   />
//   // );


//   return (
//     <MediasfuGeneric
//       // This pre-join page can be displayed if `returnUI` is true.
//       // If `returnUI` is false, `noUIPreJoinOptions` is used as a substitute.
//       PrejoinPage={PreJoinPage}
//       credentials={credentials}
//       localLink={localLink}
//       connectMediaSFU={connectMediaSFU}
//       returnUI={returnUI}
//       noUIPreJoinOptions={!returnUI ? noUIPreJoinOptions : undefined}
//       sourceParameters={!returnUI ? sourceParameters : undefined}
//       updateSourceParameters={!returnUI ? updateSourceParameters : undefined}
//       createMediaSFURoom={createRoomOnMediaSFU} // no need to specify if not using custom functions
//       joinMediaSFURoom={joinRoomOnMediaSFU} // no need to specify if not using custom functions
//     />
//   );
// };

// export default App;

// /**
//  * =========================================================
//  *                     ADDITIONAL NOTES
//  * =========================================================
//  *
//  * Handling Core Methods:
//  * Once `sourceParameters` is populated, you can call core methods like `clickVideo` or `clickAudio` directly:
//  * Example:
//  * sourceParameters.clickVideo({ ...sourceParameters });
//  * sourceParameters.clickAudio({ ...sourceParameters });
//  *
//  * This allows your custom UI to directly interact with MediaSFU functionalities.
//  *
//  * Deprecated Features (Seed Data):
//  * The seed data generation feature is deprecated. Avoid using `useLocalUIMode` or `useSeed` in new implementations.
//  *
//  * Security Considerations:
//  * - Do not expose real credentials in your frontend code in production.
//  * - Use HTTPS and secure backend endpoints.
//  * - Validate inputs and handle errors gracefully.
//  *
//  * Example CE Backend Setup:
//  * If using MediaSFU CE + MediaSFU Cloud, your backend might look like this:
//  *
//  * app.post("/createRoom", async (req, res) => {
//  *   // Validate incoming dummy credentials
//  *   // Forward request to mediasfu.com with real credentials
//  * });
//  *
//  * app.post("/joinRoom", async (req, res) => {
//  *   // Validate incoming dummy credentials
//  *   // Forward request to mediasfu.com with real credentials
//  * });
//  *
//  * By doing so, you keep real credentials secure on your server.
//  *
//  * End of Guide.
//  */



// /**
//  * =======================
//  * ====== EXTRA NOTES ======
//  * =======================
//  *
//  * ### Handling Core Methods
//  * With `sourceParameters`, you can access core methods such as `clickVideo` and `clickAudio`:
//  *
//  * ```typescript
//  * sourceParameters.clickVideo({ ...sourceParameters });
//  * sourceParameters.clickAudio({ ...sourceParameters });
//  * ```
//  *
//  * This allows your custom UI to interact with MediaSFU's functionalities seamlessly.
//  *
//  * ### Seed Data (Deprecated)
//  * The seed data functionality is deprecated and maintained only for legacy purposes.
//  * It is recommended to avoid using it in new implementations.
//  *
//  * ### Security Considerations
//  * - **Protect API Credentials:** Ensure that API credentials are not exposed in the frontend. Use environment variables and secure backend services to handle sensitive information.
//  * - **Use HTTPS:** Always use HTTPS to secure data transmission between the client and server.
//  * - **Validate Inputs:** Implement proper validation and error handling on both client and server sides to prevent malicious inputs.
//  *
//  * ### Custom Backend Example for MediaSFU CE
//  * Below is an example of how to set up custom backend endpoints for creating and joining rooms using MediaSFU CE:
//  *
//  * ```javascript
//  * // Endpoint for `createRoom`
//  * app.post("/createRoom", async (req, res) => {
//  *   try {
//  *     const payload = req.body;
//  *     const [apiUserName, apiKey] = req.headers.authorization
//  *       .replace("Bearer ", "")
//  *       .split(":");
//  *
//  *     // Verify temporary credentials
//  *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
//  *       return res.status(401).json({ error: "Invalid or expired credentials" });
//  *     }
//  *
//  *     const response = await fetch("https://mediasfu.com/v1/rooms/", {
//  *       method: "POST",
//  *       headers: {
//  *         "Content-Type": "application/json",
//  *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
//  *       },
//  *       body: JSON.stringify(payload),
//  *     });
//  *
//  *     const result = await response.json();
//  *     res.status(response.status).json(result);
//  *   } catch (error) {
//  *     console.error("Error creating room:", error);
//  *     res.status(500).json({ error: "Internal server error" });
//  *   }
//  * });
//  *
//  * // Endpoint for `joinRoom`
//  * app.post("/joinRoom", async (req, res) => {
//  *   try {
//  *     const payload = req.body;
//  *     const [apiUserName, apiKey] = req.headers.authorization
//  *       .replace("Bearer ", "")
//  *       .split(":");
//  *
//  *     // Verify temporary credentials
//  *     if (!apiUserName || !apiKey || !verifyCredentials(apiUserName, apiKey)) {
//  *       return res.status(401).json({ error: "Invalid or expired credentials" });
//  *     }
//  *
//  *     const response = await fetch("https://mediasfu.com/v1/rooms/", {
//  *       method: "POST",
//  *       headers: {
//  *         "Content-Type": "application/json",
//  *         Authorization: `Bearer ${actualApiUserName}:${actualApiKey}`,
//  *       },
//  *       body: JSON.stringify(payload),
//  *     });
//  *
//  *     const result = await response.json();
//  *     res.status(response.status).json(result);
//  *   } catch (error) {
//  *     console.error("Error joining room:", error);
//  *     res.status(500).json({ error: "Internal server error" });
//  *   }
//  * });
//  * ```
//  *
//  * ### Custom Room Function Implementation
//  * Below are examples of how to implement custom functions for creating and joining rooms securely:
//  *
//  * ```typescript
//  * import { CreateJoinRoomError, CreateJoinRoomResponse, CreateJoinRoomType, CreateMediaSFURoomOptions, JoinMediaSFURoomOptions } from '../../@types/types';
//  *
//  *
//  * Async function to create a room on MediaSFU.
//  *
//  * @param {object} options - The options for creating a room.
//  * @param {CreateMediaSFURoomOptions} options.payload - The payload for the API request.
//  * @param {string} options.apiUserName - The API username.
//  * @param {string} options.apiKey - The API key.
//  * @param {string} options.localLink - The local link.
//  * @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
//  * export const createRoomOnMediaSFU: CreateJoinRoomType = async ({
//  *     payload,
//  *     apiUserName,
//  *     apiKey,
//  *     localLink = '',
//  * }) => {
//  *     try {
//  *         let finalLink = 'https://mediasfu.com/v1/rooms/';
//  *
//  *         // Update finalLink if using a local server
//  *         if (localLink) {
//  *             finalLink = `${localLink}/createRoom`;
//  *         }
//  *
//  *         const response = await fetch(finalLink, {
//  *             method: 'POST',
//  *             headers: {
//  *                 'Content-Type': 'application/json',
//  *                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
//  *             },
//  *             body: JSON.stringify(payload),
//  *         });
//  *
//  *         if (!response.ok) {
//  *             throw new Error(`HTTP error! Status: ${response.status}`);
//  *         }
//  *
//  *         const data: CreateJoinRoomResponse = await response.json();
//  *         return { data, success: true };
//  *     } catch (error) {
//  *         const errorMessage = (error as Error).message || 'unknown error';
//  *         return {
//  *             data: { error: `Unable to create room, ${errorMessage}` },
//  *             success: false,
//  *         };
//  *     }
//  * };
//  *
// *
// *  Async function to join a room on MediaSFU.
// *
// *  @param {object} options - The options for joining a room.
// *  @param {JoinMediaSFURoomOptions} options.payload - The payload for the API request.
// *  @param {string} options.apiUserName - The API username.
// *  @param {string} options.apiKey - The API key.
// *  @param {string} options.localLink - The local link.
// *  @returns {Promise<{ data: CreateJoinRoomResponse | CreateJoinRoomError | null; success: boolean; }>} The response from the API.
// *
// * export const joinRoomOnMediaSFU: JoinRoomOnMediaSFUType = async ({
// *     payload,
// *     apiUserName,
// *     apiKey,
// *     localLink = '',
// * }) => {
// *     try {
// *         let finalLink = 'https://mediasfu.com/v1/rooms/';
// *
// *         // Update finalLink if using a local server
// *         if (localLink) {
// *             finalLink = `${localLink}/joinRoom`;
// *         }
// *
// *         const response = await fetch(finalLink, {
// *             method: 'POST',
// *             headers: {
// *                 'Content-Type': 'application/json',
// *                 Authorization: `Bearer ${apiUserName}:${apiKey}`,
// *             },
// *             body: JSON.stringify(payload),
// *         });
// *
// *         if (!response.ok) {
// *             throw new Error(`HTTP error! Status: ${response.status}`);
// *         }
// *
// *         const data: CreateJoinRoomResponse = await response.json();
// *         return { data, success: true };
// *     } catch (error) {
// *         const errorMessage = (error as Error).message || 'unknown error';
// *         return {
// *             data: { error: `Unable to join room, ${errorMessage}` },
// *             success: false,
// *         };
// *     }
// * };
// * ```
// *
// * ### Example Usage of Core Methods
// * Core methods like `clickVideo` and `clickAudio` can now be accessed through `sourceParameters`:
// *
// * ```typescript
// * // Example of toggling video
// * sourceParameters.clickVideo({ ...sourceParameters });
// *
// * // Example of toggling audio
// * sourceParameters.clickAudio({ ...sourceParameters });
// * ```
// *
// * These methods allow your custom UI to interact with MediaSFU's functionalities seamlessly.
// *
// * ========================
// * ====== END OF GUIDE ======
// * ========================
// */


//------------------------------------- End of Basic Usage Parts ------------------------------------//
//------------------------------------- End of Basic Usage Parts ------------------------------------//



//------------------------------------- Start of Cookbook Parts -------------------------------------//
//------------------------------------- Start of Cookbook Parts -------------------------------------//
//------------------------------------- AppUnique.tsx duplicates this part as well-------------------//  


/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - This is a demo/cookbook file showcasing various customization patterns
/**
 * AppUnique
 *
 * A toggle-driven cookbook that mirrors the guidance in `App.tsx`, while showcasing
 * the newer UI override hooks, custom cards, and fully custom render paths in one place.
 *
 * Adjust the booleans and selectors below to switch between common deployment scenarios
 * (Cloud, Community Edition, Hybrid), UI strategies (prebuilt UI, no-UI, or fully custom),
 * and customization layers (card builders, component overrides, container styling).
 *
 * Every configuration block is wrapped in a clearly named toggle so you can enable/disable
 * a feature by flipping a single value or commenting it out. The component is intentionally
 * verbose to double as living documentation that developers can copy, trim, or expand.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Linking, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppVisualAudit from './AppVisualAudit';
import MediasfuGeneric, { ModernMediasfuGenericOptions as MediasfuGenericOptions } from './src/components_modern/mediasfu_components/ModernMediasfuGeneric';
import MediasfuBroadcast from './src/components/mediasfuComponents/MediasfuBroadcast';
import MediasfuChat from './src/components/mediasfuComponents/MediasfuChat';
import MediasfuWebinar from './src/components/mediasfuComponents/MediasfuWebinar';
import MediasfuConference from './src/components/mediasfuComponents/MediasfuConference';
import PreJoinPage from './src/components_modern/misc_components/ModernPreJoinPage';
import MainContainerComponent from './src/components/displayComponents/MainContainerComponent';
import Pagination from './src/components/displayComponents/Pagination';
import AlertComponent from './src/components/displayComponents/AlertComponent';
import MenuModal from './src/components/menuComponents/MenuModal';
import ParticipantsModal from './src/components/participantsComponents/ParticipantsModal';
import ConfirmExitModal from './src/components/exitComponents/ConfirmExitModal';
import VideoCard from './src/components/displayComponents/VideoCard';
import AudioCard from './src/components/displayComponents/AudioCard';
import MiniCard from './src/components/displayComponents/MiniCard';
import MiniAudio from './src/components/displayComponents/MiniAudio';
import MiniAudioPlayer from './src/methods/utils/MiniAudioPlayer/MiniAudioPlayer';
import { createRoomOnMediaSFU } from './src/methods/utils/createRoomOnMediaSFU';
import { joinRoomOnMediaSFU } from './src/methods/utils/joinRoomOnMediaSFU';
import { getDemoCloudConfig } from './demoCloudConfig';
import {
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
  CustomVideoCardType,
  CustomAudioCardType,
  CustomMiniCardType,
  CustomComponentType,
  MediasfuUICustomOverrides,
  Participant,
} from './src/@types/types';

type LiveRoomRoute = {
  action: 'create' | 'join';
  userName: string;
  meetingID?: string;
  eventType: string;
  duration: number;
  capacity: number;
  renderUI: boolean;
  autoRequest?: 'audio' | 'video' | 'screen';
};

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const readRouteParam = (url: string, key: string) => {
  const match = new RegExp(`[?&]${key}=([^&#]+)`, 'i').exec(url);
  return match ? decodeURIComponent(match[1]) : null;
};

const normalizeAutoRequest = (value?: string | null) => {
  return value === 'audio' || value === 'video' || value === 'screen'
    ? value
    : undefined;
};

const resolveLiveRoomRoute = (url?: string | null): LiveRoomRoute | null => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const normalizedTarget = `${parsed.host}${parsed.pathname}`.replace(/^\/+|\/+$/g, '');
    const normalizedTargetParts = normalizedTarget
      .split('/')
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);
    const isLiveLaunch =
      normalizedTarget === 'live' ||
      normalizedTargetParts.at(-1) === 'live' ||
      parsed.searchParams.get('live') === '1';

    if (!isLiveLaunch) {
      return null;
    }

    const action = parsed.searchParams.get('action');
    const userName = (parsed.searchParams.get('userName') ?? '').trim();

    if ((action !== 'create' && action !== 'join') || !userName) {
      return null;
    }

    const meetingID = (parsed.searchParams.get('meetingID') ?? '').trim();
    if (action === 'join' && !meetingID) {
      return null;
    }

    return {
      action,
      userName,
      meetingID: meetingID || undefined,
      eventType: (parsed.searchParams.get('eventType') ?? 'conference').trim() || 'conference',
      duration: parsePositiveInteger(parsed.searchParams.get('duration'), 15),
      capacity: parsePositiveInteger(parsed.searchParams.get('capacity'), 4),
      renderUI:
        parsed.searchParams.get('ui') === '1' ||
        parsed.searchParams.get('renderUI') === '1',
      autoRequest: normalizeAutoRequest(parsed.searchParams.get('autoRequest')),
    };
  } catch {
    const isLiveLaunch = /:\/\/live(?:[/?#]|$)|\/live(?:[?#]|$)|[?&]live=1(?:&|$)/i.test(url);

    if (!isLiveLaunch) {
      return null;
    }

    const action = readRouteParam(url, 'action');
    const userName = (readRouteParam(url, 'userName') ?? '').trim();
    const meetingID = (readRouteParam(url, 'meetingID') ?? '').trim();

    if ((action !== 'create' && action !== 'join') || !userName) {
      return null;
    }

    if (action === 'join' && !meetingID) {
      return null;
    }

    return {
      action,
      userName,
      meetingID: meetingID || undefined,
      eventType: (readRouteParam(url, 'eventType') ?? 'conference').trim() || 'conference',
      duration: parsePositiveInteger(readRouteParam(url, 'duration'), 15),
      capacity: parsePositiveInteger(readRouteParam(url, 'capacity'), 4),
      renderUI:
        readRouteParam(url, 'ui') === '1' ||
        readRouteParam(url, 'renderUI') === '1',
      autoRequest: normalizeAutoRequest(readRouteParam(url, 'autoRequest')),
    };
  }
};

const buildLiveNoUIPreJoinOptions = (
  liveRoomRoute: LiveRoomRoute,
): CreateMediaSFURoomOptions | JoinMediaSFURoomOptions => {
  if (liveRoomRoute.action === 'join') {
    return {
      action: 'join',
      meetingID: liveRoomRoute.meetingID!,
      userName: liveRoomRoute.userName,
    };
  }

  return {
    action: 'create',
    capacity: liveRoomRoute.capacity,
    duration: liveRoomRoute.duration,
    eventType: liveRoomRoute.eventType,
    userName: liveRoomRoute.userName,
  };
};

const getInitialLiveDebugState = (liveRoomRoute?: LiveRoomRoute | false) => ({
  request: liveRoomRoute ? 'booting' : 'idle',
  status: liveRoomRoute ? 'booting' : 'inactive',
  room: liveRoomRoute && 'meetingID' in liveRoomRoute ? liveRoomRoute.meetingID ?? '' : '',
  member: liveRoomRoute && 'userName' in liveRoomRoute ? liveRoomRoute.userName : '',
  event: liveRoomRoute && 'eventType' in liveRoomRoute ? liveRoomRoute.eventType : '',
  participants: 0,
  host: false,
  cohost: false,
  audioRequestState: 'none',
  audioRequestTime: 0,
  micAction: false,
  videoRequestState: 'none',
  videoRequestTime: 0,
  videoAction: false,
  screenRequestState: 'none',
  screenRequestTime: 0,
  screenAction: false,
  shared: false,
  shareScreenStarted: false,
  error: 'none',
});

const extractResponseError = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    return 'unknown';
  }

  if ('error' in data && typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return 'unknown';
};

// -----------------------------------------------------------------------------
// Toggle Section
// -----------------------------------------------------------------------------
type ConnectionScenario = 'cloud' | 'hybrid' | 'ce';
type ExperienceKey = 'generic' | 'broadcast' | 'webinar' | 'conference' | 'chat';

// Switch deployment target: 'cloud' | 'hybrid' | 'ce'
const connectionScenario: ConnectionScenario = 'cloud';

// Select which prebuilt experience to render by default
// Options: 'generic', 'broadcast', 'webinar', 'conference', 'chat'
const selectedExperience: ExperienceKey = 'generic';

// UI strategy toggles
const showPrebuiltUI = true;           // Set false to bypass the default UI entirely
const enableFullCustomUI = false;      // Set true to mount the CustomWorkspace instead of MediaSFU UI
const enableNoUIPreJoin = !showPrebuiltUI || enableFullCustomUI; // auto-calculated helper

// Layered customization toggles
const enableCardBuilders = false;      // Keep the running app on the default prebuilt cards
const enableUICoreOverrides = false;    // Enables layout-centric overrides via uiOverrides
const enableModalOverrides = false;    // Keep the running app on the default modal set
const enableAudioComponentOverrides = false; // Keep the running app on the default audio surfaces
const enableContainerStyling = false;  // Avoid showcase-only shell styling on the validation surface
const enableBackendProxyHooks = true;  // Hooks create/join calls through helper functions
const enableDebugPanel = false;        // Do not render showcase/debug-only UI in the validation surface

const demoCloudConfig = getDemoCloudConfig();

const connectionPresets: Record<ConnectionScenario, {
  credentials?: { apiUserName: string; apiKey: string };
  localLink: string;
  connectMediaSFU: boolean;
}> = {
  cloud: {
    credentials: demoCloudConfig.credentials,
    localLink: '',
    connectMediaSFU: demoCloudConfig.connectMediaSFU,
  },
  hybrid: {
    credentials: demoCloudConfig.credentials,
    localLink: 'http://localhost:3000',
    connectMediaSFU: demoCloudConfig.connectMediaSFU,
  },
  ce: {
    credentials: undefined,
    localLink: 'http://localhost:3000',
    connectMediaSFU: false,
  },
};

const experienceComponentMap: Record<ExperienceKey, React.ComponentType<MediasfuGenericOptions>> = {
  generic: MediasfuGeneric,
  broadcast: MediasfuBroadcast,
  webinar: MediasfuWebinar,
  conference: MediasfuConference,
  chat: MediasfuChat,
};

// -----------------------------------------------------------------------------
// Demo Custom Components (Cards + Full UI)
// -----------------------------------------------------------------------------
const ShowcaseVideoCard: CustomVideoCardType = ({
  customStyle,
  containerProps,
  infoOverlayProps,
  controlsOverlayProps,
  backgroundColor,
  name,
  participant,
  videoStream,
  ...rest
}) => {

  return (
    <VideoCard
      {...rest}
      name={name}
      participant={participant}
      videoStream={videoStream}
      backgroundColor={backgroundColor}
      customStyle={{
        borderRadius: 20,
        border: `3px solid #4c1d95`,
        overflow: 'hidden',
        boxShadow: '0 28px 65px rgba(76, 29, 149, 0.35)',
        backgroundColor: backgroundColor ?? '#0f172a',
        ...customStyle,
      }}
      containerProps={{
        ...(containerProps ?? {}),
        style: {
          background: 'linear-gradient(140deg, rgba(15, 23, 42, 0.78), rgba(30, 64, 175, 0.45))',
          borderRadius: 26,
          ...(containerProps?.style ?? {}),
        },
      }}
      infoOverlayProps={{
        ...(infoOverlayProps ?? {}),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 16px',
          borderRadius: 999,
          background: 'rgba(79, 70, 229, 0.9)',
          color: '#f8fafc',
          fontWeight: 600,
          letterSpacing: 0.35,
          ...(infoOverlayProps?.style ?? {}),
        },
      }}
      controlsOverlayProps={{
        ...(controlsOverlayProps ?? {}),
        style: {
          background: 'rgba(15, 23, 42, 0.55)',
          borderRadius: 16,
          backdropFilter: 'blur(8px)',
          ...(controlsOverlayProps?.style ?? {}),
        },
      }}
    />
  );
};

const ShowcaseAudioCard: CustomAudioCardType = ({
  customStyle,
  cardProps,
  nameContainerProps,
  nameTextProps,
  barColor,
  ...rest
}) => {
  const accent = barColor ?? '#22c55e';

  return (
    <AudioCard
      {...rest}
      barColor={accent}
      customStyle={{
        borderRadius: 22,
        border: `2px solid ${accent}`,
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(21, 128, 61, 0.45))',
        boxShadow: '0 18px 40px rgba(21, 128, 61, 0.25)',
        ...customStyle,
      }}
      cardProps={{
        ...(cardProps ?? {}),
        style: {
          padding: 18,
          gap: 14,
          ...(cardProps?.style ?? {}),
        },
      }}
      nameContainerProps={{
        ...(nameContainerProps ?? {}),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          ...(nameContainerProps?.style ?? {}),
        },
      }}
      nameTextProps={{
        ...(nameTextProps ?? {}),
        style: {
          fontSize: 16,
          fontWeight: 600,
          color: '#14532d',
          ...(nameTextProps?.style ?? {}),
        },
      }}
    />
  );
};

const ShowcaseMiniCard: CustomMiniCardType = ({ customStyle, initials, fontSize, renderContainer, ...rest }) => {
  const decorateContainer = ({ defaultContainer }: { defaultContainer: React.ReactNode; isImage: boolean }) => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      {defaultContainer}
    </View>
  );

  const combinedRenderContainer = (options: { defaultContainer: React.ReactNode; isImage: boolean }) => {
    const decorated = decorateContainer(options);
    return renderContainer ? renderContainer({ defaultContainer: decorated, isImage: options.isImage }) : decorated;
  };

  return (
    <MiniCard
      {...rest}
      initials={initials}
      fontSize={fontSize ?? 16}
      customStyle={{
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#f59e0b',
        backgroundColor: '#fff7ed',
        color: '#b45309',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        ...customStyle,
      }}
      renderContainer={combinedRenderContainer}
    />
  );
};

const ShowcaseMiniAudio = (props: React.ComponentProps<typeof MiniAudio>) => {
  return (
    <MiniAudio
      {...props}
      customStyle={[
        props.customStyle,
        {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderRadius: 8,
          padding: 4,
        },
      ]}
    />
  );
};

const ShowcaseMiniAudioPlayer = (props: React.ComponentProps<typeof MiniAudioPlayer>) => {
  return (
    <MiniAudioPlayer
      {...props}
      MiniAudioComponent={ShowcaseMiniAudio}
    />
  );
};

const CustomWorkspace: CustomComponentType = ({ parameters }) => {
  const {
    roomName,
    participants,
    islevel,
    meetingID,
    showAlert,
    toggleMenuModal,
  } = parameters;

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#0f172a',
      }}
    >
      <View style={{ width: '100%', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(148, 163, 184, 0.3)' }}>
        <Text style={{ fontSize: 28, marginBottom: 8, color: '#f1f5f9', fontWeight: 'bold' }}>Custom Workspace</Text>
        <Text style={{ margin: 0, fontSize: 14, opacity: 0.8, color: '#f1f5f9' }}>
          Room <Text style={{ fontWeight: 'bold' }}>{roomName || 'Unnamed room'}</Text> · Meeting ID <Text style={{ fontWeight: 'bold' }}>{meetingID || 'pending'}</Text> · Your role level: <Text style={{ fontWeight: 'bold' }}>{islevel || 'viewer'}</Text>
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ padding: 24, borderRightWidth: 1, borderRightColor: 'rgba(148, 163, 184, 0.2)', width: 320 }}>
          <Text style={{ fontSize: 16, marginBottom: 12, color: '#f1f5f9', fontWeight: 'bold' }}>Participants ({participants?.length ?? 0})</Text>
          <ScrollView>
            {(participants ?? []).map((person: Participant) => (
              <View
                key={person.id ?? person.name}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 12,
                  backgroundColor: 'rgba(79, 70, 229, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(79, 70, 229, 0.4)',
                }}
              >
                <Text style={{ fontWeight: '600', color: '#f1f5f9' }}>{person.name}</Text>
                <Text style={{ fontSize: 12, opacity: 0.8, color: '#f1f5f9' }}>Level {person.islevel ?? 'n/a'}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={{ flex: 1, padding: 32 }}>
          <View
            style={{
              padding: 24,
              borderRadius: 18,
              backgroundColor: 'rgba(79, 70, 229, 0.25)',
              borderWidth: 1,
              borderColor: 'rgba(79, 70, 229, 0.55)',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.45,
              shadowRadius: 45,
              elevation: 18,
            }}
          >
            <Text style={{ marginBottom: 12, fontSize: 18, color: '#f1f5f9', fontWeight: 'bold' }}>Custom Controls</Text>
            <Text style={{ marginBottom: 18, fontSize: 14, maxWidth: 420, color: '#f1f5f9' }}>
              Trigger native alerts, switch MediaSFU menus, or call any exposed helper via <Text style={{ fontFamily: 'monospace' }}>parameters</Text>.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 999,
                  backgroundColor: '#22c55e',
                }}
                onPress={() =>
                  showAlert?.({ message: 'Custom workspace calling back into MediaSFU!', type: 'success' })
                }
              >
                <Text style={{ color: '#022c22', fontWeight: '600' }}>Trigger success toast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: 'rgba(148, 163, 184, 0.6)',
                  backgroundColor: 'transparent',
                }}
                onPress={() => toggleMenuModal?.({ showMenuModal: true })}
              >
                <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>Open menu modal</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ fontSize: 12, opacity: 0.6, marginTop: 16, color: '#f1f5f9' }}>
            Built using <Text style={{ fontFamily: 'monospace' }}>customComponent</Text>. Disable <Text style={{ fontFamily: 'monospace' }}>enableFullCustomUI</Text> to fall back to the standard UI.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const EnhancedMainContainer: React.FC<React.ComponentProps<typeof MainContainerComponent>> = (props) => (
  <View style={{ borderWidth: 4, borderStyle: 'dashed', borderColor: 'rgba(139, 92, 246, 0.8)', borderRadius: 28, padding: 16, backgroundColor: 'rgba(244, 244, 255, 0.55)' }}>
    <Text style={{ fontSize: 12, fontWeight: '600', textTransform: 'uppercase', color: '#6b21a8', marginBottom: 8 }}>
      Custom main container wrapper (uiOverrides.mainContainer)
    </Text>
    <MainContainerComponent {...props} />
  </View>
);

const EnhancedPagination: React.FC<React.ComponentProps<typeof Pagination>> = (props) => (
  <View style={{ backgroundColor: '#0ea5e9', padding: 10, borderRadius: 16 }}>
    <Text style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#f8fafc', marginBottom: 8 }}>Custom pagination shell</Text>
    <Pagination {...props} />
  </View>
);

const EnhancedAlert: React.FC<React.ComponentProps<typeof AlertComponent>> = (props) => (
  <AlertComponent
    {...props}
    containerProps={{
      ...props.containerProps,
      style: {
        ...(props.containerProps?.style ?? {}),
        borderRadius: 20,
        border: '2px solid rgba(249, 115, 22, 0.6)',
        boxShadow: '0 18px 38px rgba(249, 115, 22, 0.25)',
        overflow: 'hidden',
      },
    }}
  />
);

const FrostedMenuModal: React.FC<React.ComponentProps<typeof MenuModal>> = (props) => (
  <MenuModal
    {...props}
    overlayProps={{
      ...(props.overlayProps ?? {}),
      style: {
        backdropFilter: 'blur(16px)',
        background: 'rgba(15, 23, 42, 0.45)',
        ...(props.overlayProps?.style ?? {}),
      },
    }}
    contentProps={{
      ...(props.contentProps ?? {}),
      style: {
        borderRadius: 28,
        border: '1px solid rgba(148, 163, 184, 0.35)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.35)',
        background: 'linear-gradient(160deg, rgba(244, 244, 255, 0.92), rgba(224, 231, 255, 0.9))',
        color: '#0f172a',
        ...(props.contentProps?.style ?? {}),
      },
    }}
  />
);

const NeonParticipantsModal: React.FC<React.ComponentProps<typeof ParticipantsModal>> = (props) => (
  <ParticipantsModal
    {...props}
    contentProps={{
      ...(props.contentProps ?? {}),
      style: {
        borderRadius: 26,
        background: '#0f172a',
        color: '#e2e8f0',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        ...(props.contentProps?.style ?? {}),
      },
    }}
    headerProps={{
      ...(props.headerProps ?? {}),
      style: {
        ...(props.headerProps?.style ?? {}),
        borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
        padding: '18px 22px',
      },
    }}
    bodyProps={{
      ...(props.bodyProps ?? {}),
      style: {
        ...(props.bodyProps?.style ?? {}),
        background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 70%)',
      },
    }}
  />
);

const SoftConfirmExitModal: React.FC<React.ComponentProps<typeof ConfirmExitModal>> = (props) => (
  <ConfirmExitModal
    {...props}
    contentProps={{
      ...(props.contentProps ?? {}),
      style: {
        borderRadius: 24,
        background: '#fdf2f8',
        border: '1px solid rgba(236, 72, 153, 0.35)',
        ...(props.contentProps?.style ?? {}),
      },
    }}
    confirmButtonProps={{
      ...(props.confirmButtonProps ?? {}),
      style: {
        ...(props.confirmButtonProps?.style ?? {}),
        background: '#f97316',
        color: '#0f172a',
        borderRadius: 999,
        padding: '10px 22px',
        fontWeight: 600,
      },
    }}
    cancelButtonProps={{
      ...(props.cancelButtonProps ?? {}),
      style: {
        ...(props.cancelButtonProps?.style ?? {}),
        borderRadius: 999,
        padding: '10px 22px',
      },
    }}
  />
);

// Note: ScreenboardModal component not available in this SDK version
// const SlateScreenboardModal: React.FC<React.ComponentProps<typeof ScreenboardModal>> = (props) => (
//   <ScreenboardModal
//     {...props}
//     backgroundColor={props.backgroundColor ?? 'rgba(15, 23, 42, 0.9)'}
//     position={props.position ?? 'center'}
//   />
// );





// -----------------------------------------------------------------------------
// AppUnique Component
// -----------------------------------------------------------------------------
const AppUnique: React.FC = () => {
  const [liveRoomRoute, setLiveRoomRoute] = useState<LiveRoomRoute | false>(() => {
    if (typeof window !== 'undefined' && typeof window.location?.href === 'string') {
      return resolveLiveRoomRoute(window.location.href) ?? false;
    }

    return false;
  });
  const [sourceParameters, setSourceParameters] = useState<{ [key: string]: any }>({});
  const [liveDebugState, setLiveDebugState] = useState(() =>
    getInitialLiveDebugState(liveRoomRoute),
  );
  const [autoRequestSent, setAutoRequestSent] = useState(false);

  useEffect(() => {
    const applyRoute = (url?: string | null) => {
      const route = resolveLiveRoomRoute(url);
      setLiveRoomRoute((current) => route ?? current ?? false);
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      applyRoute(url);
    });

    Linking.getInitialURL().then(applyRoute).catch(() => undefined);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setLiveDebugState(getInitialLiveDebugState(liveRoomRoute));
  }, [
    liveRoomRoute && 'action' in liveRoomRoute ? liveRoomRoute.action : null,
    liveRoomRoute && 'autoRequest' in liveRoomRoute ? liveRoomRoute.autoRequest : null,
    liveRoomRoute && 'meetingID' in liveRoomRoute ? liveRoomRoute.meetingID : null,
    liveRoomRoute && 'userName' in liveRoomRoute ? liveRoomRoute.userName : null,
    liveRoomRoute && 'eventType' in liveRoomRoute ? liveRoomRoute.eventType : null,
    liveRoomRoute && 'renderUI' in liveRoomRoute ? liveRoomRoute.renderUI : null,
  ]);

  useEffect(() => {
    setAutoRequestSent(false);
  }, [
    liveRoomRoute && 'action' in liveRoomRoute ? liveRoomRoute.action : null,
    liveRoomRoute && 'autoRequest' in liveRoomRoute ? liveRoomRoute.autoRequest : null,
    liveRoomRoute && 'meetingID' in liveRoomRoute ? liveRoomRoute.meetingID : null,
    liveRoomRoute && 'userName' in liveRoomRoute ? liveRoomRoute.userName : null,
  ]);

  const liveModeRequested = Boolean(liveRoomRoute);
  const liveRoomWantsUI = Boolean(liveRoomRoute?.renderUI);

  const updateSourceParameters = (data: { [key: string]: any }) => {
    setSourceParameters(data);

    if (!liveModeRequested) {
      return;
    }

    const participantsCount =
      typeof data.participantsCounter === 'number'
        ? data.participantsCounter
        : Array.isArray(data.participants)
          ? data.participants.length
          : 0;

    const nextAudioRequestState =
      typeof data.audioRequestState === 'string'
        ? data.audioRequestState
        : data.audioRequestState === null
          ? 'none'
          : undefined;
    const nextAudioRequestTime =
      typeof data.audioRequestTime === 'number' && Number.isFinite(data.audioRequestTime)
        ? data.audioRequestTime
        : undefined;
    const nextMicAction =
      typeof data.micAction === 'boolean' ? data.micAction : undefined;
    const nextVideoRequestState =
      typeof data.videoRequestState === 'string'
        ? data.videoRequestState
        : data.videoRequestState === null
          ? 'none'
          : undefined;
    const nextVideoRequestTime =
      typeof data.videoRequestTime === 'number' && Number.isFinite(data.videoRequestTime)
        ? data.videoRequestTime
        : undefined;
    const nextVideoAction =
      typeof data.videoAction === 'boolean' ? data.videoAction : undefined;

    const nextScreenRequestState =
      typeof data.screenRequestState === 'string'
        ? data.screenRequestState
        : data.screenRequestState === null
          ? 'none'
          : undefined;
    const nextScreenRequestTime =
      typeof data.screenRequestTime === 'number' && Number.isFinite(data.screenRequestTime)
        ? data.screenRequestTime
        : undefined;
    const nextScreenAction =
      typeof data.screenAction === 'boolean' ? data.screenAction : undefined;
    const nextShared =
      typeof data.shared === 'boolean' ? data.shared : undefined;
    const nextShareScreenStarted =
      typeof data.shareScreenStarted === 'boolean'
        ? data.shareScreenStarted
        : undefined;

    setLiveDebugState((current) => ({
      ...current,
      request: data.validated
        ? liveRoomRoute?.action === 'join'
          ? 'room-joined'
          : 'room-active'
        : current.request,
      status: data.validated ? 'validated' : current.status === 'error' ? 'error' : 'connecting',
      room:
        typeof data.roomName === 'string' && data.roomName.trim()
          ? data.roomName
          : current.room,
      member:
        typeof data.member === 'string' && data.member.trim()
          ? data.member
          : current.member,
      event:
        typeof data.eventType === 'string' && data.eventType.trim()
          ? data.eventType
          : current.event,
      participants: participantsCount,
      host: Boolean(data.youAreHost),
      cohost: Boolean(data.youAreCoHost),
      audioRequestState: nextAudioRequestState ?? current.audioRequestState,
      audioRequestTime: nextAudioRequestTime ?? current.audioRequestTime,
      micAction: nextMicAction ?? current.micAction,
      videoRequestState: nextVideoRequestState ?? current.videoRequestState,
      videoRequestTime: nextVideoRequestTime ?? current.videoRequestTime,
      videoAction: nextVideoAction ?? current.videoAction,
      screenRequestState: nextScreenRequestState ?? current.screenRequestState,
      screenRequestTime: nextScreenRequestTime ?? current.screenRequestTime,
      screenAction: nextScreenAction ?? current.screenAction,
      shared: nextShared ?? current.shared,
      shareScreenStarted: nextShareScreenStarted ?? current.shareScreenStarted,
    }));
  };

  useEffect(() => {
    if (
      !liveModeRequested ||
      autoRequestSent ||
      liveRoomRoute?.action !== 'join' ||
      liveDebugState.status !== 'validated' ||
      !liveRoomRoute.autoRequest
    ) {
      return;
    }

    const liveSocket = sourceParameters.socket;
    const roomName =
      typeof sourceParameters.roomName === 'string' && sourceParameters.roomName.trim()
        ? sourceParameters.roomName
        : liveRoomRoute.meetingID;
    const memberName =
      typeof sourceParameters.member === 'string' && sourceParameters.member.trim()
        ? sourceParameters.member
        : liveRoomRoute.userName;

    if (!liveSocket?.emit || !liveSocket?.id || !roomName || !memberName) {
      return;
    }

    const requestConfig =
      liveRoomRoute.autoRequest === 'audio'
        ? {
            icon: 'fa-microphone',
            applyLocalState: () => {
              sourceParameters.updateAudioRequestState?.('pending');
              setLiveDebugState((current) => ({
                ...current,
                audioRequestState: 'pending',
              }));
            },
          }
        : liveRoomRoute.autoRequest === 'video'
          ? {
              icon: 'fa-video',
              applyLocalState: () => {
                sourceParameters.updateVideoRequestState?.('pending');
                setLiveDebugState((current) => ({
                  ...current,
                  videoRequestState: 'pending',
                }));
              },
            }
          : {
              icon: 'fa-desktop',
              applyLocalState: () => {
                sourceParameters.updateScreenRequestState?.('pending');
                setLiveDebugState((current) => ({
                  ...current,
                  screenRequestState: 'pending',
                }));
              },
            };

    requestConfig.applyLocalState();
    liveSocket.emit('participantRequest', {
      userRequest: {
        id: liveSocket.id,
        name: memberName,
        icon: requestConfig.icon,
      },
      roomName,
    });
    setAutoRequestSent(true);
  }, [
    autoRequestSent,
    liveDebugState.status,
    liveModeRequested,
    liveRoomRoute,
    sourceParameters,
  ]);

  // ---------------------------------------------------------------------------
  // Connection Scenarios
  // ---------------------------------------------------------------------------
  const preset = connectionPresets[connectionScenario];
  const { credentials, localLink, connectMediaSFU } = preset;
  const useHeadlessPreJoin = (liveModeRequested && !liveRoomWantsUI) || enableNoUIPreJoin;
  const returnUI = (liveRoomWantsUI || !liveModeRequested) && !enableFullCustomUI && showPrebuiltUI;

  // When the UI is bypassed, simulate pre-join input here
  const noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions | undefined = liveRoomRoute
    ? buildLiveNoUIPreJoinOptions(liveRoomRoute)
    : enableNoUIPreJoin
      ? {
        action: 'create',
        capacity: 12,
        duration: 30,
        eventType: 'conference',
        userName: 'Demo Host',
      }
      : undefined;

  const createMediaSFURoom = async (
    options: Parameters<typeof createRoomOnMediaSFU>[0],
  ) => {
    if (liveModeRequested) {
      setLiveDebugState((current) => ({
        ...current,
        request: 'creating-room',
        status: 'connecting',
        error: 'none',
      }));
    }

    const response = await createRoomOnMediaSFU(options);

    if (liveModeRequested) {
      if (response.success && response.data && 'roomName' in response.data) {
        setLiveDebugState((current) => ({
          ...current,
          request: 'room-created',
          status: 'awaiting-room',
          room: response.data.roomName,
          member: options.payload.userName,
          event: options.payload.eventType,
          error: 'none',
        }));
      } else {
        setLiveDebugState((current) => ({
          ...current,
          request: 'create-failed',
          status: 'error',
          error: extractResponseError(response.data),
        }));
      }
    }

    return response;
  };

  const joinMediaSFURoom = async (
    options: Parameters<typeof joinRoomOnMediaSFU>[0],
  ) => {
    if (liveModeRequested) {
      setLiveDebugState((current) => ({
        ...current,
        request: 'joining-room',
        status: 'connecting',
        error: 'none',
      }));
    }

    const response = await joinRoomOnMediaSFU(options);

    if (liveModeRequested) {
      if (response.success) {
        setLiveDebugState((current) => ({
          ...current,
          request: 'room-joined',
          status: 'awaiting-room',
          room: options.payload.meetingID,
          member: options.payload.userName,
          error: 'none',
        }));
      } else {
        setLiveDebugState((current) => ({
          ...current,
          request: 'join-failed',
          status: 'error',
          error: extractResponseError(response.data),
        }));
      }
    }

    return response;
  };

  const cardOverrides = useMemo<
    Partial<Pick<MediasfuGenericOptions, 'customVideoCard' | 'customAudioCard' | 'customMiniCard'>>
  >(() => {
    if (!enableCardBuilders) {
      return {};
    }

    return {
      customVideoCard: ShowcaseVideoCard,
      customAudioCard: ShowcaseAudioCard,
      customMiniCard: ShowcaseMiniCard,
    };
  }, []);

  const uiOverrides = useMemo<MediasfuUICustomOverrides | undefined>(() => {
    if (!enableUICoreOverrides && !enableModalOverrides && !enableAudioComponentOverrides) {
      return undefined;
    }

    const overrides: MediasfuUICustomOverrides = {};

    if (enableUICoreOverrides) {
      overrides.mainContainer = { component: EnhancedMainContainer };
      overrides.pagination = { component: EnhancedPagination };
      overrides.alert = { component: EnhancedAlert };
    }

    if (enableModalOverrides) {
      overrides.menuModal = { component: FrostedMenuModal };
      overrides.participantsModal = { component: NeonParticipantsModal };
      overrides.confirmExitModal = { component: SoftConfirmExitModal };
      // overrides.screenboardModal = { component: SlateScreenboardModal }; // Not available
    }

    if (enableAudioComponentOverrides) {
      overrides.miniAudio = { component: ShowcaseMiniAudio };
      overrides.miniAudioPlayer = { component: ShowcaseMiniAudioPlayer };
    }

    return Object.keys(overrides).length > 0 ? overrides : undefined;
  }, []);

  const containerStyle = enableContainerStyling
    ? {
        background: 'linear-gradient(135deg, #f9fafb 0%, #e0f2fe 45%, #ede9fe 100%)',
        borderRadius: 32,
        padding: '12px 12px 24px',
        boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
      }
    : undefined;

  const ExperienceComponent = experienceComponentMap[selectedExperience];

  const preJoinRenderer = returnUI
    ? (options: React.ComponentProps<typeof PreJoinPage>) => <PreJoinPage {...options} />
    : undefined;

  const customComponent = !liveModeRequested && enableFullCustomUI ? CustomWorkspace : undefined;

  const liveDebugLines = liveModeRequested
    ? [
        'sdk: expo',
        `action: ${liveRoomRoute?.action ?? 'unknown'}`,
        `request: ${liveDebugState.request}`,
        `status: ${liveDebugState.status}`,
        `room: ${liveDebugState.room || 'pending'}`,
        `member: ${liveDebugState.member || liveRoomRoute?.userName || 'pending'}`,
        `event: ${liveDebugState.event || liveRoomRoute?.eventType || 'pending'}`,
        `participants: ${liveDebugState.participants}`,
        `host: ${liveDebugState.host ? 'yes' : 'no'}`,
        `cohost: ${liveDebugState.cohost ? 'yes' : 'no'}`,
        `audioRequestState: ${liveDebugState.audioRequestState}`,
        `audioCooldown: ${liveDebugState.audioRequestTime > Date.now() ? Math.ceil((liveDebugState.audioRequestTime - Date.now()) / 1000) : 0}`,
        `micAction: ${liveDebugState.micAction ? 'yes' : 'no'}`,
        `videoRequestState: ${liveDebugState.videoRequestState}`,
        `videoCooldown: ${liveDebugState.videoRequestTime > Date.now() ? Math.ceil((liveDebugState.videoRequestTime - Date.now()) / 1000) : 0}`,
        `videoAction: ${liveDebugState.videoAction ? 'yes' : 'no'}`,
        `screenRequestState: ${liveDebugState.screenRequestState}`,
        `screenCooldown: ${liveDebugState.screenRequestTime > Date.now() ? Math.ceil((liveDebugState.screenRequestTime - Date.now()) / 1000) : 0}`,
        `screenAction: ${liveDebugState.screenAction ? 'yes' : 'no'}`,
        `shared: ${liveDebugState.shared ? 'yes' : 'no'}`,
        `shareScreenStarted: ${liveDebugState.shareScreenStarted ? 'yes' : 'no'}`,
        `error: ${liveDebugState.error}`,
      ]
    : [];

  const experienceKey = liveModeRequested
    ? [
        selectedExperience,
        'live',
        liveRoomRoute?.action ?? 'unknown',
        liveRoomRoute?.meetingID ?? liveRoomRoute?.eventType ?? 'pending',
        liveRoomRoute?.userName ?? 'pending',
        liveRoomRoute?.renderUI ? 'ui' : 'headless',
      ].join(':')
    : `${selectedExperience}:default`;

  return (
    <>
      <ExperienceComponent
          key={experienceKey}
          PrejoinPage={preJoinRenderer}
          localLink={localLink}
          connectMediaSFU={connectMediaSFU}
          credentials={credentials}
          returnUI={returnUI}
          noUIPreJoinOptions={liveModeRequested || useHeadlessPreJoin ? noUIPreJoinOptions : undefined}
          autoProceedPreJoin={liveRoomWantsUI ? true : undefined}
          sourceParameters={liveModeRequested || useHeadlessPreJoin ? sourceParameters : undefined}
          updateSourceParameters={liveModeRequested || useHeadlessPreJoin ? updateSourceParameters : undefined}
          customComponent={customComponent}
          // containerStyle={containerStyle}
          uiOverrides={uiOverrides}
          createMediaSFURoom={enableBackendProxyHooks || liveModeRequested ? createMediaSFURoom : undefined}
          joinMediaSFURoom={enableBackendProxyHooks || liveModeRequested ? joinMediaSFURoom : undefined}
          {...cardOverrides}
        />

      {liveModeRequested ? (
        <View
          testID="live-debug-expo"
          accessibilityLabel="live-debug-expo"
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            zIndex: 9999,
          }}
        >
          <Text selectable style={{ color: '#e2e8f0', fontSize: 12, lineHeight: 18 }}>
            {liveDebugLines.join('\n')}
          </Text>
        </View>
      ) : null}
    </>
  );
};

const RootApp = process.env.EXPO_PUBLIC_MEDIASFU_VISUAL_AUDIT === '1' ? AppVisualAudit : AppUnique;

export default RootApp;





