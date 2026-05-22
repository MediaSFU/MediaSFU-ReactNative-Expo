// MiniCard.tsx

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  LayoutChangeEvent,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { CustomMiniCardType } from '../../@types/types';

/**
 * Interface defining the props for the MiniCard component.
 * 
 * MiniCard is a compact display component for showing participant avatars/initials
 * with optional media status icons in grid layouts or sidebar views.
 * 
 * @interface MiniCardOptions
 * 
 * **Display Properties:**
 * @property {string} [initials] - Participant initials to display when no image is available
 *   (e.g., "AB" for "Alice Brown"). Used as fallback when imageSource is not provided.
 * @property {number} [fontSize=14] - Font size for the initials text
 * @property {string} [name] - Full name of the participant (may be used for accessibility or tooltips)
 * 
 * **Image Properties:**
 * @property {string} [imageSource] - URI or URL of the participant's avatar image
 * @property {boolean} [roundedImage=true] - Whether to display image with rounded corners
 * @property {StyleProp<ImageStyle>} [imageStyle] - Custom React Native styles for the image element
 * 
 * **Status Icons:**
 * @property {boolean} [showVideoIcon] - Whether to display video status icon overlay
 * @property {boolean} [showAudioIcon] - Whether to display audio status icon overlay
 * 
 * **Styling Properties:**
 * @property {StyleProp<ViewStyle>} [customStyle] - Custom React Native styles for the card container
 * @property {object} [style] - Additional style object for the container
 * 
 * **Custom UI Override:**
 * @property {CustomMiniCardType} [customMiniCard] - Custom render function for complete card replacement.
 *   When provided, this function receives all MiniCardOptions and returns custom JSX.Element.
 *   This allows full control over the mini card's appearance and behavior.
 * 
 * **Advanced Render Overrides:**
 * @property {(options: { defaultContent: React.ReactNode; dimensions: { width: number; height: number }}) => React.ReactNode} [renderContent]
 *   Function to wrap or replace the default card content while preserving container
 * @property {(options: { defaultContainer: React.ReactNode; dimensions: { width: number; height: number }}) => React.ReactNode} [renderContainer]
 *   Function to wrap or replace the entire card container
 * 
 * **Additional Parameters:**
 * @property {any} [parameters] - Additional parameters that can be passed to custom components
 */
export interface MiniCardOptions {
  /**
   * The initials to display if no image is provided.
   */
  initials?: string;

  /**
   * The font size for the initials.
   * @default 14
   */
  fontSize?: number;
  textColor?: string;

  /**
   * Custom styles to apply to the card.
   */
  customStyle?: StyleProp<ViewStyle>;

  /**
   * The source URI of the image to display.
   */
  imageSource?: string;

  /**
   * Whether the image should have rounded corners.
   * @default true
   */
  roundedImage?: boolean;

  /**
   * Custom styles to apply to the image.
   */
  imageStyle?: StyleProp<ImageStyle>;

  /**
   * Whether to show the video icon.
   */
  showVideoIcon?: boolean;

  /**
   * Whether to show the audio icon.
   */
  showAudioIcon?: boolean;

  /**
   * The name of the participant.
   */
  name?: string;

  /**
   * Custom MiniCard component to replace default rendering.
   */
  customMiniCard?: CustomMiniCardType;

  /**
   * Additional parameters that can be passed to custom components.
   */
  parameters?: any;

  /**
   * Optional custom style to apply to the container.
   */
  style?: object;

  /**
   * Optional function to render custom content, receiving the default content and dimensions.
   */
  renderContent?: (options: {
    defaultContent: React.ReactNode;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;

  /**
   * Optional function to render a custom container, receiving the default container and dimensions.
   */
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;
}

export type MiniCardType = (options: MiniCardOptions) => JSX.Element;

/**
 * MiniCard - Compact participant card displaying avatar or initials with status icons
 * 
 * MiniCard is a lightweight React Native component designed for displaying participants
 * in compact grid layouts, sidebars, or minimized views. It intelligently renders either
 * a participant's avatar image or their initials, with optional status icons for audio/video.
 * 
 * **Key Features:**
 * - Avatar image display with automatic fallback to initials
 * - Optional audio/video status icon overlays
 * - Rounded or square image corners
 * - Compact design optimized for grid layouts
 * - Fully customizable styling
 * - Lightweight performance footprint
 * 
 * **UI Customization - Two-Tier Override System:**
 * 
 * 1. **Custom Render Function** (via `customMiniCard` prop):
 *    Pass a function that receives all MiniCardOptions and returns custom JSX.
 *    Provides complete control over rendering logic and appearance.
 * 
 * 2. **Component Override** (via `uiOverrides.miniCardComponent`):
 *    Replace the entire MiniCard component while preserving MediaSFU's orchestration.
 *    Useful when you want a different component implementation.
 * 
 * **Advanced Render Overrides:**
 * - `renderContent`: Wrap/modify the card's inner content while keeping container
 * - `renderContainer`: Wrap/modify the entire card container
 * 
 * @component
 * @param {MiniCardOptions} props - Configuration options for the MiniCard component
 * 
 * @returns {JSX.Element} Rendered mini card with avatar/initials and optional status icons
 * 
 * @example
 * // Basic usage - Display with initials
 * import React from 'react';
 * import { MiniCard } from 'mediasfu-reactnative-expo';
 *
 * function ParticipantGrid() {
 *   return (
 *     <MiniCard
 *       initials="AB"
 *       name="Alice Brown"
 *       fontSize={14}
 *       roundedImage={true}
 *       showVideoIcon={false}
 *       showAudioIcon={true}
 *     />
 *   );
 * }
 * 
 * @example
 * // With avatar image and custom styling
 * <MiniCard
 *   name="Charlie Davis"
 *   imageSource="https://example.com/avatars/charlie.jpg"
 *   roundedImage={true}
 *   showVideoIcon={true}
 *   showAudioIcon={false}
 *   customStyle={{
 *     backgroundColor: '#1a1a2e',
 *     borderRadius: 10,
 *     borderWidth: 2,
 *     borderColor: '#16213e',
 *     padding: 5,
 *   }}
 *   imageStyle={{ width: 50, height: 50 }}
 *   fontSize={16}
 * />
 * 
 * @example
 * // Custom mini card with custom render function
 * import { View, Text } from 'react-native';
 * 
 * const customMiniCard = (options: MiniCardOptions) => {
 *   const { name, initials, showVideoIcon, showAudioIcon } = options;
 *   
 *   return (
 *     <View style={{ backgroundColor: '#000', padding: 8, borderRadius: 8 }}>
 *       <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
 *         {initials || name?.substring(0, 2).toUpperCase()}
 *       </Text>
 *       <View style={{ flexDirection: 'row', marginTop: 4 }}>
 *         {showVideoIcon && <Text style={{ marginRight: 4 }}>📹</Text>}
 *         {showAudioIcon && <Text>🔊</Text>}
 *       </View>
 *     </View>
 *   );
 * };
 * 
 * <MiniCard
 *   name="Eve Foster"
 *   initials="EF"
 *   showVideoIcon={true}
 *   showAudioIcon={false}
 *   customMiniCard={customMiniCard}
 * />
 * 
 * @example
 * // Using uiOverrides for component-level customization
 * import { MyCustomMiniCard } from './MyCustomMiniCard';
 * 
 * const sessionConfig = {
 *   credentials: { apiKey: 'your-api-key' },
 *   uiOverrides: {
 *     miniCardComponent: {
 *       component: MyCustomMiniCard,
 *       injectedProps: {
 *         theme: 'minimal',
 *         size: 'small',
 *       },
 *     },
 *   },
 * };
 * 
 * // MyCustomMiniCard.tsx
 * export const MyCustomMiniCard = (props: MiniCardOptions & { theme: string; size: string }) => {
 *   const cardSize = props.size === 'small' ? 40 : 60;
 *   
 *   return (
 *     <View style={{ width: cardSize, height: cardSize, borderRadius: cardSize / 2 }}>
 *       {props.imageSource ? (
 *         <Image source={{ uri: props.imageSource }} style={{ width: cardSize, height: cardSize }} />
 *       ) : (
 *         <Text style={{ fontSize: props.fontSize }}>{props.initials}</Text>
 *       )}
 *     </View>
 *   );
 * };
 */

const MiniCard: React.FC<MiniCardOptions> = ({
  initials,
  fontSize = 14,
  textColor,
  customStyle,
  imageSource,
  roundedImage = true,
  imageStyle,
  showVideoIcon = false,
  showAudioIcon = false,
  name,
  customMiniCard,
  parameters,
  style,
  renderContent,
  renderContainer,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isDarkMode = typeof parameters?.isDarkModeValue === 'boolean'
    ? parameters.isDarkModeValue
    : true;

  // Define the style for the MiniCard
  const cardStyle: StyleProp<ViewStyle> = useMemo(
    () => [styles.miniCard, customStyle, style],
    [customStyle, style],
  );

  const resolvedInitials = useMemo(() => {
    const rawAvatarLabel = initials?.trim() || name?.trim() || '';
    return rawAvatarLabel ? rawAvatarLabel.slice(0, 10) : '?';
  }, [initials, name]);

  const resolvedFontSize = useMemo(() => {
    if (!dimensions.width || !dimensions.height) {
      return fontSize;
    }

    const labelLength = Math.max(resolvedInitials.length, 1);
    const availableWidth = Math.max(dimensions.width - 12, 1);
    const availableHeight = Math.max(dimensions.height - 12, 1);
    const widthFit = availableWidth / Math.max(labelLength * 0.58, 1);
    const heightFit = availableHeight * 0.55;

    return Math.max(8, Math.min(fontSize, Math.floor(widthFit), Math.floor(heightFit)));
  }, [dimensions.height, dimensions.width, fontSize, resolvedInitials]);

  const resolvedTextColor = useMemo(
    () => textColor ?? (isDarkMode ? '#f8fafc' : '#0f172a'),
    [isDarkMode, textColor],
  );

  const resolvedBadgeBackgroundColor = useMemo(
    () => (isDarkMode ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.8)'),
    [isDarkMode],
  );

  const resolvedBadgeIconColor = useMemo(
    () => (isDarkMode ? '#ffffff' : '#0f172a'),
    [isDarkMode],
  );

  const badgeIconSize = useMemo(() => {
    if (!dimensions.width || !dimensions.height) {
      return 14;
    }

    return Math.max(10, Math.min(14, Math.floor(Math.min(dimensions.width, dimensions.height) * 0.16)));
  }, [dimensions.height, dimensions.width]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions((current) => {
      if (current.width === width && current.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const renderDimensions = { width: dimensions.width, height: dimensions.height };

  const defaultContent = (
    <>
      {customMiniCard ? (
        customMiniCard({
          initials: resolvedInitials,
          fontSize: resolvedFontSize,
          textColor: resolvedTextColor,
          customStyle,
          name: name || resolvedInitials,
          showVideoIcon,
          showAudioIcon,
          imageSource,
          roundedImage,
          imageStyle,
          parameters,
        })
      ) : (
        <View style={styles.defaultContent}>
          {imageSource ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageSource }}
                style={[
                  styles.backgroundImage,
                  roundedImage && styles.roundedImage,
                  imageStyle,
                ]}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Text
              style={[
                styles.initials,
                isDarkMode ? styles.initialsDarkMode : styles.initialsLightMode,
                { fontSize: resolvedFontSize, color: resolvedTextColor },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {resolvedInitials}
            </Text>
          )}

          {(showVideoIcon || showAudioIcon) && (
            <View style={[styles.badgeContainer, { backgroundColor: resolvedBadgeBackgroundColor }]}>
              {showVideoIcon && (
                <FontAwesome
                  name="video-camera"
                  size={badgeIconSize}
                  color={resolvedBadgeIconColor}
                  style={[styles.badgeIcon, styles.badgeIconFirst]}
                />
              )}
              {showAudioIcon && (
                <FontAwesome
                  name="microphone"
                  size={badgeIconSize}
                  color={resolvedBadgeIconColor}
                  style={[styles.badgeIcon, showVideoIcon ? null : styles.badgeIconFirst]}
                />
              )}
            </View>
          )}
        </View>
      )}
    </>
  );

  const content = renderContent 
    ? renderContent({ defaultContent, dimensions: renderDimensions }) 
    : defaultContent;

  const defaultContainer = (
    <View style={cardStyle} onLayout={handleLayout} accessibilityRole="image" accessibilityLabel={name || resolvedInitials}>
      {content}
    </View>
  );

  return renderContainer 
    ? (renderContainer({ defaultContainer, dimensions: renderDimensions }) as JSX.Element)
    : defaultContainer;
};

export default MiniCard;

/**
 * Stylesheet for the MiniCard component.
 */
const styles = StyleSheet.create({
  miniCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0, // Default border radius; can be overridden via customStyle
    width: '100%',
    height: '100%',
    color: 'white',
    fontFamily: 'Nunito',
    overflow: 'hidden',
    position: 'relative',

  },
  defaultContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '60%',
    height: '60%',
  },
  roundedImage: {
    borderRadius: 50, // Fully rounded; adjust as needed
  },
  initials: {
    textAlign: 'center',
    fontWeight: '800',
    maxWidth: '92%',
  },
  initialsDarkMode: {
    textShadowColor: 'rgba(15, 23, 42, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  initialsLightMode: {
    textShadowColor: 'rgba(248, 250, 252, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    marginLeft: 6,
  },
  badgeIconFirst: {
    marginLeft: 0,
  },
});
