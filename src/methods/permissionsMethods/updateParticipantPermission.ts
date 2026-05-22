import { Socket } from "socket.io-client";
import { Participant, ShowAlert } from "../../@types/types";
import {
  updateParticipantPermission as sharedUpdateParticipantPermission,
  bulkUpdateParticipantPermissions as sharedBulkUpdateParticipantPermissions,
} from 'mediasfu-shared';

/**
 * Permission level values:
 * - "2": Host (full permissions, cannot be changed)
 * - "1": Co-host/Elevated (extended permissions)
 * - "0": Participant (basic permissions)
 */
export type PermissionLevel = "0" | "1" | "2";

export interface UpdateParticipantPermissionOptions {
  socket: Socket;
  participant: Participant;
  newLevel: PermissionLevel;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
}

export interface BulkUpdateParticipantPermissionsOptions {
  socket: Socket;
  participants: Participant[];
  newLevel: PermissionLevel;
  member: string;
  islevel: string;
  roomName: string;
  showAlert?: ShowAlert;
  maxBatchSize?: number; // Default 50
}

// Export type definitions
export type UpdateParticipantPermissionType = (
  options: UpdateParticipantPermissionOptions
) => Promise<void>;

export type BulkUpdateParticipantPermissionsType = (
  options: BulkUpdateParticipantPermissionsOptions
) => Promise<void>;

/**
 * Updates a single participant's permission level.
 * Only hosts (islevel === "2") can update permissions.
 * Cannot change a host's permission level.
 *
 * @param {UpdateParticipantPermissionOptions} options - Options for updating permission.
 *
 * @example
 * ```typescript
 * await updateParticipantPermission({
 *   socket,
 *   participant: { id: "123", name: "John", islevel: "0" },
 *   newLevel: "1",
 *   member: "currentUser",
 *   islevel: "2",
 *   roomName: "room123",
 *   showAlert: (alert) => console.log(alert.message),
 * });
 * ```
 */
export const updateParticipantPermission = async ({
  socket,
  participant,
  newLevel,
  member,
  islevel,
  roomName,
  showAlert,
}: UpdateParticipantPermissionOptions): Promise<void> => {
  await sharedUpdateParticipantPermission({
    socket,
    participant,
    newLevel,
    member,
    islevel,
    roomName,
    showAlert,
  } as any);
};

/**
 * Updates multiple participants' permission levels in bulk.
 * Only hosts (islevel === "2") can update permissions.
 * Processes in batches (default max 50 at a time).
 *
 * @param {BulkUpdateParticipantPermissionsOptions} options - Options for bulk updating permissions.
 *
 * @example
 * ```typescript
 * await bulkUpdateParticipantPermissions({
 *   socket,
 *   participants: [participant1, participant2],
 *   newLevel: "0",
 *   member: "currentUser",
 *   islevel: "2",
 *   roomName: "room123",
 *   showAlert: (alert) => console.log(alert.message),
 *   maxBatchSize: 50,
 * });
 * ```
 */
export const bulkUpdateParticipantPermissions = async ({
  socket,
  participants,
  newLevel,
  member,
  islevel,
  roomName,
  showAlert,
  maxBatchSize = 50,
}: BulkUpdateParticipantPermissionsOptions): Promise<void> => {
  await sharedBulkUpdateParticipantPermissions({
    socket,
    participants,
    newLevel,
    member,
    islevel,
    roomName,
    showAlert,
    maxBatchSize,
  } as any);
};
