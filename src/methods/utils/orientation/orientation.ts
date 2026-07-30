import * as ScreenOrientation from 'expo-screen-orientation';
import { Dimensions } from 'react-native';

export type ExpoOrientationType =
  | 'PORTRAIT'
  | 'PORTRAIT-UPSIDEDOWN'
  | 'LANDSCAPE-LEFT'
  | 'LANDSCAPE-RIGHT'
  | 'UNKNOWN';

type OrientationListener = (orientation: ExpoOrientationType) => void;
type OrientationSubscription = ReturnType<
  typeof ScreenOrientation.addOrientationChangeListener
>;

const listeners = new Map<OrientationListener, OrientationSubscription>();
let locked = false;

function toOrientationType(
  orientation: ScreenOrientation.Orientation,
): ExpoOrientationType {
  switch (orientation) {
    case ScreenOrientation.Orientation.PORTRAIT_UP:
      return 'PORTRAIT';
    case ScreenOrientation.Orientation.PORTRAIT_DOWN:
      return 'PORTRAIT-UPSIDEDOWN';
    case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
      return 'LANDSCAPE-LEFT';
    case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      return 'LANDSCAPE-RIGHT';
    default:
      return 'UNKNOWN';
  }
}

const Orientation = {
  lockToPortrait: () => {
    locked = true;
    return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  },
  unlockAllOrientations: () => {
    locked = false;
    return ScreenOrientation.unlockAsync();
  },
  getInitialOrientation: (): ExpoOrientationType => {
    const { width, height } = Dimensions.get('window');
    return height >= width ? 'PORTRAIT' : 'LANDSCAPE-LEFT';
  },
  isLocked: () => locked,
  getOrientation: (callback: OrientationListener) => {
    void ScreenOrientation.getOrientationAsync().then((orientation) => {
      callback(toOrientationType(orientation));
    });
  },
  getDeviceOrientation: (callback: OrientationListener) => {
    void ScreenOrientation.getOrientationAsync().then((orientation) => {
      callback(toOrientationType(orientation));
    });
  },
  addOrientationListener: (callback: OrientationListener) => {
    const subscription = ScreenOrientation.addOrientationChangeListener(
      ({ orientationInfo }) => {
        callback(toOrientationType(orientationInfo.orientation));
      },
    );
    listeners.set(callback, subscription);
    return subscription;
  },
  removeOrientationListener: (callback: OrientationListener) => {
    const subscription = listeners.get(callback);
    if (subscription) {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      listeners.delete(callback);
    }
  },
  removeAllListeners: () => {
    ScreenOrientation.removeOrientationChangeListeners();
    listeners.clear();
  },
};

export default Orientation;
