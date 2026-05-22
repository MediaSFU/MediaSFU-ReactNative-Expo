/**
 * Handler for permission-related socket events.
 * Listens for:
 * - permissionUpdated: When a user's permission level changes
 * - permissionConfigUpdated: When the room's permission configuration changes
 */

export {
  permissionConfigUpdated,
  permissionUpdated,
} from 'mediasfu-shared';

export type {
  PermissionCapabilities,
  PermissionConfigUpdatedData,
  PermissionConfigUpdatedOptions,
  PermissionConfigUpdatedType,
  PermissionConfig,
  PermissionUpdatedData,
  PermissionUpdatedOptions,
  PermissionUpdatedType,
} from 'mediasfu-shared';
