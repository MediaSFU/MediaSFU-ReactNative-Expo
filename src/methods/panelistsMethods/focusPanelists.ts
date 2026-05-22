import { Socket } from "socket.io-client";
import { ShowAlert } from "../../@types/types";
import {
  focusPanelists as sharedFocusPanelists,
  unfocusPanelists as sharedUnfocusPanelists,
} from 'mediasfu-shared';

export interface FocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  focusEnabled: boolean;
  muteOthersMic?: boolean;
  muteOthersCamera?: boolean;
  showAlert?: ShowAlert;
}

export interface UnfocusPanelistsOptions {
  socket: Socket;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

// Export type definitions
export type FocusPanelistsType = (options: FocusPanelistsOptions) => Promise<void>;
export type UnfocusPanelistsType = (options: UnfocusPanelistsOptions) => Promise<void>;

/**
 * Focuses the display on panelists only.
 * When enabled, only panelists appear on the grid.
 * Optionally mutes other participants' mic and/or camera.
 *
 * @param {FocusPanelistsOptions} options - Options for focusing panelists.
 *
 * @example
 * ```typescript
 * await focusPanelists({
 *   socket,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   focusEnabled: true,
 *   muteOthersMic: true,
 *   muteOthersCamera: false,
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const focusPanelists = async ({
  socket,
  roomName,
  member,
  islevel,
  focusEnabled,
  muteOthersMic = false,
  muteOthersCamera = false,
  showAlert,
}: FocusPanelistsOptions): Promise<void> => {
  await sharedFocusPanelists({
    socket,
    roomName,
    member,
    islevel,
    focusEnabled,
    muteOthersMic,
    muteOthersCamera,
    showAlert,
  } as any);
};

/**
 * Disables panelist focus mode.
 * All participants will be shown on the grid again.
 *
 * @param {UnfocusPanelistsOptions} options - Options for unfocusing panelists.
 *
 * @example
 * ```typescript
 * await unfocusPanelists({
 *   socket,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const unfocusPanelists = async ({
  socket,
  roomName,
  member,
  islevel,
  showAlert,
}: UnfocusPanelistsOptions): Promise<void> => {
  await sharedUnfocusPanelists({
    socket,
    roomName,
    member,
    islevel,
    showAlert,
  } as any);
};
