import { INDEX_PATH } from '@shopgate/engage/core/constants';
import {
  LOGIN_PATH, CHECKOUT_PATH, REGISTER_PATH, PAGE_PATTERN,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { ITEM_PATTERN, ITEM_GALLERY_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import {
  CATEGORY_FILTER_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
  CATEGORY_PATTERN,
  CATEGORY_ALL_PATTERN,
  ROOT_CATEGORY_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_FILTER_PATTERN, SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { checkoutRoutes } from '@shopgate/engage/checkout';
import { FORGOT_PASSWORD_PATTERN } from '@shopgate/engage/login';

export const OVERLAY_PATTERNS = [INDEX_PATH, ITEM_PATTERN];

export const ACTION_BUTTONS_HIDDEN_PATTERNS = [
  ITEM_GALLERY_PATTERN,
  CATEGORY_FILTER_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  LOGIN_PATH,
  CHECKOUT_PATH,
  SCANNER_PATH,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATTERN,
  ...checkoutRoutes,
];

export const APP_BAR_BUTTON_SIZE = 44;

export const SEARCH_BAR_PAGE_TYPES = {
  [INDEX_PATH]: 'home',
  [ROOT_CATEGORY_PATTERN]: 'category',
  [CATEGORY_PATTERN]: 'category',
  [CATEGORY_ALL_PATTERN]: 'category',
  [SEARCH_PATTERN]: 'search',
  [ITEM_PATTERN]: 'product',
  [PAGE_PATTERN]: 'page',
  [FAVORITES_PATH]: 'favorites',
};

export const HEADLINE_HIDDEN_PATTERNS = [SCANNER_PATH, ITEM_GALLERY_PATTERN];
