import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

export interface AlertComponentOptions {
  visible: boolean;
  message: string;
  type?: 'success' | 'danger'; // Optional prop with 'success' or 'danger' as default values
  duration?: number; // Optional with default value
  onHide?: () => void; // Optional callback function
  textColor?: string; // Optional text color
}

export type AlertComponentType = (options: AlertComponentOptions) => JSX.Element;

/**
 * AlertComponent displays a modal alert message with customizable type, duration, and style options.
 *
 * This component shows a message overlay with optional styling for different alert types, duration,
 * and an automatic hide function. The alert can be dismissed manually or after a set duration.
 *
 * @component
 * @param {boolean} visible - Controls the visibility of the alert modal.
 * @param {string} message - The message displayed in the alert.
 * @param {'success' | 'danger'} [type='success'] - Type of the alert, determining its background color.
 * @param {number} [duration=4000] - Duration (in milliseconds) for which the alert is visible.
 * @param {() => void} [onHide] - Callback function executed when the alert hides.
 * @param {string} [textColor='black'] - Text color for the alert message.
 *
 * @returns {JSX.Element} The AlertComponent.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AlertComponent } from 'mediasfu-reactnative-expo';
 *
 * function App() {
 *   const [alertVisible, setAlertVisible] = React.useState(true);
 *
 *   return (
 *     <AlertComponent
 *       visible={alertVisible}
 *       message="Operation successful"
 *       type="success"
 *       duration={3000}
 *       onHide={() => setAlertVisible(false)}
 *       textColor="white"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const AlertComponent: React.FC<AlertComponentOptions> = ({
  visible,
  message,
  type = 'success',
  duration = 4000,
  onHide,
  textColor = 'black',
}) => {
  const [alertType, setAlertType] = useState<'success' | 'danger'>(type);

  useEffect(() => {
    if (type) {
      setAlertType(type);
    }
  }, [type]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        if (onHide) {onHide();}
      }, duration);
    }

    return () => {
      if (timer) {clearTimeout(timer);}
    };
  }, [visible, duration, onHide]);

  const handlePress = () => {
    if (onHide) {onHide();}
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handlePress}
    >
      <Pressable style={styles.centeredView} onPress={handlePress}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: alertType === 'success' ? 'green' : 'red' },
          ]}
        >
          <Text style={[styles.modalText, { color: textColor }]}>
            {message}
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 250,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertComponent;
