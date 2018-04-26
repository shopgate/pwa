/**
 * Command and event names.
 */
export const GET_PERMISSIONS_COMMAND_NAME = 'getAppPermissions';
export const GET_PERMISSIONS_RESPONSE_EVENT_NAME = 'getAppPermissionsResponse';

export const REQUEST_PERMISSIONS_COMMAND_NAME = 'requestAppPermissions';
export const REQUEST_PERMISSIONS_RESPONSE_EVENT_NAME = 'requestAppPermissionsResponse';

/**
 * Permission ids.
 */
export const PERMISSION_ID_LOCATION = 'location';
export const PERMISSION_ID_CAMERA = 'camera';

// Only available on Android
export const PERMISSION_ID_PHONE = 'phone';
// Only available in iOS
export const PERMISSION_ID_PUSH = 'push';
// Only available on iOS
export const PERMISSION_ID_BACKGROUND_APP_REFRESH = 'backgroundAppRefresh';

export const availablePermissionsIds = [
  PERMISSION_ID_BACKGROUND_APP_REFRESH,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PHONE,
  PERMISSION_ID_PUSH,
];

/**
 * Permission usages.
 */
export const USAGE_ALWAYS = 'always';
export const USAGE_WHEN_IN_USE = 'whenInUse';

export const availableUsages = [
  USAGE_ALWAYS,
  USAGE_WHEN_IN_USE,
];

/**
 * Permission statuses
 */
export const STATUS_DENIED = 'denied';
export const STATUS_GRANTED = 'granted';
export const STATUS_NOT_DETERMINED = 'notDetermined';
export const STATUS_NOT_SUPPORTED = 'notSupported';

export const availableStatuses = [
  STATUS_DENIED,
  STATUS_GRANTED,
  STATUS_NOT_DETERMINED,
  STATUS_NOT_SUPPORTED,
];
