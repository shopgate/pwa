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
export const PERMISSION_ID_APP_TRACKING_TRANSPARENCY = 'appTrackingTransparency';

export const availablePermissionsIds = [
  PERMISSION_ID_BACKGROUND_APP_REFRESH,
  PERMISSION_ID_BACKGROUND_LOCATION,
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  PERMISSION_ID_PHONE,
  PERMISSION_ID_PUSH,
  PERMISSION_ID_APP_TRACKING_TRANSPARENCY,
];

/**
 * Permission usages.
 */

export const PERMISSION_USAGE_ALWAYS = 'always';
export const PERMISSION_USAGE_WHEN_IN_USE = 'whenInUse';

export const availablePermissionUsages = [
  PERMISSION_USAGE_ALWAYS,
  PERMISSION_USAGE_WHEN_IN_USE,
];

/**
 * @deprecated Use PERMISSION_USAGE_ALWAYS instead
 */
export const USAGE_ALWAYS = PERMISSION_USAGE_ALWAYS;

/**
 * @deprecated Use PERMISSION_USAGE_WHEN_IN_USE instead
 */
export const USAGE_WHEN_IN_USE = PERMISSION_USAGE_WHEN_IN_USE;

/**
 * @deprecated Use availablePermissionUsages instead
 */
export const availableUsages = availablePermissionUsages;

/**
 * Permission statuses
 */

/**
 * User has denied the permission and will not be asked again.
 */
export const PERMISSION_STATUS_DENIED = 'denied';
/**
 * User has granted the permission.
 */
export const PERMISSION_STATUS_GRANTED = 'granted';
/**
 * User has not yet made a choice regarding the permission.
 */
export const PERMISSION_STATUS_NOT_DETERMINED = 'notDetermined';
/**
 * The permission is not supported on the current device.
 */
export const PERMISSION_STATUS_NOT_SUPPORTED = 'notSupported';

export const availablePermissionStatuses = [
  PERMISSION_STATUS_DENIED,
  PERMISSION_STATUS_GRANTED,
  PERMISSION_STATUS_NOT_DETERMINED,
  PERMISSION_STATUS_NOT_SUPPORTED,
];

/**
 * @deprecated Use PERMISSION_STATUS_DENIED instead
 */
export const STATUS_DENIED = PERMISSION_STATUS_DENIED;

/**
 * @deprecated Use PERMISSION_STATUS_GRANTED instead
 */
export const STATUS_GRANTED = PERMISSION_STATUS_GRANTED;

/**
 * @deprecated Use PERMISSION_STATUS_NOT_DETERMINED instead
 */
export const STATUS_NOT_DETERMINED = PERMISSION_STATUS_NOT_DETERMINED;

/**
 * @deprecated Use PERMISSION_STATUS_NOT_SUPPORTED instead
 */
export const STATUS_NOT_SUPPORTED = PERMISSION_STATUS_NOT_SUPPORTED;

/**
 * @deprecated Use availablePermissionStatuses instead
 */
export const availableStatuses = availablePermissionStatuses;
