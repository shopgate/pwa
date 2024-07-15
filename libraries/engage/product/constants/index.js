// MEDIA TYPES
export const MEDIA_TYPE_IMAGE = 'image';
export const MEDIA_TYPE_VIDEO = 'video';

// AVAILABILITY TYPES
export const AVAILABILITY_TYPE_COMING_SOON = 'comingSoon';
export const AVAILABILITY_TYPE_AVAILABLE = 'available';
export const AVAILABILITY_TYPE_LIMITED_AVAILABILITY = 'limitedAvailability';
export const AVAILABILITY_TYPE_NOT_AVAILABLE = 'notAvailable';
export const AVAILABILITY_TYPE_CUSTOM_AVAILABILITY = 'customAvailability';
export const availabilityTypes = [
  AVAILABILITY_TYPE_AVAILABLE,
  AVAILABILITY_TYPE_LIMITED_AVAILABILITY,
  AVAILABILITY_TYPE_NOT_AVAILABLE,
  AVAILABILITY_TYPE_CUSTOM_AVAILABILITY,
];

export * from '@shopgate/pwa-common-commerce/product/constants/index';
export * from '@shopgate/pwa-common-commerce/product/constants/Pipelines';
export * from '@shopgate/pwa-common-commerce/product/constants/Portals';
