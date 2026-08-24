import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Socket } from 'socket.io-client';
import { confirmExit, ConfirmExitOptions } from '../../methods/exitMethods/confirmExit';
import { getModalPosition } from '../../methods/utils/getModalPosition';

/**
 * Configuration options for the ConfirmExitModal component.
 * 
 * @interface ConfirmExitModalOptions
 * 
 * **Modal Control:**
 * @property {boolean} isConfirmExitModalVisible - Controls modal visibility
 * @property {() => void} onConfirmExitClose - Callback when modal is closed
 * 
 * **Exit Action:**
 * @property {(options: ConfirmExitOptions) => void} [exitEventOnConfirm] - Custom handler for confirming exit (defaults to confirmExit)
 * 
 * **User Context:**
 * @property {string} member - Name of member exiting or being removed
 * @property {boolean} [ban] - Whether this is a ban action (removes from room permanently)
 * @property {string} islevel - User level ('0'=participant, '1'=co-host, '2'=host) - determines if "End Event for All" option is shown
 * 
 * **Session Context:**
 * @property {string} roomName - Room identifier for exit event
 * @property {Socket} socket - Socket.io instance for exit notification
 * 
 * **Customization:**
 * @property {'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'} [position='topRight'] - Modal position on screen
 * @property {string} [backgroundColor='#83c0e9'] - Modal background color
 * @property {object} [style] - Additional custom styles for modal container
 * 
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: JSX.Element; dimensions: { width: number; height: number } }) => JSX.Element} [renderContent] - Custom render function for modal content
 * @property {(options: { defaultContainer: JSX.Element; dimensions: { width: number; height: number } }) => React.ReactNode} [renderContainer] - Custom render function for modal container
 */
export interface ConfirmExitModalOptions {
  /**
   * Determines if the modal is visible.
   */
  isConfirmExitModalVisible: boolean;

  /**
   * Callback function to close the modal.
   */
  onConfirmExitClose: () => void;

  /**
   * Position of the modal on the screen.
   * @default "topRight"
   */
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

  /**
   * Background color of the modal.
   * @default "#83c0e9"
   */
  backgroundColor?: string;
  isDarkMode?: boolean;

  /**
   * Event handler function to be called on confirming exit.
   * @default confirmExit
   */
  exitEventOnConfirm?: (options: ConfirmExitOptions) => void;

  /**
   * Name of the member exiting.
   */
  member: string;

  /**
   * Flag indicating if the member is banned.
   */
  ban?: boolean;

  /**
   * Name of the room.
   */
  roomName: string;

  /**
   * Socket object for communication.
   */
  socket: Socket;

  /**
   * Level of the user (e.g., "1", "2").
   */
  islevel: string;

  /**
   * Optional custom style for the modal container.
   */
  style?: object;

  /**
   * Custom render function for modal content.
   */
  renderContent?: (options: {
    defaultContent: JSX.Element;
    dimensions: { width: number; height: number };
  }) => JSX.Element;

  /**
   * Custom render function for the modal container.
   */
  renderContainer?: (options: {
    defaultContainer: JSX.Element;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;
}

export type ConfirmExitModalType = (options: ConfirmExitModalOptions) => JSX.Element;

/**
 * ConfirmExitModal - Exit confirmation dialog with "End Event for All" option
 * 
 * ConfirmExitModal is a React Native component that provides a confirmation interface
 * when users want to leave a meeting. For host-level users (islevel='2'), it offers
 * an additional option to end the event for all participants. Supports ban/kick actions.
 * 
 * **Key Features:**
 * - Personal exit confirmation ("Leave Room")
 * - "End Event for All" option for hosts (islevel='2')
 * - Ban/kick action support
 * - Socket.io notification on exit
 * - Position-configurable modal (4 corners)
 * - Customizable exit confirmation handler
 * - Cancel option to close modal
 * 
 * **UI Customization:**
 * This component can be replaced via `uiOverrides.confirmExitModal` to
 * provide a completely custom exit confirmation interface.
 * 
 * @component
 * @param {ConfirmExitModalOptions} props - Configuration options
 * 
 * @returns {JSX.Element} Rendered exit confirmation modal
 * 
 * @example
 * ```tsx
 * // Basic usage for participant exit
 * import React, { useState } from 'react';
 * import { ConfirmExitModal } from 'mediasfu-reactnative-expo';
 * import { io } from 'socket.io-client';
 * 
 * const socket = io('https://your-server.com');
 * const [showExitModal, setShowExitModal] = useState(false);
 * 
 * return (
 *   <ConfirmExitModal
 *     isConfirmExitModalVisible={showExitModal}
 *     onConfirmExitClose={() => setShowExitModal(false)}
 *     member="John Doe"
 *     roomName="meeting-room-123"
 *     socket={socket}
 *     islevel="0" // Regular participant - only "Leave Room" option
 *   />
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Host usage with "End Event for All" option
 * const handleExitConfirm = (options: ConfirmExitOptions) => {
 *   confirmExit(options);
 *   console.log('Exit action completed');
 * };
 * 
 * return (
 *   <ConfirmExitModal
 *     isConfirmExitModalVisible={showModal}
 *     onConfirmExitClose={handleClose}
 *     exitEventOnConfirm={handleExitConfirm}
 *     member="Host Name"
 *     roomName={roomId}
 *     socket={socketConnection}
 *     islevel="2" // Host - shows "End Event for All" option
 *     position="bottomRight"
 *     backgroundColor="#e74c3c"
 *   />
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Using custom UI via uiOverrides
 * const config = {
 *   uiOverrides: {
 *     confirmExitModal: {
 *       component: MyCustomExitConfirmation,
 *       injectedProps: {
 *         theme: 'dark',
 *         confirmationText: 'Are you sure you want to leave?',
 *       },
 *     },
 *   },
 * };
 * 
 * return <MyMeetingComponent config={config} />;
 * ```
 */

const ConfirmExitModal: React.FC<ConfirmExitModalOptions> = ({
  isConfirmExitModalVisible,
  onConfirmExitClose,
  position = 'topRight',
  backgroundColor = '#83c0e9',
  isDarkMode,
  exitEventOnConfirm = confirmExit,
  member,
  ban = false,
  roomName,
  socket,
  islevel,
  style,
  renderContent,
  renderContainer,
}) => {
  const [modalWidth, setModalWidth] = useState<number>(0.7 * Dimensions.get('window').width);
  const isHostExit = islevel === '2' && !ban;

  useEffect(() => {
    const updateDimensions = () => {
      let width = 0.7 * Dimensions.get('window').width;
      if (width > 400) {
        width = 400;
      }
      setModalWidth(width);
    };

    const subscribe = Dimensions.addEventListener('change', updateDimensions);
    // Initial call
    updateDimensions();

    return () => {
      subscribe.remove();
    };
  }, []);

  /**
   * Handles the logic when the user confirms exit.
   */
  const handleConfirmExit = (endRoomOnHostExit = true) => {
    exitEventOnConfirm({
      socket,
      member,
      roomName,
      ban,
      endRoomOnHostExit,
    });
    onConfirmExitClose();
  };

  const dimensions = { width: modalWidth, height: 0 };
  const themed = typeof isDarkMode === 'boolean';
  const textColor = themed ? (isDarkMode ? '#f8fafc' : '#0f172a') : 'black';
  const borderColor = themed ? (isDarkMode ? 'rgba(226, 232, 240, 0.18)' : 'rgba(71, 85, 105, 0.22)') : 'black';

  const defaultContent = (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={[styles.modalTitle, { color: textColor }] as any}>Confirm Exit</Text>
        <Pressable
          onPress={onConfirmExitClose}
          style={styles.btnCloseConfirmExit}
          accessibilityRole="button"
          accessibilityLabel="Close Confirm Exit Modal"
        >
          <FontAwesome5 name="times" style={[styles.icon, { color: textColor }] as any} />
        </Pressable>
      </View>

      {/* Divider */}
      <View style={[styles.hr, { borderBottomColor: borderColor }] as any} />

      {/* Body */}
      <View style={styles.modalBody}>
        <Text style={[styles.confirmExitText, { color: textColor }] as any}>
          {isHostExit
            ? 'Leave room keeps the event active for everyone else and lets you rejoin. End for everyone closes it for all participants.'
            : 'Are you sure you want to exit?'}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.hr, { borderBottomColor: borderColor }] as any} />

      {/* Footer */}
      <View style={styles.modalFooter}>
        {/* Cancel Button */}
        <Pressable
          onPress={onConfirmExitClose}
          style={[styles.confirmButton, styles.btnCancel]}
          accessibilityRole="button"
          accessibilityLabel="Cancel Exit"
        >
          <Text style={[styles.confirmButtonText, styles.btnCancelText]}>Cancel</Text>
        </Pressable>

        {/* Separator */}
        <View style={[styles.doubleBorder, { backgroundColor: borderColor }] as any} />

        {isHostExit && (
          <>
            <Pressable
              onPress={() => handleConfirmExit(false)}
              style={[styles.confirmButton, styles.btnLeave]}
              accessibilityRole="button"
              accessibilityLabel="Leave room without ending it"
            >
              <Text style={[styles.confirmButtonText, styles.btnCancelText]}>Leave room</Text>
            </Pressable>
            <View style={[styles.doubleBorder, { backgroundColor: borderColor }] as any} />
          </>
        )}

        {/* Exit/End Event Button */}
        <Pressable
          onPress={() => handleConfirmExit(true)}
          style={[styles.confirmButton, styles.btnExit]}
          accessibilityRole="button"
          accessibilityLabel={isHostExit ? 'End for everyone' : 'Exit'}
        >
          <Text style={[styles.confirmButtonText, styles.btnExitText]}>
            {isHostExit ? 'End for everyone' : 'Exit'}
          </Text>
        </Pressable>
      </View>
    </>
  );

  const content = renderContent
    ? renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={isConfirmExitModalVisible}
      onRequestClose={onConfirmExitClose}
    >
      <View style={[styles.modalContainer, getModalPosition({ position })]}>
        {/* Modal Content */}
        <View style={[styles.modalContent, { backgroundColor, width: modalWidth }, style]}>
          {content}
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

export default ConfirmExitModal;

/**
 * Stylesheet for the ConfirmExitModal component.
 */
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    minHeight: '35%',
    backgroundColor: '#83c0e9',
    borderRadius: 10,
    padding: 20,
    maxHeight: '65%',
    maxWidth: '70%',
    zIndex: 9,
    elevation: 9,
    borderWidth: 2,
    borderColor: 'black',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  btnCloseConfirmExit: {
    padding: 5,
  },

  icon: {
    fontSize: 20,
    color: 'black',
    marginRight: 15,
  },

  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 15,
  },

  modalBody: {
    padding: 4,
  },

  confirmExitText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },

  modalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  confirmButton: {
    minWidth: 96,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCancel: {
    backgroundColor: '#6c757d',
  },

  btnExit: {
    backgroundColor: '#dc3545',
  },

  btnLeave: {
    backgroundColor: '#475569',
  },

  doubleBorder: {
    height: 25,
    width: 1,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },

  confirmButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },

  btnCancelText: {
    fontSize: 14,
    color: 'white',
  },

  btnExitText: {
    fontSize: 14,
  },
});
