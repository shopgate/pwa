import type { Breakpoint } from '@shopgate/engage/styles/theme';
import type { ProductGalleryPagination, ScreenSize } from '../types/appSettings';

export const RECEIVE_APP_SETTINGS = 'RECEIVE_APP_SETTINGS';

export const SCREEN_SIZE_BREAKPOINTS: Record<ScreenSize, Breakpoint> = {
  small: 'xs',
  medium: 'sm',
  large: 'md',
};

export const PRODUCT_GALLERY_PAGINATIONS: readonly ProductGalleryPagination[] = [
  'bullets',
  'bulletsBelow',
  'fraction',
  'progressbar',
];
