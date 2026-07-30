import type React from 'react';

// Keep the SDK's established JSX namespace contracts working with React 19.
declare global {
  namespace JSX {
    type ElementType = React.JSX.ElementType;
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
  }
}

export {};
