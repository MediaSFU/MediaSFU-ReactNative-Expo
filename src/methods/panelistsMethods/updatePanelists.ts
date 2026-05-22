import { Socket } from "socket.io-client";
import { Participant, ShowAlert } from "../../@types/types";
import {
  updatePanelists as sharedUpdatePanelists,
  addPanelist as sharedAddPanelist,
  removePanelist as sharedRemovePanelist,
} from 'mediasfu-shared';

export interface UpdatePanelistsOptions {
  socket: Socket;
  panelists: Participant[];
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface AddPanelistOptions {
  socket: Socket;
  participant: Participant;
  currentPanelists: Participant[];
  maxPanelists: number;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

export interface RemovePanelistOptions {
  socket: Socket;
  participant: Participant;
  roomName: string;
  member: string;
  islevel: string;
  showAlert?: ShowAlert;
}

// Export type definitions
export type UpdatePanelistsType = (options: UpdatePanelistsOptions) => Promise<void>;
export type AddPanelistType = (options: AddPanelistOptions) => Promise<boolean>;
export type RemovePanelistType = (options: RemovePanelistOptions) => Promise<void>;

/**
 * Updates the entire panelist list.
 * Only hosts (islevel === "2") can update panelists.
 *
 * @param {UpdatePanelistsOptions} options - Options for updating panelists.
 *
 * @example
 * ```typescript
 * await updatePanelists({
 *   socket,
 *   panelists: [participant1, participant2],
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const updatePanelists = async (options: UpdatePanelistsOptions): Promise<void> => {
  await sharedUpdatePanelists(options as any);
};

/**
 * Adds a participant to the panelist list.
 * Respects the maximum panelist limit.
 *
 * @param {AddPanelistOptions} options - Options for adding a panelist.
 * @returns {Promise<boolean>} True if added successfully, false otherwise.
 *
 * @example
 * ```typescript
 * const success = await addPanelist({
 *   socket,
 *   participant: { id: "123", name: "John" },
 *   currentPanelists: [],
 *   maxPanelists: 10,
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const addPanelist = async (options: AddPanelistOptions): Promise<boolean> => {
  return sharedAddPanelist(options as any);
};

/**
 * Removes a participant from the panelist list.
 *
 * @param {RemovePanelistOptions} options - Options for removing a panelist.
 *
 * @example
 * ```typescript
 * await removePanelist({
 *   socket,
 *   participant: { id: "123", name: "John" },
 *   roomName: "room123",
 *   member: "currentUser",
 *   islevel: "2",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const removePanelist = async (options: RemovePanelistOptions): Promise<void> => {
  await sharedRemovePanelist(options as any);
};
