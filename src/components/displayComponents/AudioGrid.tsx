// AudioGrid.tsx

import React from 'react';
import {
  View,
} from 'react-native';

export interface AudioGridOptions {
  componentsToRender: React.ReactNode[]; // Array of React components or elements

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

export type AudioGridType = (options: AudioGridOptions) => React.ReactNode;

/**
 * AudioGrid component renders a grid layout of audio components or elements.
 *
 * This component organizes an array of audio components or elements into a flexible grid.
 *
 * @component
 * @param {AudioGridOptions} props - Properties for the AudioGrid component.
 * @param {React.ReactNode[]} props.componentsToRender - Array of React components or elements to render in the grid.
 *
 * @returns {JSX.Element} The AudioGrid component rendering a grid of audio components.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { AudioGrid, AudioCard } from 'mediasfu-reactnative-expo';
 *
 * function App() {
 *   const components = [
 *     <AudioCard name="Participant 1" />,
 *     <AudioCard name="Participant 2" />,
 *     <AudioCard name="Participant 3" />
 *   ];
 *
 *   return (
 *     <AudioGrid componentsToRender={components} />
 *   );
 * }
 *
 * export default App;
 * ```
 */

const AudioGrid: React.FC<AudioGridOptions> = ({ 
  componentsToRender,
  style,
  renderContent,
  renderContainer,
}) => {
  /**
   * renderGrid - Renders componentsToRender array into a grid.
   * @returns {React.ReactNode[]} - An array of React components rendered in the grid.
   */
  const renderGrid = (): React.ReactNode[] => {
    const renderedComponents = [];

    for (let index = 0; index < componentsToRender.length; index++) {
      const component = componentsToRender[index];
      renderedComponents.push(<View style={{ zIndex: 9 }} key={index}>{component}</View>);
    }

    return renderedComponents;
  };

  const dimensions = { width: 0, height: 0 }; // AudioGrid doesn't have fixed dimensions

  const defaultContent = renderGrid();
  const content = renderContent 
    ? renderContent({ defaultContent, dimensions }) 
    : defaultContent;

  const defaultContainer = (
    <View style={[{ zIndex: 9 }, style]}>{content}</View>
  );

  return renderContainer 
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

export default AudioGrid;
