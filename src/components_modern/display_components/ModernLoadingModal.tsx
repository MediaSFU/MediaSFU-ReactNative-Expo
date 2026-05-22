import React from 'react';
import { ActivityIndicator, Modal, Text, View, StyleSheet } from 'react-native';
import type { LoadingModalOptions } from '../../components/displayComponents/LoadingModal';
import { getModernColors, getModernModalCardStyle, resolveIsDarkMode } from '../core/modernTheme';

export type ModernLoadingModalOptions = LoadingModalOptions & { isDarkMode?: boolean; parameters?: any };

export const ModernLoadingModal: React.FC<ModernLoadingModalOptions> = (props) => {
  const isDarkMode = resolveIsDarkMode(props);
  const colors = getModernColors(isDarkMode);
  const dimensions = { width: 280, height: 0 };

  if (!props.isVisible) {
    return null;
  }

  const defaultContent = (
    <View style={[styles.card, getModernModalCardStyle(isDarkMode)]}>
      <View style={[styles.spinnerShell, { backgroundColor: colors.accentSoft }]}> 
        <ActivityIndicator size="large" color={props.displayColor ?? colors.accent} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
      <Text style={[styles.caption, { color: colors.textMuted }]}>Please wait while we prepare your session.</Text>
    </View>
  );

  const content = props.renderContent
    ? props.renderContent({ defaultContent, dimensions })
    : defaultContent;

  const defaultContainer = (
    <Modal
      transparent
      animationType="fade"
      visible={props.isVisible}
      onRequestClose={() => {}}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor:
              props.backgroundColor ??
              (isDarkMode ? 'rgba(2, 6, 23, 0.56)' : 'rgba(15, 23, 42, 0.18)'),
          },
          props.style as any,
        ]}
      >
        {content}
      </View>
    </Modal>
  );

  return props.renderContainer
    ? (props.renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 26,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerShell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  caption: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ModernLoadingModal;