// MainGridComponent.tsx

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MeetingProgressTimer from './MeetingProgressTimer';

/**
 * Interface defining the props for the MainGridComponent.
 */
export interface MainGridComponentOptions {
  /**
   * The child components to be rendered inside the main grid.
   */
  children: React.ReactNode;

  /**
   * The background color of the main grid container.
   */
  backgroundColor: string;

  /**
   * The height of the main grid container.
   */
  height: number;

  /**
   * The width of the main grid container.
   */
  width: number;

  /**
   * Flag to determine if the aspect ratio should be shown.
   * @default true
   */
  showAspect?: boolean;

  /**
   * The background color of the meeting progress timer.
   */
  timeBackgroundColor?: string;

  /**
   * Flag to determine if the meeting progress timer should be shown.
   * @default true
   */
  showTimer?: boolean;

  /**
   * The time to display on the meeting progress timer.
   */
  meetingProgressTime: string;

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

export type MainGridComponentType = (options: MainGridComponentOptions) => JSX.Element;

/**
 * MainGridComponent renders a main grid container with customizable dimensions, background color, and optional components.
 * This component includes an optional meeting progress timer and allows the display of child components in a centered layout.
 *
 * @component
 * @param {MainGridComponentOptions} props - Configuration options for MainGridComponent.
 * @param {React.ReactNode} props.children - Components or elements to display inside the grid.
 * @param {string} props.backgroundColor - Background color of the grid container.
 * @param {number} props.height - Height of the grid container.
 * @param {number} props.width - Width of the grid container.
 * @param {boolean} [props.showAspect=true] - Controls whether the grid container is visible.
 * @param {string} [props.timeBackgroundColor='transparent'] - Background color of the meeting progress timer.
 * @param {boolean} [props.showTimer=true] - Controls visibility of the meeting progress timer.
 * @param {string} props.meetingProgressTime - Time to display on the meeting progress timer.
 *
 * @returns {JSX.Element} The MainGridComponent with configurable dimensions, background color, and optional timer.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { MainGridComponent } from 'mediasfu-reactnative-expo';
 *
 * function App() {
 *   return (
 *     <MainGridComponent
 *       backgroundColor="lightgray"
 *       height={500}
 *       width={300}
 *       showAspect={true}
 *       timeBackgroundColor="blue"
 *       showTimer={true}
 *       meetingProgressTime="12:34"
 *     >
 *       <Text>Grid Content</Text>
 *     </MainGridComponent>
 *   );
 * }
 *
 * export default App;
 * ```
 */

const MainGridComponent: React.FC<MainGridComponentOptions> = ({
  children,
  backgroundColor,
  height,
  width,
  showAspect = true,
  timeBackgroundColor = 'transparent',
  showTimer = true,
  meetingProgressTime,
  style,
  renderContent,
  renderContainer,
}) => {
  const dimensions = { width, height };

  const defaultContent = (
    <>
      {showTimer && (
        <MeetingProgressTimer
          meetingProgressTime={meetingProgressTime}
          initialBackgroundColor={timeBackgroundColor}
          showTimer={showTimer}
        />
      )}
      {children}
    </>
  );

  const content = renderContent 
    ? renderContent({ defaultContent, dimensions }) 
    : defaultContent;

  const defaultContainer = (
    <View
      style={[
        styles.maingridContainer,
        {
          backgroundColor,
          height,
          width,
          display: showAspect ? 'flex' : 'none',
        },
        style,
      ]}
    >
      {content}
    </View>
  );

  return renderContainer 
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

export default MainGridComponent;

/**
 * Stylesheet for the MainGridComponent.
 */
const styles = StyleSheet.create({
  maingridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 4,
  },
});
