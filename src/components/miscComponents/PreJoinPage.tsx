import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import { Socket } from "socket.io-client";
import {
  ConnectSocketType,
  ShowAlert,
  ConnectLocalSocketType,
  ResponseLocalConnection,
  ResponseLocalConnectionData,
  RecordingParams,
  MeetingRoomParams,
  CreateMediaSFURoomOptions,
  JoinMediaSFURoomOptions,
} from "../../@types/types";
import RNPickerSelect from "react-native-picker-select";
import { checkLimitsAndMakeRequest } from "../../methods/utils/checkLimitsAndMakeRequest";
import { createRoomOnMediaSFU } from "../../methods/utils/createRoomOnMediaSFU";
import { CreateRoomOnMediaSFUType, JoinRoomOnMediaSFUType, joinRoomOnMediaSFU } from "../../methods/utils/joinRoomOnMediaSFU";

/**
 * Interface defining the parameters for joining a local event room.
 */
export interface JoinLocalEventRoomParameters {
  eventID: string;
  userName: string;
  secureCode?: string;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
}

/**
 * Interface defining the options for joining a local event room.
 */
export interface JoinLocalEventRoomOptions {
  joinData: JoinLocalEventRoomParameters;
  link?: string;
}

/**
 * Interface defining the response structure when creating or joining a local room.
 */
export interface CreateLocalRoomParameters {
  eventID: string;
  duration: number;
  capacity: number;
  userName: string;
  scheduledDate: Date;
  secureCode: string;
  waitRoom?: boolean;
  recordingParams?: RecordingParams;
  eventRoomParams?: MeetingRoomParams;
  videoPreference?: string | null;
  audioPreference?: string | null;
  audioOutputPreference?: string | null;
  mediasfuURL?: string;
}

/**
 * Interface defining the response structure when joining a local room.
 */
export interface CreateLocalRoomOptions {
  createData: CreateLocalRoomParameters;
  link?: string;
}

/**
 * Interface defining the response structure when creating or joining a local room.
 */
export interface CreateJoinLocalRoomResponse {
  success: boolean;
  secret: string;
  reason?: string;
  url?: string;
}

/**
 * Interface defining the parameters for the PreJoinPage component.
 */
export interface PreJoinPageParameters {
  /**
   * Source URL for the logo image.
   * Defaults to 'https://mediasfu.com/images/logo192.png' if not provided.
   */
  imgSrc?: string;

  /**
   * Function to display alert messages.
   */
  showAlert?: ShowAlert;

  /**
   * Function to toggle the visibility of the loading modal.
   */
  updateIsLoadingModalVisible: (visible: boolean) => void;

  /**
   * Function to establish a socket connection.
   */
  connectSocket: ConnectSocketType;

  /**
   * Function to establish a socket connection to a local server.
   */
  connectLocalSocket?: ConnectLocalSocketType;

  /**
   * Function to update the socket instance in the parent state.
   */
  updateSocket: (socket: Socket) => void;

  /**
   * Function to update the socket instance in the parent state.
   */
  updateLocalSocket?: (socket: Socket) => void;

  /**
   * Function to update the validation state in the parent.
   */
  updateValidated: (validated: boolean) => void;

  /**
   * Function to update the API username in the parent state.
   */
  updateApiUserName: (apiUserName: string) => void;

  /**
   * Function to update the API token in the parent state.
   */
  updateApiToken: (apiToken: string) => void;

  /**
   * Function to update the event link in the parent state.
   */
  updateLink: (link: string) => void;

  /**
   * Function to update the room name in the parent state.
   */
  updateRoomName: (roomName: string) => void;

  /**
   * Function to update the member name in the parent state.
   */
  updateMember: (member: string) => void;
}

/**
 * Interface defining the credentials.
 */
export interface Credentials {
  apiUserName: string;
  apiKey: string;
}

/**
 * Interface defining the options for the PreJoinPage component.
 */
export interface PreJoinPageOptions {
  /**
   * link to the local server (Community Edition)
   */
  localLink?: string;

  /**
   * Determines if the user is allowed to connect to the MediaSFU server.
   */
  connectMediaSFU?: boolean;

  /**
   * Parameters required by the PreJoinPage component.
   */
  parameters: PreJoinPageParameters;

  /**
   * Optional user credentials. Defaults to predefined credentials if not provided.
   */
  credentials?: Credentials;

  /**
   * Flag to determine if the component should return the UI.
   */
  returnUI?: boolean;

  /**
   * Options for creating/joining a room without UI.
   */
  noUIPreJoinOptions?: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;

  /**
   * Function to create a room on MediaSFU.
   */
  createMediaSFURoom?: CreateRoomOnMediaSFUType;

  /**
   * Function to join a room on MediaSFU.
   */
  joinMediaSFURoom?: JoinRoomOnMediaSFUType;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;

/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 *
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {PreJoinPageParameters} props.parameters - Various parameters required for the component.
 * @param {ShowAlert} [props.parameters.showAlert] - Function to show alert messages.
 * @param {() => void} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {ConnectSocketType} props.parameters.connectSocket - Function to connect to the socket.
 * @param {ConnectSocketType} props.parameters.connectLocalSocket - Function to connect to the local socket.
 * @param {Socket} props.parameters.updateSocket - Function to update the socket.
 * @param {Socket} props.parameters.updateLocalSocket - Function to update the local socket.
 * @param {() => void} props.parameters.updateValidated - Function to update the validation status.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Credentials} [props.credentials=user_credentials] - The user credentials containing the API username and API key.
 * @param {boolean} [props.returnUI=false] - Flag to determine if the component should return the UI.
 * @param {CreateMediaSFURoomOptions | JoinMediaSFURoomOptions} [props.noUIPreJoinOptions] - The options for creating/joining a room without UI.
 * @param {string} [props.localLink=""] - The link to the local server.
 * @param {boolean} [props.connectMediaSFU=true] - Flag to determine if the component should connect to MediaSFU.
 * @param {CreateRoomOnMediaSFUType} [props.createMediaSFURoom] - Function to create a room on MediaSFU.
 * @param {JoinRoomOnMediaSFUType} [props.joinMediaSFURoom] - Function to join a room on MediaSFU.
 *
 * @returns {JSX.Element} The rendered PreJoinPage component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { PreJoinPage } from 'mediasfu-reactnative-expo';
 * import { JoinLocalRoomOptions } from 'mediasfu-reactnative-expo';
 *
 * function App() {
 *  *   const showAlertFunction = (message: string) => console.log(message);
 *   const updateLoadingFunction = (visible: boolean) => console.log(`Loading: ${visible}`);
 *   const connectSocketFunction = () => {}; // Connect socket function
 *   const updateSocketFunction = (socket: Socket) => {}; // Update socket function
 *   const updateValidatedFunction = (validated: boolean) => {}; // Update validated function
 *   const updateApiUserNameFunction = (userName: string) => {}; // Update API username function
 *   const updateApiTokenFunction = (token: string) => {}; // Update API token function
 *   const updateLinkFunction = (link: string) => {}; // Update link function
 *   const updateRoomNameFunction = (roomName: string) => {}; // Update room name function
 *   const updateMemberFunction = (member: string) => {}; // Update member function
 *
 *   return (
 *     <PreJoinPage
 *       parameters={{
 *         showAlert: showAlertFunction,
 *         updateIsLoadingModalVisible: updateLoadingFunction,
 *         connectSocket: connectSocketFunction,
 *         updateSocket: updateSocketFunction,
 *         updateValidated: updateValidatedFunction,
 *         updateApiUserName: updateApiUserNameFunction,
 *         updateApiToken: updateApiTokenFunction,
 *         updateLink: updateLinkFunction,
 *         updateRoomName: updateRoomNameFunction,
 *         updateMember: updateMemberFunction,
 *         imgSrc: "https://example.com/logo.png"
 *       }}
 *       credentials={{
 *         apiUserName: "user123",
 *         apiKey: "apikey123"
 *       }}
 *      returnUI={true} 
 *      noUIPreJoinOptions={{
 *      action: "create",
 *      capacity: 10,
 *      duration: 15,
 *      eventType: "broadcast",
 *      userName: "Prince",
 *      }}
 *      connectMediaSFU={true}
 *      localLink="http://localhost:3000"
 *     />
 *   );
 * };
 *
 *
 * export default App;
 * ```
 */

const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  localLink = "",
  connectMediaSFU = true,
  parameters,
  credentials,
  returnUI = false,
  noUIPreJoinOptions,
  createMediaSFURoom = createRoomOnMediaSFU,
  joinMediaSFURoom = joinRoomOnMediaSFU,
}) => {
  // State variables
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");
  const pending = useRef(false);

  const localConnected = useRef(false);
  const localData = useRef<ResponseLocalConnectionData | undefined>(undefined);
  const initSocket = useRef<Socket | undefined>(undefined);

  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectLocalSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  const handleCreateRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as CreateMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !duration || !eventType || !capacity) {
        setError("Please fill all the fields.");
        return;
      }
      payload = {
        action: "create",
        duration: parseInt(duration),
        capacity: parseInt(capacity),
        eventType: eventType as "chat" | "broadcast" | "webinar" | "conference",
        userName: name,
        recordOnly: false,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        payload = noUIPreJoinOptions as CreateMediaSFURoomOptions;
      } else {
        pending.current = false;
        throw new Error(
          "Invalid options provided for creating a room without UI."
        );
      }
    }

    updateIsLoadingModalVisible(true);

    if (localLink.length > 0) {
      const secureCode =
        Math.random().toString(30).substring(2, 14) +
        Math.random().toString(30).substring(2, 14);
      let eventID =
        new Date().getTime().toString(30) +
        new Date().getUTCMilliseconds() +
        Math.floor(10 + Math.random() * 99).toString();
      eventID = "m" + eventID;
      const eventRoomParams = localData.current?.meetingRoomParams_;
      eventRoomParams!.type = eventType as
        | "chat"
        | "broadcast"
        | "webinar"
        | "conference";

      const createData: CreateLocalRoomParameters = {
        eventID: eventID,
        duration: payload.duration,
        capacity: payload.capacity,
        userName: payload.userName,
        scheduledDate: new Date(),
        secureCode: secureCode,
        waitRoom: false,
        recordingParams: localData.current?.recordingParams_,
        eventRoomParams: eventRoomParams,
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
        mediasfuURL: "",
      };

      // socket in main window is required and for no local room, no use of initSocket
      // for local room, initSocket becomes the local socket, and localSocket is the connection to MediaSFU (if connectMediaSFU is true)
      // else localSocket is the same as initSocket

      if (
        connectMediaSFU &&
        initSocket.current &&
        localData.current &&
        localData.current.apiUserName &&
        localData.current.apiKey
      ) {
        payload.recordOnly = true; // allow production to mediasfu only; no consumption
        const response = await roomCreator({
          payload,
          apiUserName: localData.current.apiUserName,
          apiKey: localData.current.apiKey,
          validate: false,
        });
        if (
          response &&
          response.success &&
          response.data &&
          "roomName" in response.data
        ) {
          createData.eventID = response.data.roomName;
          createData.secureCode = response.data.secureCode || "";
          createData.mediasfuURL = response.data.publicURL;
          await createLocalRoom({
            createData: createData,
            link: response.data.link,
          });
        } else {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room on MediaSFU.`);
          try {
            updateSocket(initSocket.current);
            await createLocalRoom({ createData: createData });
            pending.current = false;
          } catch (error) {
            pending.current = false;
            updateIsLoadingModalVisible(false);
            setError(`Unable to create room. ${error}`);
          }
        }
      } else {
        try {
          updateSocket(initSocket.current!);
          await createLocalRoom({ createData: createData });
          pending.current = false;
        } catch (error) {
          pending.current = false;
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${error}`);
        }
      }
    } else {
      await roomCreator({
        payload,
        apiUserName: credentials.apiUserName,
        apiKey: credentials.apiKey,
        validate: true,
      });
      pending.current = false;
    }
  };

  const handleJoinRoom = async () => {
    if (pending.current) {
      return;
    }
    pending.current = true;
    let payload = {} as JoinMediaSFURoomOptions;
    if (returnUI) {
      if (!name || !eventID) {
        setError("Please fill all the fields.");
        return;
      }

      payload = {
        action: "join",
        meetingID: eventID,
        userName: name,
      };
    } else {
      if (
        noUIPreJoinOptions &&
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        payload = noUIPreJoinOptions as JoinMediaSFURoomOptions;
      } else {
        throw new Error(
          "Invalid options provided for joining a room without UI."
        );
      }
    }

    if (localLink.length > 0 && !localLink.includes("mediasfu.com")) {
      const joinData: JoinLocalEventRoomParameters = {
        eventID: payload.meetingID,
        userName: payload.userName,
        secureCode: "",
        videoPreference: null,
        audioPreference: null,
        audioOutputPreference: null,
      };

      await joinLocalRoom({ joinData: joinData });
      pending.current = false;
      return;
    }

    updateIsLoadingModalVisible(true);

    const response = await joinMediaSFURoom({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: payload.userName,
        parameters: parameters,
      });
      setError("");
      pending.current = false;
    } else {
      pending.current = false;
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to join room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const joinLocalRoom = async ({
    joinData,
    link = localLink,
  }: JoinLocalEventRoomOptions) => {
    initSocket.current?.emit(
      "joinEventRoom",
      joinData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(joinData.eventID);
          updateMember(joinData.userName);
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to join room. ${response.reason}`);
        }
      }
    );
  };

  const createLocalRoom = async ({
    createData,
    link = localLink,
  }: CreateLocalRoomOptions) => {
    initSocket.current?.emit(
      "createRoom",
      createData,
      (response: CreateJoinLocalRoomResponse) => {
        if (response.success) {
          updateSocket(initSocket.current!);
          updateApiUserName(localData.current?.apiUserName || "");
          updateApiToken(response.secret);
          updateLink(link);
          updateRoomName(createData.eventID);
          // local needs islevel updated from here
          // we update member as `userName` + "_2" and split it in the room
          updateMember(createData.userName + "_2");
          updateIsLoadingModalVisible(false);
          updateValidated(true);
        } else {
          updateIsLoadingModalVisible(false);
          setError(`Unable to create room. ${response.reason}`);
        }
      }
    );
  };

  const roomCreator = async ({
    payload,
    apiUserName,
    apiKey,
    validate = true,
  }: {
    payload: any;
    apiUserName: string;
    apiKey: string;
    validate?: boolean;
  }) => {
    const response = await createMediaSFURoom({
      payload,
      apiUserName: apiUserName,
      apiKey: apiKey,
      localLink: localLink,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: payload.userName,
        parameters: parameters,
        validate: validate,
      });
      return response;
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to create room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const checkProceed = async ({
    returnUI,
    noUIPreJoinOptions,
  }: {
    returnUI: boolean;
    noUIPreJoinOptions: CreateMediaSFURoomOptions | JoinMediaSFURoomOptions;
  }) => {
    if (!returnUI && noUIPreJoinOptions) {
      if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "create"
      ) {
        // update all the required parameters and call
        const createOptions: CreateMediaSFURoomOptions =
          noUIPreJoinOptions as CreateMediaSFURoomOptions;
        if (
          !createOptions.userName ||
          !createOptions.duration ||
          !createOptions.eventType ||
          !createOptions.capacity
        ) {
          throw new Error(
            "Please provide all the required parameters: userName, duration, eventType, capacity"
          );
        }

        await handleCreateRoom();
      } else if (
        "action" in noUIPreJoinOptions &&
        noUIPreJoinOptions.action === "join"
      ) {
        // update all the required parameters and call
        const joinOptions: JoinMediaSFURoomOptions =
          noUIPreJoinOptions as JoinMediaSFURoomOptions;
        if (!joinOptions.userName || !joinOptions.meetingID) {
          throw new Error(
            "Please provide all the required parameters: userName, meetingID"
          );
        }

        await handleJoinRoom();
      } else {
        throw new Error(
          "Invalid options provided for creating/joining a room without UI."
        );
      }
    }
  };

  useEffect(() => {
    if (
      localLink.length > 0 &&
      !localConnected.current &&
      !initSocket.current
    ) {
      try {
        connectLocalSocket?.({ link: localLink })
          .then((response: ResponseLocalConnection | undefined) => {
            localData.current = response!.data;
            initSocket.current = response!.socket;
            localConnected.current = true;

            if (!returnUI && noUIPreJoinOptions) {
              checkProceed({ returnUI, noUIPreJoinOptions });
            }
          })
          .catch((error) => {
            showAlert?.({
              message: `Unable to connect to ${localLink}. ${error}`,
              type: "danger",
              duration: 3000,
            });
          });
      } catch {
        showAlert?.({
          message: `Unable to connect to ${localLink}. Something went wrong.`,
          type: "danger",
          duration: 3000,
        });
      }
    } else if (localLink.length === 0 && !initSocket.current) {
      if (!returnUI && noUIPreJoinOptions) {
        checkProceed({ returnUI, noUIPreJoinOptions });
      }
    }
  }, []);

  const handleToggleMode = () => {
    setIsCreateMode(!isCreateMode);
    setError("");
  };

  /**
   * Locks the orientation to portrait mode when the component mounts and unlocks on unmount.
   */
  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  if (!returnUI) {
    return <></>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.container,
            Platform.OS === "web" && { maxWidth: 600, alignSelf: "center" },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri:
                  parameters.imgSrc ||
                  "https://mediasfu.com/images/logo192.png",
              }}
              style={styles.logoImage}
            />
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {isCreateMode ? (
              <>
                <TextInput
                  style={styles.inputField}
                  placeholder="Display Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Display Name"
                  placeholderTextColor="gray"
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Duration (minutes)"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Duration (minutes)"
                  placeholderTextColor="gray"
                />

                <RNPickerSelect
                  onValueChange={(value: string) => {
                    setEventType(value);
                  }}
                  items={[
                    { label: "Chat", value: "chat" },
                    { label: "Broadcast", value: "broadcast" },
                    { label: "Webinar", value: "webinar" },
                    { label: "Conference", value: "conference" },
                  ]}
                  value={eventType}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: "Select Event Type",
                    value: "",
                    color: "gray",
                  }}
                  useNativeAndroidPickerStyle={false}
                />
                <View style={styles.gap} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Room Capacity"
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Room Capacity"
                  placeholderTextColor="gray"
                />
                <Pressable
                  style={styles.actionButton}
                  onPress={handleCreateRoom}
                  accessibilityRole="button"
                  accessibilityLabel="Create Room"
                >
                  <Text style={styles.actionButtonText}>Create Room</Text>
                </Pressable>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.inputField}
                  placeholder="Display Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Display Name"
                  placeholderTextColor="gray"
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Event ID"
                  value={eventID}
                  onChangeText={setEventID}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Event ID"
                  placeholderTextColor="gray"
                />
                <Pressable
                  style={styles.actionButton}
                  onPress={handleJoinRoom}
                  accessibilityRole="button"
                  accessibilityLabel="Join Room"
                >
                  <Text style={styles.actionButtonText}>Join Room</Text>
                </Pressable>
              </>
            )}
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* OR Separator */}
          <View style={styles.orContainer}>
            <Text style={styles.orText}>OR</Text>
          </View>

          {/* Toggle Mode Button */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={styles.toggleButton}
              onPress={handleToggleMode}
              accessibilityRole="button"
              accessibilityLabel={
                isCreateMode ? "Switch to Join Mode" : "Switch to Create Mode"
              }
            >
              <Text style={styles.toggleButtonText}>
                {isCreateMode ? "Switch to Join Mode" : "Switch to Create Mode"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PreJoinPage;

/**
 * Stylesheet for the PreJoinPage component.
 */
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#53C6E0",
    paddingVertical: 10,
    maxHeight: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  toggleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    backgroundColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  orText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  gap: {
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "black",
    paddingRight: 20,
  },
  inputAndroid: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "black",
    paddingRight: 20,
  },
  inputWeb: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "black",
    paddingRight: 20,
  },
  placeholder: {
    color: "gray",
  },
});
