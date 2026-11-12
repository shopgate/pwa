import appConfig from '@shopgate/pwa-common/helpers/config';
import type { Breakpoint } from '@shopgate/engage/styles/theme';
import type { ReviewsConfig } from '@shopgate/pwa-common-commerce/reviews/types/reviews';
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
  'fractionBelow',
  'progressbar',
];

export const DEFAULT_SHOW_REVIEWS = !!(appConfig as ReviewsConfig).hasReviews;

export const DEFAULT_SHOW_WRITE_REVIEW = !!(appConfig as ReviewsConfig).showWriteReview;
