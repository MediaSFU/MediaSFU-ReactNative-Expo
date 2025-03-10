// LoadingModal.tsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

/**
 * Interface defining the props for the LoadingModal component.
 */
export interface LoadingModalOptions {
  /**
   * Determines if the modal is visible.
   */
  isVisible: boolean;

  /**
   * The background color of the modal overlay.
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  backgroundColor?: string;

  /**
   * The color of the loading spinner and text.
   * @default 'black'
   */
  displayColor?: string;
}

export type LoadingModalType = (options: LoadingModalOptions) => JSX.Element;

/**
 * LoadingModal component displays a centered loading spinner with text in a modal overlay.
 *
 * This component is useful for indicating loading states with a customizable background and display color.
 *
 * @component
 * @param {LoadingModalOptions} props - Configuration options for the LoadingModal component.
 * @param {boolean} props.isVisible - Controls the visibility of the modal.
 * @param {string} [props.backgroundColor='rgba(0, 0, 0, 0.5)'] - Background color of the modal overlay.
 * @param {string} [props.displayColor='black'] - Color for the loading spinner and text.
 *
 * @returns {JSX.Element} The rendered LoadingModal component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { LoadingModal } from 'mediasfu-reactnative-expo';
 *
 * function App() {
 *   return (
 *     <LoadingModal
 *       isVisible={true}
 *       backgroundColor="rgba(0, 0, 0, 0.7)"
 *       displayColor="white"
 *     />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const LoadingModal: React.FC<LoadingModalOptions> = ({
  isVisible,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  displayColor = 'black',
}) => {
  /**
   * Styles for the modal overlay container.
   */
  const modalContainerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'center', // Vertically center content
    alignItems: 'center', // Horizontally center content
    backgroundColor,
  };

  /**
   * Styles for the modal content box.
   */
  const modalContentStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 200,
  };

  /**
   * Styles for the loading text.
   */
  const loadingTextStyle: StyleProp<TextStyle> = {
    color: displayColor,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => { /* Optionally handle modal close */ }}
    >
      <View style={modalContainerStyle}>
        <View style={modalContentStyle}>
          <ActivityIndicator size="large" color={displayColor} />
          <Text style={loadingTextStyle}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
