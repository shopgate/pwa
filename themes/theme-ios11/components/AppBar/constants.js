import { INDEX_PATH } from '@shopgate/engage/core/constants';
import {
  LOGIN_PATH, CHECKOUT_PATH, REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import { ITEM_PATTERN, ITEM_GALLERY_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import { CATEGORY_FILTER_PATTERN, CATEGORY_ALL_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
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
