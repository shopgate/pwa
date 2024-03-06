/**
 * Permission ids.
 */
export const PERMISSION_ID_LOCATION = 'location';
export const PERMISSION_ID_CAMERA = 'camera';

// Only available on Android
export const PERMISSION_ID_PHONE = 'phone';
export const PERMISSION_ID_BACKGROUND_LOCATION = 'background_location';

// Only available in iOS
export const PERMISSION_ID_PUSH = 'push';
// Only available on iOS
export const PERMISSION_ID_BACKGROUND_APP_REFRESH = 'backgroundAppRefresh';

export const availablePermissionsIds = [
  PERMISSION_ID_BACKGROUND_APP_REFRESH,
  PERMISSION_ID_BACKGROUND_LOCATION,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PHONE,
  PERMISSION_ID_PUSH,
];

/**
 * Permission usages.
 */

/**
 * @deprecated Use PERMISSION_USAGE_ALWAYS instead
 */
export const USAGE_ALWAYS = 'always';

/**
 * @deprecated Use PERMISSION_USAGE_WHEN_IN_USE instead
 */
export const USAGE_WHEN_IN_USE = 'whenInUse';

export const availableUsages = [
  USAGE_ALWAYS,
  USAGE_WHEN_IN_USE,
];

export const PERMISSION_USAGE_ALWAYS = 'always';
export const PERMISSION_USAGE_WHEN_IN_USE = 'whenInUse';

export const availablePermissionUsages = [
  PERMISSION_USAGE_ALWAYS,
  PERMISSION_USAGE_WHEN_IN_USE,
];

/**
 * Permission statuses
 */

/**
 * @deprecated Use PERMISSION_STATUS_DENIED instead
 */
export const STATUS_DENIED = 'denied';

/**
 * @deprecated Use PERMISSION_STATUS_GRANTED instead
 */
export const STATUS_GRANTED = 'granted';

/**
 * @deprecated Use PERMISSION_STATUS_NOT_DETERMINED instead
 */
export const STATUS_NOT_DETERMINED = 'notDetermined';

/**
 * @deprecated Use PERMISSION_STATUS_NOT_SUPPORTED instead
 */
export const STATUS_NOT_SUPPORTED = 'notSupported';

/**
 * @deprecated Use availablePermissionStatuses instead
 */
export const availableStatuses = [
  STATUS_DENIED,
  STATUS_GRANTED,
  STATUS_NOT_DETERMINED,
  STATUS_NOT_SUPPORTED,
];

export const PERMISSION_STATUS_DENIED = 'denied';
export const PERMISSION_STATUS_GRANTED = 'granted';
export const PERMISSION_STATUS_NOT_DETERMINED = 'notDetermined';
export const PERMISSION_STATUS_NOT_SUPPORTED = 'notSupported';

export const availablePermissionStatuses = [
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
];
