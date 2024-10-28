// BreakoutRoomsModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {
  BreakoutParticipant,
  Participant,
  ShowAlert,
} from '../../@types/types';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { FontAwesome5 } from "@expo/vector-icons";
import { Socket } from 'socket.io-client';

interface EditRoomModalOptions {
  editRoomModalVisible: boolean;
  setEditRoomModalVisible: (visible: boolean) => void;
  currentRoom: BreakoutParticipant[] | null;
  participantsRef: React.MutableRefObject<Participant[]>;
  handleAddParticipant: (
    roomIndex: number,
    participant: Participant | BreakoutParticipant
  ) => void;
  handleRemoveParticipant: (
    roomIndex: number,
    participant: Participant | BreakoutParticipant
  ) => void;
  currentRoomIndex: number | null;
}

export interface BreakoutRoomsModalParameters {
  participants: Participant[];
  showAlert?: ShowAlert;
  socket: Socket;
  itemPageLimit: number;
  meetingDisplayType: string;
  prevMeetingDisplayType: string;
  roomName: string;
  shareScreenStarted: boolean;
  shared: boolean;
  breakOutRoomStarted: boolean;
  breakOutRoomEnded: boolean;
  isBreakoutRoomsModalVisible: boolean;
  currentRoomIndex: number | null;
  canStartBreakout: boolean;
  breakoutRooms: BreakoutParticipant[][];
  updateBreakOutRoomStarted: (started: boolean) => void;
  updateBreakOutRoomEnded: (ended: boolean) => void;
  updateCurrentRoomIndex: (roomIndex: number) => void;
  updateCanStartBreakout: (canStart: boolean) => void;
  updateBreakoutRooms: (breakoutRooms: BreakoutParticipant[][]) => void;
  updateMeetingDisplayType: (displayType: string) => void;

  getUpdatedAllParams: () => BreakoutRoomsModalParameters;
  [key: string]: any;
}

export interface BreakoutRoomsModalOptions {
  isVisible: boolean;
  onBreakoutRoomsClose: () => void;
  parameters: BreakoutRoomsModalParameters;
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  backgroundColor?: string;
}

// Export the type definition for the function
export type BreakoutRoomsModalType = (
  options: BreakoutRoomsModalOptions
) => JSX.Element;

// EditRoomModal component with types
const EditRoomModal: React.FC<EditRoomModalOptions> = ({
  editRoomModalVisible,
  setEditRoomModalVisible,
  currentRoom,
  participantsRef,
  handleAddParticipant,
  handleRemoveParticipant,
  currentRoomIndex,
}) => {
  const renderAssignedParticipant = ({
    item,
    index,
  }: {
    item: BreakoutParticipant;
    index: number;
  }) => (
    <View style={styles.listItem} key={index}>
      <Text>{item.name}</Text>
      <Pressable
        onPress={() => handleRemoveParticipant(currentRoomIndex!, item)}
        style={styles.iconButton}
      >
        <FontAwesome5 name="times" size={20} color="#000" />
      </Pressable>
    </View>
  );

  const renderUnassignedParticipant = ({
    item,
    index,
  }: {
    item: Participant;
    index: number;
  }) => (
    <View style={styles.listItem} key={index}>
      <Text>{item.name}</Text>
      <Pressable
        onPress={() => handleAddParticipant(currentRoomIndex!, item)}
        style={styles.iconButton}
      >
        <FontAwesome5 name="plus" size={20} color="#000" />
      </Pressable>
    </View>
  );

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={editRoomModalVisible}
      onRequestClose={() => setEditRoomModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Edit Room {currentRoomIndex + 1} <FontAwesome5 name="pen" />
            </Text>
            <Pressable onPress={() => setEditRoomModalVisible(false)}>
              <FontAwesome5 name="times" size={20} color="#000" />
            </Pressable>
          </View>
          <FlatList
            data={currentRoom}
            renderItem={renderAssignedParticipant}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            ListHeaderComponent={
              <Text style={styles.listTitle}>
                Assigned Participants <FontAwesome5 name="users" />
              </Text>
            }
            ListEmptyComponent={
              <View style={styles.listItem}>
                <Text>None assigned</Text>
              </View>
            }
          />
          <FlatList
            data={participantsRef.current.filter(
              (participant) => participant.breakRoom == null,
            )}
            renderItem={renderUnassignedParticipant}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            ListHeaderComponent={
              <Text style={styles.listTitle}>
                Unassigned Participants <FontAwesome5 name="users" />
              </Text>
            }
            ListEmptyComponent={
              <View style={styles.listItem}>
                <Text>None pending</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

// BreakoutRoomsModal component with types
/**
 * BreakoutRoomsModal component is a React functional component that manages the breakout rooms modal.
 * It allows users to create, edit, and manage breakout rooms for participants in a meeting.
 *
 * @component
 * @param {BreakoutRoomsModalOptions} props - The properties for the BreakoutRoomsModal component.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {Function} props.onBreakoutRoomsClose - Callback function to close the modal.
 * @param {Object} props.parameters - Parameters for managing breakout rooms.
 * @param {string} [props.position='topRight'] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor='#83c0e9'] - Background color of the modal.
 *
 * @returns {JSX.Element} The rendered BreakoutRoomsModal component.
 *
 * @example
 * <BreakoutRoomsModal
 *   isVisible={true}
 *   onBreakoutRoomsClose={handleClose}
 *   parameters={parameters}
 *   position="topRight"
 *   backgroundColor="#83c0e9"
 * />
 */
const BreakoutRoomsModal: React.FC<BreakoutRoomsModalOptions> = ({
  isVisible,
  onBreakoutRoomsClose,
  parameters,
  position = 'topRight',
  backgroundColor = '#83c0e9',
}) => {
  const {
    participants,
    showAlert,
    socket,
    itemPageLimit,
    meetingDisplayType,
    prevMeetingDisplayType,
    roomName,
    shareScreenStarted,
    shared,
    breakOutRoomStarted,
    breakOutRoomEnded,
    currentRoomIndex,
    canStartBreakout,
    breakoutRooms,
    updateBreakOutRoomStarted,
    updateBreakOutRoomEnded,
    updateCurrentRoomIndex,
    updateCanStartBreakout,
    updateBreakoutRooms,
    updateMeetingDisplayType,
  } = parameters;

  const participantsRef = useRef<Participant[]>(participants);
  const breakoutRoomsRef = useRef<BreakoutParticipant[][]>(
    breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : [],
  );

  const [numRooms, setNumRooms] = useState<string>('');
  const [newParticipantAction, setNewParticipantAction] =
    useState<string>('autoAssignNewRoom');
  const [currentRoom, setCurrentRoom] = useState<BreakoutParticipant[]>([]);
  const [editRoomModalVisible, setEditRoomModalVisible] =
    useState<boolean>(false);

  const [startBreakoutButtonVisible, setStartBreakoutButtonVisible] =
    useState<boolean>(false);
  const [stopBreakoutButtonVisible, setStopBreakoutButtonVisible] =
    useState<boolean>(false);

  const screenWidth = Dimensions.get('window').width;
  let modalWidth = 0.9 * screenWidth;
  if (modalWidth > 600) {
    modalWidth = 600;
  }

  const checkCanStartBreakout = () => {
    if (canStartBreakout) {
      setStartBreakoutButtonVisible(true);
      setStopBreakoutButtonVisible(breakOutRoomStarted && !breakOutRoomEnded);
    } else {
      setStartBreakoutButtonVisible(false);
      setStopBreakoutButtonVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const filteredParticipants = participants.filter(
        (participant: Participant) => participant.islevel !== '2',
      );
      participantsRef.current = filteredParticipants;
      breakoutRoomsRef.current =
        breakoutRooms && breakoutRooms.length > 0 ? [...breakoutRooms] : [];
      checkCanStartBreakout();
    }
  }, [isVisible]);

  const handleRandomAssign = () => {
    const numRoomsInt = parseInt(numRooms, 10);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({
        message: 'Please enter a valid number of rooms',
        type: 'danger',
      });
      return;
    }

    const newBreakoutRooms: BreakoutParticipant[][] = Array.from(
      { length: numRoomsInt },
      (): BreakoutParticipant[] => [],
    );
    const shuffledParticipants = [...participantsRef.current].sort(
      () => 0.5 - Math.random(),
    );

    shuffledParticipants.forEach((participant, index) => {
      const roomIndex = index % numRoomsInt;
      if (newBreakoutRooms[roomIndex].length < itemPageLimit) {
        const participant_: BreakoutParticipant = {
          name: participant.name,
          breakRoom: roomIndex,
        };
        newBreakoutRooms[roomIndex].push(participant_);
        participant.breakRoom = roomIndex;
      } else {
        for (let i = 0; i < numRoomsInt; i++) {
          if (newBreakoutRooms[i].length < itemPageLimit) {
            newBreakoutRooms[i].push(participant);
            participant.breakRoom = i;
            break;
          }
        }
      }
    });
    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleManualAssign = () => {
    const numRoomsInt = parseInt(numRooms, 10);
    if (!numRoomsInt || numRoomsInt <= 0) {
      showAlert?.({
        message: 'Please enter a valid number of rooms',
        type: 'danger',
      });
      return;
    }

    breakoutRoomsRef.current = Array.from(
      { length: numRoomsInt },
      (): BreakoutParticipant[] => [],
    );
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleAddRoom = () => {
    breakoutRoomsRef.current = [...breakoutRoomsRef.current, []];
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleSaveRooms = () => {
    if (validateRooms()) {
      updateBreakoutRooms(breakoutRoomsRef.current);
      updateCanStartBreakout(true);
      checkCanStartBreakout();
      showAlert?.({ message: 'Rooms saved successfully', type: 'success' });
    } else {
      showAlert?.({ message: 'Rooms validation failed', type: 'danger' });
    }
  };

  const validateRooms = (): boolean => {
    if (breakoutRoomsRef.current.length === 0) {
      showAlert?.({
        message: 'There must be at least one room',
        type: 'danger',
      });
      return false;
    }

    for (let room of breakoutRoomsRef.current) {
      if (room.length === 0) {
        showAlert?.({ message: 'Rooms must not be empty', type: 'danger' });
        return false;
      }

      const participantNames = room.map((p) => p.name);
      const uniqueNames = new Set(participantNames);
      if (participantNames.length !== uniqueNames.size) {
        showAlert?.({
          message: 'Duplicate participant names in a room',
          type: 'danger',
        });
        return false;
      }

      if (room.length > itemPageLimit) {
        showAlert?.({
          message: 'A room exceeds the participant limit',
          type: 'danger',
        });
        return false;
      }
    }

    return true;
  };

  const handleStartBreakout = () => {
    if (shareScreenStarted || shared) {
      showAlert?.({
        message:
          'You cannot start breakout rooms while screen sharing is active',
        type: 'danger',
      });
      return;
    }

    if (canStartBreakout) {
      const emitName =
        breakOutRoomStarted && !breakOutRoomEnded
          ? 'updateBreakout'
          : 'startBreakout';
      const filteredBreakoutRooms = breakoutRoomsRef.current.map((room) =>
        room.map(({ name, breakRoom }) => ({ name, breakRoom })),
      );
      socket.emit(
        emitName,
        {
          breakoutRooms: filteredBreakoutRooms,
          newParticipantAction,
          roomName,
        },
        (response: { success: boolean; reason: string }) => {
          if (response.success) {
            showAlert?.({ message: 'Breakout rooms active', type: 'success' });
            updateBreakOutRoomStarted(true);
            updateBreakOutRoomEnded(false);
            onBreakoutRoomsClose();
            if (meetingDisplayType !== 'all') {
              updateMeetingDisplayType('all');
            }
          } else {
            showAlert?.({ message: response.reason, type: 'danger' });
          }
        },
      );
    }
  };

  const handleStopBreakout = () => {
    socket.emit(
      'stopBreakout',
      { roomName },
      (response: { success: boolean; reason: string }) => {
        if (response.success) {
          showAlert?.({ message: 'Breakout rooms stopped', type: 'success' });
          updateBreakOutRoomStarted(false);
          updateBreakOutRoomEnded(true);
          onBreakoutRoomsClose();
          if (meetingDisplayType !== prevMeetingDisplayType) {
            updateMeetingDisplayType(prevMeetingDisplayType);
          }
        } else {
          showAlert?.({ message: response.reason, type: 'danger' });
        }
      },
    );
  };

  const handleEditRoom = (roomIndex: number) => {
    updateCurrentRoomIndex(roomIndex);
    setCurrentRoom(breakoutRoomsRef.current[roomIndex]);
    setEditRoomModalVisible(true);
    updateCanStartBreakout(false);
    checkCanStartBreakout();
  };

  const handleDeleteRoom = (roomIndex: number) => {
    const room = breakoutRoomsRef.current[roomIndex];
    room.forEach((participant) => (participant.breakRoom = null));
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms.splice(roomIndex, 1);

    newBreakoutRooms.forEach((room, index) => {
      room.forEach((participant) => (participant.breakRoom = index));
    });

    breakoutRoomsRef.current = newBreakoutRooms;
    checkCanStartBreakout();
  };

  const handleAddParticipant = (
    roomIndex: number,
    participant: Participant | BreakoutParticipant,
  ) => {
    if (breakoutRoomsRef.current[roomIndex].length < itemPageLimit) {
      const newBreakoutRooms = [...breakoutRoomsRef.current];
      const participant_: BreakoutParticipant = {
        name: participant.name,
        breakRoom: roomIndex,
      };
      newBreakoutRooms[roomIndex].push(participant_);
      breakoutRoomsRef.current = newBreakoutRooms;
      participant.breakRoom = roomIndex;
      if (currentRoomIndex != null) {
        handleEditRoom(currentRoomIndex);
      }
    } else {
      showAlert?.({ message: 'Room is full', type: 'danger' });
    }
  };

  const handleRemoveParticipant = (
    roomIndex: number,
    participant: Participant | BreakoutParticipant,
  ) => {
    const newBreakoutRooms = [...breakoutRoomsRef.current];
    newBreakoutRooms[roomIndex] = newBreakoutRooms[roomIndex].filter(
      (p) => p !== participant,
    );
    breakoutRoomsRef.current = newBreakoutRooms;
    participant.breakRoom = null;
    if (currentRoomIndex != null) {
      handleEditRoom(currentRoomIndex);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onBreakoutRoomsClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: backgroundColor, width: modalWidth },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Breakout Rooms <FontAwesome5 name="door-open" />
            </Text>
            <Pressable onPress={onBreakoutRoomsClose}>
              <FontAwesome5 name="times" size={20} color="#000" />
            </Pressable>
          </View>
          <FlatList
            ListHeaderComponent={
              <View>
                <View style={styles.formGroup}>
                  <Text>
                    Number of Rooms <FontAwesome5 name="users" />
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={numRooms}
                    onChangeText={setNumRooms}
                    inputMode="numeric"
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.buttonGroup}>
                    <Pressable
                      style={styles.button}
                      onPress={handleRandomAssign}
                    >
                      <FontAwesome5 name="random" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Random</Text>
                    </Pressable>
                    <Pressable
                      style={styles.button}
                      onPress={handleManualAssign}
                    >
                      <FontAwesome5
                        name="hand-pointer"
                        size={20}
                        color="#fff"
                      />
                      <Text style={styles.buttonText}>Manual</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleAddRoom}>
                      <FontAwesome5 name="plus" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Add Room</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleSaveRooms}>
                      <FontAwesome5 name="save" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Save Rooms</Text>
                    </Pressable>
                  </View>
                </ScrollView>
                <View style={styles.formGroup}>
                  <Text>
                    New Participant Action <FontAwesome5 name="users" />
                  </Text>
                  <RNPickerSelect
                    style={pickerSelectStyles}
                    value={newParticipantAction}
                    onValueChange={(value) => setNewParticipantAction(value)}
                    items={[
                      { label: 'Add to new room', value: 'autoAssignNewRoom' },
                      {
                        label: 'Add to open room',
                        value: 'autoAssignAvailableRoom',
                      },
                      { label: 'No action', value: 'manualAssign' },
                    ]}
                    placeholder={{}}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>
            }
            data={breakoutRoomsRef.current}
            keyExtractor={(item, index) => `room-${index}`}
            renderItem={({ item, index: roomIndex }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text>
                    Room {roomIndex + 1} <FontAwesome5 name="users" />
                  </Text>
                  <View style={styles.cardHeaderButtons}>
                    <Pressable
                      onPress={() => handleEditRoom(roomIndex)}
                      style={styles.iconButton}
                    >
                      <FontAwesome5 name="pen" size={20} color="#000" />
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteRoom(roomIndex)}
                      style={styles.iconButton}
                    >
                      <FontAwesome5 name="times" size={20} color="#000" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  {item.map((participant, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text>{participant.name}</Text>
                      <Pressable
                        onPress={() =>
                          handleRemoveParticipant(roomIndex, participant)
                        }
                        style={styles.iconButton}
                      >
                        <FontAwesome5 name="times" size={20} color="#000" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}
            ListFooterComponent={
              <View style={styles.buttonGroup}>
                {startBreakoutButtonVisible && (
                  <Pressable
                    style={styles.button}
                    onPress={handleStartBreakout}
                  >
                    <Text style={styles.buttonText}>
                      {breakOutRoomStarted && !breakOutRoomEnded
                        ? 'Update Breakout'
                        : 'Start Breakout'}
                    </Text>
                    <FontAwesome5
                      name={
                        breakOutRoomStarted && !breakOutRoomEnded
                          ? 'sync'
                          : 'play'
                      }
                      size={16}
                      color={
                        breakOutRoomStarted && !breakOutRoomEnded
                          ? 'yellow'
                          : 'green'
                      }
                    />
                  </Pressable>
                )}
                {stopBreakoutButtonVisible && (
                  <Pressable style={styles.button} onPress={handleStopBreakout}>
                    <Text style={styles.buttonText}>Stop Breakout</Text>
                    <FontAwesome5 name="stop" size={16} color="red" />
                  </Pressable>
                )}
              </View>
            }
          />
        </View>
      </View>
      <EditRoomModal
        editRoomModalVisible={editRoomModalVisible}
        setEditRoomModalVisible={setEditRoomModalVisible}
        currentRoom={currentRoom}
        participantsRef={participantsRef}
        handleAddParticipant={handleAddParticipant}
        handleRemoveParticipant={handleRemoveParticipant}
        currentRoomIndex={currentRoomIndex}
      />
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  inputWeb: {
    fontSize: 14,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is never behind the icon
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9,
    elevation: 9,
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#83c0e9',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#00000',
    padding: 20,
    maxHeight: '75%',
    maxWidth: '90%',
    zIndex: 9,
    elevation: 9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8D9BAB',
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    marginRight: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderButtons: {
    flexDirection: 'row',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  iconButton: {
    padding: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default BreakoutRoomsModal;
